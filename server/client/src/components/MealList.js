import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import MealListItem from './MealListItem';

export default class MealList extends Component {
  constructor(props) {
    super(props);

  }



  render() {
    var totalCalories = 0;
    _.map(this.props.meals, meal => {
      _.map(meal.ingredients, ingredient => {
        totalCalories += (ingredient.kcal * ingredient.mass) / 100;
      });
    });
    return (
      <div className="meal-list-container">
        <h2>
          {this.props.meals.length} meals, {totalCalories.toFixed(0)} kcal
        </h2>
        <div>
          {_.map(_.sortBy(this.props.meals, ['date']), meal => {
            return (
              <MealListItem
                key={meal._id}
                meal={meal}
                editMeal={this.props.editMeal}
                deleteMeal={this.props.deleteMeal}
              />
            );
          })}
          <Link to="/meals/new">
            <div className="card mt-3 card-new-meal">
              <div className="card-header">Click here to add new meal!</div>
            </div>
          </Link>
        </div>
      </div>
    );
  }
}
