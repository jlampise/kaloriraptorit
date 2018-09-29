import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import '../css/navbar.css';

class Header extends Component {
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
    } else {
      return (
        <ul className="nav navbar-nav navbar-right">
          <li>
            <a href={this.isLoggedIn() ? '/api/logout' : '/auth/google'}>
              {this.isLoggedIn() ? 'Logout' : 'Login with Google'}
            </a>
          </li>
        </ul>
      );
    }
  }

  renderFeaturesNav() {
    if (this.isLoggedIn()) {
      return (
        <ul className="nav navbar-nav">
          <li>
            <Link to="/meals">My Meals</Link>
          </li>
          <li>
            <Link to="/trends">My Trends</Link>
          </li>
          <li>
            <Link to="/meals/new">New Meal</Link>
          </li>
        </ul>
      );
    } else {
      return <ul />;
    }
  }

  render() {
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <button
              type="button"
              className="navbar-toggle collapsed"
              data-toggle="collapse"
              data-target="#bs-example-navbar-collapse-1"
              aria-expanded="false"
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
            <div className="navbar-brand" href="#">
              <Link to={this.isLoggedIn() ? '/meals' : '/'}>
                KaloriRaptorit
              </Link>
            </div>
          </div>

          <div
            className="collapse navbar-collapse"
            id="bs-example-navbar-collapse-1"
          >
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
)(Header);
