import { CssBaseline, MuiThemeProvider } from "@material-ui/core";

import {ApolloProvider} from "@apollo/client";
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';
import client from "./graphql/client";
import theme from "./theme";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </MuiThemeProvider>
  </ApolloProvider>
);