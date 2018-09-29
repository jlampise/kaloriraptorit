import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
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
    } else if (!this.isLoggedIn()) {
      return (
        <Nav pullRight>
          <NavItem href="/auth/google">Login with Google</NavItem>
        </Nav>
      );
    }
    return (
      <Nav pullRight>
        <NavItem href="/api/logout">
          Logout: {this.props.auth.data.name}
        </NavItem>
      </Nav>
    );
  }

  renderFeaturesNav() {
    return (
      <div>
        {this.isLoggedIn() ? (
          <Nav>
            <NavItem componentClass={Link} href="/meals" to="/meals">
              My Meals
            </NavItem>
            <NavItem componentClass={Link} href="/trends" to="/trends">
              My Trends
            </NavItem>
            <NavItem componentClass={Link} href="/meals/new" to="/meals/new">
              New Meal
            </NavItem>
          </Nav>
        ) : null}
      </div>
    );
  }
  render() {
    return (
      <Navbar collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to={this.isLoggedIn() ? '/meals' : '/'}>KaloriRaptorit</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          {this.renderFeaturesNav()}
          {this.renderAuthNav()}
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

function mapsStateToProps({ auth, date }) {
  return { auth, date };
}

export default connect(mapsStateToProps, null)(Header);
