import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";

import { GET_QUEUED_SONGS } from "./queries";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { gql } from "@apollo/client";

const secret = process.env.REACT_APP_HASURA_ADMIN_SECRET;

const httpLink = new HttpLink({
  uri: "https://prompt-anchovy-46.hasura.app/v1/graphql",
  headers: {
    "x-hasura-admin-secret": secret,
  },
});

const wsLink = new WebSocketLink(
  new SubscriptionClient("wss://prompt-anchovy-46.hasura.app/v1/graphql", {
    reconnect: true, connectionParams: {
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": secret,
      },
      lazy: true,
    }
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  typeDefs: gql`
    type Song {
      id:uuid!,
      title:String!,
      artist:String!,
      thumbnail:String!,
      url:String!,
      duration:Float!,
    }
    input SongInput{
      id:uuid!,
      title:String!,
      artist:String!,
      thumbnail:String!,
      url:String!,
      duration:Float!,
    }
    type Query{
      queuedSongs: [Song]!
    }
    
    type Mutation{
      addOrRemoveFromQueue(input:SongInput!): [Song]!
    }
  `,
  resolvers: {
    Mutation: {
      addOrRemoveFromQueue: (_, {input}, {cache}) => {
        const queryResult = cache.readQuery({
          query:GET_QUEUED_SONGS
        })
        if(queryResult) {
          const {queue} = queryResult;
          const isInQueue = queue.some(song=>song.id === input.id)
          const newQueue = isInQueue ? queue.filter(song=>song.id !== input.id) : [...queue,input];
          cache.writeQuery({
            query:GET_QUEUED_SONGS,
            data:{queue:newQueue}
          })
          return newQueue
        }
        return [];
      }
    }
  }
});

const hasQueue = Boolean(localStorage.getItem('queue'));


client.writeQuery({
  query:GET_QUEUED_SONGS,
  data:{queue:hasQueue ? JSON.parse(localStorage.getItem('queue')) : [] }
})

export default client;
