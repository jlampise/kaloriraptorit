import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect';

import MealsComponent from '../components/Meals';
import Header from './Header';
import Landing from './Landing';
import MealEditComponent from './MealEdit';
import TrendsComponent from './Trends';

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

const Meals = userIsAuthenticated(MealsComponent);
const MealEdit = userIsAuthenticated(MealEditComponent);
const Trends = userIsAuthenticated(TrendsComponent);

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  isLoggedIn() {
    if (this.props.auth === null) {
      return false;
    } else if (this.props.auth === false) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    return (
      <div className="container-fluid">
        <BrowserRouter>
          <div>
            <Header />
            <Switch>
              <Route exact path="/" component={Landing} />
              <Route exact path="/meals" component={Meals} />
              <Route exact path="/meals/new" component={MealEdit} />
              <Route exact path="/meals/edit/:id" component={MealEdit} />
              <Route exact path="/trends" component={Trends} />
              <Route path="/" render={() => <Redirect to="/" />} />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

function mapsStateToProps({ auth }) {
  return { auth };
}
export default connect(mapsStateToProps, actions)(App);
