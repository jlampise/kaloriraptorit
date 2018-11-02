import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import TextInput from './parts/form/TextInput';
import PasswordInput from './parts/form/PasswordInput';
import validate from './parts/form/validateRegisterForm';
import axios from 'axios';

import '../css/userForm.css';

class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      error: ''
    };
  }

  componentDidUpdate() {
    if (this.props.auth.data && this.props.auth.data !== '') {
      this.props.history.push('/');
    }
  }

  onSubmit = values => {
    this.setState({ message: '', error: '' });
    this.registerUser(values.username, values.password);
    this.props.reset();
  };

  registerUser = async (username, password) => {
    try {
      await axios.post('/auth/register', { username, password });
      this.setState({ message: `Successfully created user ${username}` });
    } catch (err) {
      if (err.response && err.response.status === 409) {
        this.setState({ error: 'Username is already in use!' });
      } else {
        this.setState({ error: 'Error: registration failed!' });
      }
    }
  };

  render() {
    return (
      <div className="container userform-container">
        <h1>Register new User</h1>
        <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
          <Field name="username" label="Username" component={TextInput} />
          <Field name="password" label="Password" component={PasswordInput} />
          <button type="submit" className="btn btn-success">
            Register
          </button>
        </form>
        <div className="userform-error">
          <p>{this.state.error}</p>
        </div>
        <div className="userform-message">
          <p>{this.state.message}</p>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return {
    auth
  };
}

export default connect(
  mapStateToProps,
  null
)(
  reduxForm({
    form: 'registerUser',
    validate
  })(RegisterForm)
);
