import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import TextInput from './parts/form/TextInput';
import PasswordInput from './parts/form/PasswordInput';
import validate from './parts/form/validateRegisterForm';
import axios from 'axios';
import { fetchUser } from '../actions';

import '../css/userForm.css';

class LoginForm extends Component {
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
    this.loginUser(values.username, values.password);
    this.props.reset();
  };

  loginUser = async (username, password) => {
    try {
      await axios.post('/auth/login', { username, password });
      this.props.fetchUser();
      this.props.history.push('/');
    } catch (err) {
      this.setState({ error: 'Wrong username or passwod' });
    }
  };

  render() {
    return (
      <div className="container userform-container">
        <h1>Login User</h1>
        <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
          <Field name="username" label="Username" component={TextInput} />
          <Field name="password" label="Password" component={PasswordInput} />
          <button type="submit" className="btn btn-success">
            Login
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
  { fetchUser }
)(
  reduxForm({
    form: 'loginUser',
    validate
  })(LoginForm)
);
