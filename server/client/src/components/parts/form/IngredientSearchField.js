import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import _ from 'lodash';
import { searchIngredients } from '../../../actions';
import SearchInput from './SearchInput';

class IngredientSearchField extends Component {
  constructor(props) {
    super(props);
    this.state = { searchTerm: '' };
    this.searchIngredient = this.searchIngredient.bind(this);
  }

  searchIngredient(e) {
    this.setState({ searchTerm: e.target.value });
    if (e.target.value) {
      this.props.searchIngredients(e.target.value);
    }
  }

  renderIngredientList() {
    let ingredients = this.props.ingredients
      ? this.props.ingredients.data
        ? this.props.ingredients.data
        : []
      : [];

    const pickIngredient = ingredient => {
      this.props.pickIngredient(ingredient);
      this.setState({ searchTerm: '' });
    };

    return (
      <div>
        <ul className="ingredients list-group list-group-hover list-product-search scrollbar">
          {ingredients.map(function(ingredient, index) {
            return (
              <li
                className="list-group-item"
                onClick={() => {
                  pickIngredient(ingredient);
                }}
                key={index}
              >
                {ingredient.name}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  render() {
    const foodSearch = _.debounce(this.searchIngredient, 600);
    return (
      <div className="">
        <Field
          name="searchIngredient"
          label="Search and Add Ingredient"
          component={SearchInput}
          onChange={foodSearch}
        />
        {this.state.searchTerm.length >= 3 && this.renderIngredientList()}
      </div>
    );
  }
}

//getting props to this component
function mapsStateToProps({ ingredients }) {
  return { ingredients };
}

//and add redux connection
export default connect(
  mapsStateToProps,
  { searchIngredients }
)(IngredientSearchField);
