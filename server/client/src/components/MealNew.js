import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, FieldArray, reduxForm } from 'redux-form';

import { createMeal } from '../actions';
import renderSearchField from './parts/form/search';

import {
  renderField,
  renderDateField,
  renderIngredients
} from './parts/form/fields';
import validate from './parts/form/validate';

class MealNew extends Component {
  constructor(props) {
    super(props);
    this.chosenFood.bind(this);
  }

  onSubmit(values) {
    this.props.createMeal(values, () => {
      this.props.history.push('/meals');
    });
  }

  chosenFood(foodInfo) {
    let newFoodInfo = {};
    for (let prop in foodInfo) {
      switch (prop) {
        case 'name':
          newFoodInfo[prop] = foodInfo[prop];
          break;
        case 'fineliId':
          newFoodInfo[prop] = foodInfo[prop];
          break;
        default:
          newFoodInfo[prop] = Number(Math.round(foodInfo[prop] + 'e2') + 'e-2');
      }
    }
    this.props.array.unshift('ingredients', newFoodInfo);
  }

  render() {



    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <div className="container">
        <h2>Add meal</h2>
        <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <div className="row">
            <Field
              name="name"
              label="Meal name"
              component={renderField}
              size="col-xs-10 col-sm-5 col-md-3"
            />
            <Field
              name="date"
              label="Date & Time"
              placeholder="YYYY-MM-DD"
              component={renderDateField}
              size="col-xs-10 col-sm-5 col-md-3"
              showTime={true}
              date={this.props.date}
            />
          </div>
          <Field
            name="addIngredient"
            label="add custom ingredient"
            component={renderSearchField}
            chosen={this.chosenFood.bind(this)}
          />
          <FieldArray name="ingredients" component={renderIngredients} />
          <div className="form__actions">
            <button type="submit" className="btn btn-success">
              Save your meal
            </button>
            <button
              type="button"
              className="btn btn-danger"
              disabled={pristine || submitting}
              onClick={reset}
            >
              Clear Values
            </button>
          </div>
        </form>
      </div>
    );
  }
}




function mapsStateToProps({ date }) {
  return { date };
}

export default reduxForm({
  validate,
  // a unique name for the form
  form: 'mealForm'
})(
  //and add redux connection
  connect(mapsStateToProps, { createMeal })(MealNew)
);
