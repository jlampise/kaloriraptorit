import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './Navbar.css';

class Navbar extends Component {
  isLoggedIn() {
    if (this.props.auth.data === null) {
      return false;
    } else if (this.props.auth.data !== '') {
      return true;
    }
    return false;
  }

  isLoadingAuth() {
    return this.props.auth.isLoading === true;
  }

  renderAuthNav() {
    if (this.isLoadingAuth()) {
      return null;
    } else if (this.isLoggedIn()) {
      return (
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a className="nav-link" href="/api/logout">
              Logout
            </a>
          </li>
        </ul>
      );
    } else {
      return (
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/register">
              Register
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/login">
              Login
            </Link>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/auth/google">
              <i className="fab fa-google" />
              -Login
            </a>
          </li>
        </ul>
      );
    }
  }

  renderFeaturesNav() {
    if (this.isLoggedIn()) {
      return (
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/daily">
              My Meals
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/trends">
              My Trends
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/meals/new">
              New Meal
            </Link>
          </li>
        </ul>
      );
    } else {
      return <ul />;
    }
  }

  render() {
    return (
      <nav className="navbar navbar-expand-sm navbar-light bg-light">
        <div className="container">
          <div className="navbar-brand" href="#">
            <Link className="nav-link" to="/">
              KaloriRaptorit
            </Link>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {this.renderFeaturesNav()}
            {this.renderAuthNav()}
          </div>
        </div>
      </nav>
    );
  }
}

function mapsStateToProps({ auth, date }) {
  return { auth, date };
}

export default connect(
  mapsStateToProps,
  null
)(Navbar);
