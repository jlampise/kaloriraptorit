import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect';

import DailyMealsComponent from './DailyMeals';
import Navbar from './Navbar';
import Landing from './Landing';
import MealEditFormComponent from './MealEditForm';
import TrendsComponent from './Trends';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import '../css/app.css';

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

const DailyMeals = userIsAuthenticated(DailyMealsComponent);
const MealEditForm = userIsAuthenticated(MealEditFormComponent);
const Trends = userIsAuthenticated(TrendsComponent);

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
              <Route exact path="/" component={Landing} />
              <Route exact path="/meals" component={DailyMeals} />
              <Route exact path="/meals/new" component={MealEditForm} />
              <Route exact path="/meals/edit/:id" component={MealEditForm} />
              <Route exact path="/trends" component={Trends} />
              <Route exact path="/register" component={RegisterForm} />
              <Route exact path="/login" component={LoginForm} />
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
