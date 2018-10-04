import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { fetchMeal, updateMeal, createMeal, initNewMeal } from '../actions';
import SearchInput from './parts/form/SearchInput';
import TextInput from './parts/form/TextInput';
import DateInput from './parts/form/DateInput';
import IngredientsInput from './parts/form/IngredientsInput';
import validate from './parts/form/validate';

import '../css/mealEdit.css';

class MealEdit extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.chosenFood = this.chosenFood.bind(this);
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
    if (this.props.match.params.id && !this.props.initialValues) {
      return (
        <div>
          No meal with given id exists.
        </div>
      );
    }

    const { handleSubmit, pristine, reset, submitting } = this.props;
    let headerStr = this.props.match.params.id? 'Edit your meal' : 'Add a new meal';
    return (
      <div className="container meal-edit-container">
        <h1>{headerStr}</h1>
        <form onSubmit={handleSubmit(this.onSubmit)}>
          <div className="row">
            <Field
              name="name"
              label="Meal name"
              component={TextInput}
              size="col-10 col-sm-5 col-md-3"
            />
            <Field
              name="date"
              label="Date & Time"
              placeholder="YYYY-MM-DD"
              component={DateInput}
              size="col-10 col-sm-5 col-md-3"
              showTime={true}
            />
          </div>
          <Field
            name="addIngredient"
            label="add custom ingredient"
            component={SearchInput}
            chosen={this.chosenFood}
          />
          <FieldArray name="ingredients" component={IngredientsInput} />
          <div className="form__actions">
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
