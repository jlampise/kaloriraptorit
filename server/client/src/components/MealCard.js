import React from 'react';
import MacroPieChart from './MacroPieChart';
import moment from 'moment';
import _ from 'lodash';

const NUM_OF_DECIMALS = 0;

const MealCard = ({ meal }) => {
  const timeStr = moment(meal.date).format('HH:mm');
  var energy = 0;
  meal.ingredients.forEach(ingredient => {
    energy += (ingredient.kcal * ingredient.mass) / 100;
  });
  let mealName = meal.name;
  return (
    <div className="card mt-3" key={meal._id}>
      <div className="card-header" key={meal._id}>
        <div className="row" key={meal._id}>
          <div className="col-12 col-sm-4 col-md-2">{timeStr}</div>
          <div className="col-12 col-sm-8 col-md-3">{mealName}</div>
          <div className="col-12 col-sm-4 col-md-3">
            {energy.toFixed(NUM_OF_DECIMALS)}
            kcal
          </div>

          <div className="col-12 col-sm-8 col-md-1">
            <MacroPieChart meal={meal} size={15} />
          </div>

          <div className="col-12 col-sm-8 col-md-3">
            <button
              className="btn btn-sm btn-info btn-meal-list"
              data-toggle="collapse"
              data-target={`#collapse-${meal._id}`}
              aria-expanded="true"
              aria-controls={`collapse-${meal._id}`}
            >
              <i className="fas fa-info-circle" />
            </button>

            <button
              className="btn btn-sm btn-success btn-meal-list"
              onClick={() => this.editMeal(meal)}
            >
              <i className="far fa-edit" />
            </button>
            <button
              className="btn btn-sm btn-danger btn-meal-list"
              onClick={() => this.deleteMeal(meal)}
            >
              <i className="far fa-trash-alt" />
            </button>
          </div>
        </div>
      </div>

      <div
        id={`collapse-${meal._id}`}
        className="collapse"
        aria-labelledby="headingOne"
      >
        <div className="card-body">
          {_.sortBy(meal.ingredients, ['name']).map(ingredient => {
            return <IngredientRow key={ingredient._id} ingredient={ingredient}/>;
          })}
        </div>
      </div>
    </div>
  );
};

const IngredientRow = ({ingredient}) => {
  return (
    <div className="row" key={ingredient._id}>
      <div className="col-12 col-lg-5 col-ingredient">{ingredient.name}</div>
      <div className="col-3 col-lg-2 col-kcal">
        {((ingredient.kcal * ingredient.mass) / 100).toFixed(NUM_OF_DECIMALS)}
        kcal
      </div>
      <div className="col-3 col-lg 2 col-mass">
        {ingredient.mass.toFixed(NUM_OF_DECIMALS)}g
      </div>
      <div className="col-2 col-lg-1 carbohydrate">
        {((ingredient.carbohydrate * ingredient.mass) / 100).toFixed(
          NUM_OF_DECIMALS
        )}
        g
      </div>
      <div className="col-2 col-lg-1 fat">
        {((ingredient.fat * ingredient.mass) / 100).toFixed(NUM_OF_DECIMALS)}g
      </div>
      <div className="col-2 col-lg-1 protein">
        {((ingredient.protein * ingredient.mass) / 100).toFixed(
          NUM_OF_DECIMALS
        )}
        g
      </div>
    </div>
  );
};

export default MealCard;
