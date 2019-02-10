import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import MacroPieChart from './charts/MacroPieChart';



const NUM_OF_DECIMALS = 0;

export default class MealListItem extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };
  }

  render() {
    const meal = this.props.meal;
    const editMeal = this.props.editMeal;
    const deleteMeal = this.props.deleteMeal;
    const timeStr = moment(meal.date).format('HH:mm');

    const sumIngredient = {
      name: 'SUM',
      kcal: 0,
      mass: 0,
      protein: 0,
      carbohydrate: 0,
      fat: 0
    };

    for (let ingredient of meal.ingredients) {
      const massFactor = ingredient.mass / 100;
      sumIngredient.mass += ingredient.mass;
      sumIngredient.kcal += ingredient.kcal * massFactor;
      sumIngredient.protein += ingredient.protein * massFactor;
      sumIngredient.carbohydrate += ingredient.carbohydrate * massFactor;
      sumIngredient.fat += ingredient.fat * massFactor;
    }
    const mealName = meal.name;

    const collapseCtrlClass = this.state.isOpen
      ? 'fas fa-minus'
      : 'fas fa-plus';
    const collapseClass = this.state.isOpen ? 'collapse show' : 'collapse';
    return (
      <div className="card mt-3" key={meal._id}>
        <div className="card-header" key={meal._id}>
          <div className="row" key={meal._id}>
            <div className="col-12 col-sm-4 col-md-2">{timeStr}</div>
            <div className="col-12 col-sm-8 col-md-4">{mealName}</div>
            <div className="col-12 col-sm-12 col-md-2">
              {sumIngredient.kcal.toFixed(NUM_OF_DECIMALS)}
              kcal
            </div>
            <div className="col-2 col-sm-4 col-md-1">
              <MacroPieChart meal={meal} size={15} />
            </div>
            <div className="col-10 col-sm-8 col-md-3">
              <button
                className="btn btn-sm btn-primary btn-meal-list"
                onClick={() => {
                  this.setState({ isOpen: !this.state.isOpen });
                }}
              >
                <i className={collapseCtrlClass} />
              </button>
              <button
                className="btn btn-sm btn-warning btn-meal-list"
                onClick={() => editMeal(meal)}
              >
                <i className="far fa-edit" />
              </button>
              <button
                className="btn btn-sm btn-danger btn-meal-list"
                onClick={() => deleteMeal(meal)}
              >
                <i className="far fa-trash-alt" />
              </button>
            </div>
          </div>
        </div>
        <div className={collapseClass}>
          <div className="card-body">
            {_.sortBy(meal.ingredients, ['name']).map(ingredient => {
              return (
                <IngredientRow
                  key={ingredient._id}
                  ingredient={relativeToAbsoluteValues(ingredient)}
                />
              );
            })}
            <span className="row-sum">
              <IngredientRow ingredient={sumIngredient} />
            </span>
          </div>
        </div>
      </div>
    );
  }
}

const IngredientRow = ({ ingredient }) => {
  return (
    <div className="row">
      <div className="col-6 col-md-6 ingredient">{ingredient.name}</div>
      <div className="col-4 col-md-2 kcal">
        {ingredient.kcal.toFixed(NUM_OF_DECIMALS)}
        kcal
      </div>
      <div className="col-2 col-md 1 mass">
        {ingredient.mass.toFixed(NUM_OF_DECIMALS)}g
      </div>
      <div className="col-8 col-md-1 carbohydrate">
        {ingredient.carbohydrate.toFixed(NUM_OF_DECIMALS)}g
      </div>
      <div className="col-2 col-md-1 fat">
        {ingredient.fat.toFixed(NUM_OF_DECIMALS)}g
      </div>
      <div className="col-2 col-md-1 protein">
        {ingredient.protein.toFixed(NUM_OF_DECIMALS)}g
      </div>
    </div>
  );
};

const relativeToAbsoluteValues = ingredient => {
  const massFactor = ingredient.mass / 100;
  const newIngredient = Object.assign({}, ingredient);
  newIngredient.kcal *= massFactor;
  newIngredient.protein *= massFactor;
  newIngredient.carbohydrate *= massFactor;
  newIngredient.fat *= massFactor;
  return newIngredient;
};
