import React from 'react';

import { createSession } from '../services/session';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loginForm: {
        handle: '',
        password: '',
      },
      error: null,
      isLoggingIn: false,
    };
  }

  handleInputChange(field, event) {
    this.setState({
      loginForm: {
        ...this.state.loginForm,
        [field]: event.target.value
      }
    });
  }

  async handleLogin(event) {
    event.preventDefault();

    const {
      history
    } = this.props;

    const {
      loginForm: {
        handle,
        password,
      } = {},
    } = this.state;

    try {
      const { token, error } = await createSession({ handle, password });

      if (error) {
        throw new Error(error);
      }

      if (!token) {
        throw new Error('No token received - try again');
      }

      /**
       * Save token in local storage and redirect to /
       * for authentication which then redirects to /home
       */
      localStorage.setItem('twitter_clone_token', token);
      history.replace('/');
    } catch (error) {
      this.setState({ error });
    }
  }

  render() {
    const { error, isLoggingIn, loginForm } = this.state;

    return (
      <div style={{ textAlign: 'center' }}>
        <h1>Login (test)</h1>
        <form>
          <div>
            <label>
              Handle:
              <input type="text" value={loginForm.handle} onChange={this.handleInputChange.bind(this, 'handle')} />
            </label>
          </div>
          <div>
            <label>
              Password:
              <input type="password" value={loginForm.password} onChange={this.handleInputChange.bind(this, 'password')} />
            </label>
          </div>
          <div>
            <button onClick={this.handleLogin.bind(this)}>Login</button>
          </div>
          <div>
            {isLoggingIn && <p>Logging in...</p>}
            {error && <p>Unable to login: {error.message}</p>}
          </div>
        </form>
      </div>
    );
  }
}

export default Login;
