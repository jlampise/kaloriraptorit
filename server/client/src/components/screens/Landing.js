import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import '../../css/landing.css';

class Landing extends Component {
  renderActions(login) {
    if (login) {
      return (
        <div>
          <p>
            You can save and modify your daily meals. Use your own ingredients
            or get them from Fineli API. Set your water intake values and
            targets.
          </p>
          <p>
            <Link className="btn btn-info btn-md btn-meals" to="/daily">
              Go to Meals!
            </Link>
            <Link className="btn btn-info btn-md btn-new-meal" to="/meals/new">
              Add a Meal!
            </Link>
          </p>
          <p>
            Examine your nutrition history! Set the timeline and load graphs
            showing your daily water consumption, energy and macronutrients.
          </p>
          <p>
            <Link className="btn btn-info btn-md btn-trends" to="/trends">
              Go to Trends!
            </Link>
          </p>
        </div>
      );
    }
  }

  render() {
    if (this.props.auth.loading === true) {
      return;
    }

    // Default not-logged-in -stuff
    let welcome = 'Hello Stranger!';
    let nextSteps = 'Log in with Google!';
    let login = false;

    // logged-in -stuff
    if (!(this.props.auth.data === null || this.props.auth.data === '')) {
      welcome = `Hello ${this.props.auth.data.name}!`;
      nextSteps = 'Track your meals and water intake and examine your trends!';
      login = true;
    }

    return (
      <div className="container landing-container">
        <div className="jumbotron">
          <h1 className="display-4">{welcome}</h1>
          <p className="lead">{nextSteps}</p>
          <hr className="my-4" />
          {this.renderActions(login)}
        </div>
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(
  mapStateToProps,
  null
)(Landing);
