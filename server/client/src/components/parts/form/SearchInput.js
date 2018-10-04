import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import _ from 'lodash';
import { searchIngredients } from '../../../actions';

const renderSearchField = field => {
  const {
    meta: { touched, error }
  } = field;
  const colSize = field.size ? field.size : '';
  const className = `form-group ${colSize} ${
    touched && error ? ' has-error' : ''
  } `;
  return (
    <div className={className}>
      <label>{field.label}</label>
      <div className="input-group">
        <input
          name={field.name}
          placeholder={field.placeholder ? field.placeholder : ''}
          className="form-control"
          type="text"
          {...field.input} //generate all input events, like equliant to examples of: onChange={field.input.onChange} or onFocus={field.input.onFocus} or onBlur....
        />
        <div class="input-group-append">
          <button class="btn btn-secondary" disabled type="button">
            <i className="fas fa-search" />
          </button>
        </div>
      </div>
      <div className="help-block">{touched ? error : ''}</div>
    </div>
  );
};

class SearchInput extends Component {
  constructor(props) {
    super(props);
    this.state = { foodsearch: '' };
  }

  searchIngredient(e) {
    this.setState({ foodsearch: e.target.value });
    if (e.target.value) {
      this.props.searchIngredients(e.target.value);
    }
  }

  addIngredient() {
    let ingredientsSuggestions = this.props.ingredients
      ? this.props.ingredients.data
        ? this.props.ingredients.data
        : []
      : [];

    let specificValue = ins => {
      this.props.chosen(ins);
      this.setState({ foodsearch: '' });
    };

    return ingredientsSuggestions.map(function(ingredient, index) {
      return (
        <li
          className="list-group-item"
          onClick={() => {
            specificValue(ingredient);
          }}
          key={index}
        >
          {ingredient.name}
        </li>
      );
    });
  }

  render() {
    const foodSearch = _.debounce(this.searchIngredient.bind(this), 600);
    return (
      <div className="">
        <div className="row">
          <div className="col-md-4">
            <Field
              name="searchIngredient"
              label="Search Ingredient"
              component={renderSearchField}
              onChange={foodSearch}
            />
          </div>
        </div>
        <div>
          <ul className="ingredients list-group list-group-hover list-product-search scrollbar">
            {this.state.foodsearch.length >= 3 && this.addIngredient()}
          </ul>
        </div>
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
)(SearchInput);
