import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { fetchMeal, updateMeal, createMeal, initNewMeal } from '../actions';
import IngredientSelect from './parts/form/IngredientSelect';
import TextInput from './parts/form/TextInput';
import DateInput from './parts/form/DateInput';
import IngredientsInput from './parts/form/IngredientsInput';
import validate from './parts/form/validate';

import '../css/mealEdit.css';

class MealEdit extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.addIngredient = this.addIngredient.bind(this);
  }
  
  componentDidMount() {
    if (this.props.match.params.id) {
      this.props.fetchMeal(this.props.match.params.id);
    } else {
      this.props.initNewMeal(this.props.date);
    }
  }

  onSubmit(values) {
    if (this.props.match.params.id) {
      this.props.updateMeal(this.props.match.params.id, values, () => {
        this.props.history.push('/meals');
      });
    } else {
      this.props.createMeal(values, () => {
        this.props.history.push('/meals');
      });
    }
  }

  addIngredient(ingredient) {
    let roundedFoodInfo = {};
    for (let prop in ingredient) {
      if (prop === 'name' || prop === 'fineliId') {
        roundedFoodInfo[prop] = ingredient[prop];
      } else {
        roundedFoodInfo[prop] = Number(
          Math.round(ingredient[prop] + 'e2') + 'e-2'
        );
      }
    }
    this.props.array.unshift('ingredients', roundedFoodInfo);
  }

  render() {
    if (this.props.match.params.id && !this.props.initialValues) {
      return <div>No meal with given id exists.</div>;
    }

    const { handleSubmit, pristine, reset, submitting } = this.props;
    let headerStr = this.props.match.params.id
      ? 'Edit your meal'
      : 'Add new meal';
    return (
      <div className="container meal-edit-container">
        <h1>{headerStr}</h1>
        <form onSubmit={handleSubmit(this.onSubmit)}>
          <div className="container name-date-search">
            <div className="row">
              <div className="col-12 col-sm-6 col-lg-4">
                <Field name="name" label="Name" component={TextInput} />
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <Field
                  name="date"
                  label="Date & Time"
                  placeholder="YYYY-MM-DD"
                  component={DateInput}
                  showTime={true}
                />
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <IngredientSelect selectIngredient={this.addIngredient} />
              </div>
            </div>
          </div>
          <FieldArray name="ingredients" component={IngredientsInput} />

          <div className="actions">
            <button type="submit" className="btn btn-success">
              Save
            </button>
            <button
              type="button"
              className="btn btn-danger"
              disabled={pristine || submitting}
              onClick={reset}
            >
              Discard Changes
            </button>
            <Link className="btn btn-primary" to="/meals">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    );
  }

}

// NOTICE: This "initialValues" -prop name is Redux-Form magic-word!!!
function mapsStateToProps({ editableMeal, date }) {
  return { initialValues: editableMeal, date };
}

let InitializeFromStateForm = reduxForm({
  // a unique name for the form
  form: 'editMeal',
  validate,
  enableReinitialize: true
})(MealEdit);

//and add redux connection
InitializeFromStateForm = connect(
  mapsStateToProps,
  { fetchMeal, updateMeal, createMeal, initNewMeal }
)(InitializeFromStateForm);

export default InitializeFromStateForm;
