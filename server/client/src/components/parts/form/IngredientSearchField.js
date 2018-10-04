import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import _ from 'lodash';
import { searchIngredients } from '../../../actions';
import SearchInput from './SearchInput';

class IngredientSearchField extends Component {
  constructor(props) {
    super(props);

    this.searchIngredient = this.searchIngredient.bind(this);
  }

  searchIngredient(e) {
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

    return (
      <div>
        <ul className="ingredients list-group list-group-hover list-product-search scrollbar">
          {ingredients.map(function(ingredient, index) {
            return (
              <li
                className="list-group-item"
                onClick={() => {
                  this.props.pickIngredient(ingredient);
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
          label="Search Ingredient"
          component={SearchInput}
          onChange={foodSearch}
        />
        {this.renderIngredientList()}
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
