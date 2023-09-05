import { CssBaseline, MuiThemeProvider } from "@material-ui/core";

import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';
import theme from "./theme";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </MuiThemeProvider>,
);