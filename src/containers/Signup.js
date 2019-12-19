import React from 'react';

import { registerUser } from '../services/session';

class Signup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loginForm: {
        handle: '',
        name: '',
        password: '',
      },
    };
  }

  handleInputChange(field, event) {
    this.setState({
      [field]: event.target.id
    });
  }

  render() {
    return (
      <div>
        <h1>Signup</h1>
        <form>
          <label>
            Full name:
            <input type="text" value={this.state.loginForm.name} onChange={this.handleInputChange.bind(this, 'name')} />
          </label>
          <label>
            Handle:
            <input type="text" value={this.state.loginForm.handle} onChange={this.handleInputChange.bind(this, 'handle')} />
          </label>
          <label>
            Password:
            <input type="password" value={this.state.loginForm.password} onChange={this.handleInputChange.bind(this, 'password')} />
          </label>
        </form>
      </div>
    );
  }
}

export default Signup;
