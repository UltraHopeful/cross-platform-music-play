import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";

import { SubscriptionClient } from "subscriptions-transport-ws";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

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
});

export default client;
