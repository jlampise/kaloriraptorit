import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect';

import Navbar from './Navbar';
import DailyScreenComponent from './screens/Daily/Daily';
import MealFormSreenComponent from './screens/MealForm';
import TrendsScreenComponent from './screens/Trends';
import LandingScreen from './screens/Landing';
import LoginFormScreen from './screens/LoginForm';
import RegisterFormScreen from './screens/RegisterForm';
import './App.css';

const LoadingSpinner = () => <h2>Checking authentication...</h2>;

const userIsAuthenticated = connectedRouterRedirect({
  redirectPath: '/',
  authenticatedSelector: state => state.auth.data !== '',
  wrapperDisplayName: 'UserIsAuthenticated',
  // Returns true if the user auth state is loading
  authenticatingSelector: state => state.auth.isLoading,
  // Render this component when the authenticatingSelector returns true
  AuthenticatingComponent: LoadingSpinner
});

const DailyScreen = userIsAuthenticated(DailyScreenComponent);
const MealFormScreen = userIsAuthenticated(MealFormSreenComponent);
const TrendsScreen = userIsAuthenticated(TrendsScreenComponent);

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    return (
      <div className="container-fluid">
        <BrowserRouter>
          <div>
            <Navbar />
            <Switch>
              <Route exact path="/" component={LandingScreen} />
              <Route exact path="/daily" component={DailyScreen} />
              <Route exact path="/meals/new" component={MealFormScreen} />
              <Route exact path="/meals/edit/:id" component={MealFormScreen} />
              <Route exact path="/trends" component={TrendsScreen} />
              <Route exact path="/register" component={RegisterFormScreen} />
              <Route exact path="/login" component={LoginFormScreen} />
              <Route path="/" render={() => <Redirect to="/" />} />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect(
  null,
  actions
)(App);
