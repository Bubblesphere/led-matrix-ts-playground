import * as React from 'react';
import { Component } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import App from './App';

interface AppRouterProps { }
interface AppRouterState { }

const theme = createMuiTheme({
  palette: {
  }
});


class AppRouter extends Component<AppRouterProps, AppRouterState> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Router>
          <App />
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default AppRouter;