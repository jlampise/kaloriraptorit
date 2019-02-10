import React from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import MealListItem from './MealListItem';

const MealList = ({ meals, editMeal, deleteMeal }) => {
  var totalCalories = 0;
  _.map(meals, meal => {
    _.map(meal.ingredients, ingredient => {
      totalCalories += (ingredient.kcal * ingredient.mass) / 100;
    });
  });
  return (
    <div className="meal-list-container">
      <h2>
        {meals.length} meals, {totalCalories.toFixed(0)} kcal
      </h2>
      <div>
        {_.map(_.sortBy(meals, ['date']), meal => {
          return (
            <MealListItem
              key={meal._id}
              meal={meal}
              editMeal={editMeal}
              deleteMeal={deleteMeal}
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
};

export default MealList;
