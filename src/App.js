import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';

import './App.css';

import Login from './containers/Login';
import Signup from './containers/Signup';
import Authenticate from './containers/Authenticate';
import Feed from './containers/Feed';
import User from './containers/User';
import Logout from './containers/Logout';

import withAuthentication from './hocs/withAuthentication';

class App extends React.Component {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route path="/" exact component={Authenticate} />
          <Route path="/home" component={withAuthentication(Feed)} />
          <Route path="/login" component={Login} />
          <Route path="/logout" component={Logout} />
          <Route path="/signup" component={Signup} />
          <Route path="/:handle" component={withAuthentication(User)} />
        </Switch>
      </HashRouter>
    );
  }
}

export default App;
