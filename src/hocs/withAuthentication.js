import React from 'react';

import { checkSession } from '../services/session';

export default function withAuthentication(Component) {
  return class extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        isAuthenticated: false,
        isAuthenticating: false,
      };
    }

    async componentDidMount() {
      const { history } = this.props;

      const isAuthenticated = await checkSession();

      if (!isAuthenticated) {
        return history.replace('/login');
      }

      this.setState({ isAuthenticated });
    }

    render() {
      const {
        isAuthenticated,
        isAuthenticating,
      } = this.state;

      if (isAuthenticating) {
        return <div>Authenticating...</div>
      };

      if (!isAuthenticated) {
        return <div>Not authenticated</div>
      };

      return <Component {...this.props} />;
    }
  }
}
