import * as React from 'react';
import { Component } from 'react';
import { HashRouter as Router} from 'react-router-dom';
import App from './App';

interface AppRouterProps  {}
interface AppRouterState {}

class AppRouter extends Component<AppRouterProps, AppRouterState> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <App/>
      </Router>
    );
  }
}

export default AppRouter;