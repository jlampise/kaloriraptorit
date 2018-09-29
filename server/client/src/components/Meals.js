import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import DailyWater from './DailyWater';
import { Link } from 'react-router-dom';
import {
  fetchDailyMeals,
  fetchDailyWater,
  fetchDefaultWaterTarget,
  deleteMeal,
  chooseDate
} from '../actions';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import '../css/meals.css';

const NUM_OF_DECIMALS = 1;

class Meals extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMore: false
    };
  }

  componentDidMount() {
    this.props.fetchDailyMeals(this.props.date);
    this.props.fetchDailyWater(this.props.date);
    this.props.fetchDefaultWaterTarget();
  }
  async chooseDate(date) {
    // When typing on date picker bar, it generates undefined values
    if (!(date === undefined)) {
      await this.props.chooseDate(date);
      await this.props.fetchDailyMeals(this.props.date);
      await this.props.fetchDailyWater(this.props.date);
    }
  }
  async incrementDate() {
    await this.chooseDate(
      moment(this.props.date)
        .add({ days: 1 })
        .toDate()
    );
  }

  async decrementDate() {
    await this.chooseDate(
      moment(this.props.date)
        .add({ days: -1 })
        .toDate()
    );
  }

  toggleShowMore() {
    this.setState({ showMore: !this.state.showMore });
  }

  editMeal(meal) {
    this.props.history.push(`meals/edit/${meal._id}`);
  }

  async deleteMeal(meal) {
    await this.props.deleteMeal(meal._id);
    await this.props.fetchDailyMeals(this.props.date);
  }

  renderDateAndControls() {
    const dateString =
      'My Meals: ' + moment(this.props.date).format('ddd, DD of MMM YYYY');

    return (
      <div>
        <h3>{dateString}</h3>
        <button
          className="btn btn-default btn-small btn-meals-date"
          onClick={this.decrementDate.bind(this)}
        >
          <i className="fas fa-chevron-left" />
        </button>
        <button
          className="btn btn-default btn-small btn-meals-date"
          onClick={this.incrementDate.bind(this)}
        >
          <i className="fas fa-chevron-right" />
        </button>

        <button
          className="btn btn-default btn-sm btn-show-more"
          onClick={this.toggleShowMore.bind(this)}
        >
          <i className="fas fa-edit" />
        </button>
      </div>
    );
  }

  renderIngredientRow(ingredient) {
    return (
      <div className="row" key={ingredient._id}>
        <div className="col-xs-9 col-sm-4 col-ingredient">
          {ingredient.name}
        </div>
        <div className="col-xs-3 col-sm 3 col-mass">
          {ingredient.mass.toFixed(NUM_OF_DECIMALS)}g
        </div>
        <div className="col-xs-3 col-sm-1 col-ch">
          {((ingredient.carbohydrate * ingredient.mass) / 100).toFixed(
            NUM_OF_DECIMALS
          )}
          g
        </div>
        <div className="col-xs-3 col-xs-1 col-fat">
          {((ingredient.fat * ingredient.mass) / 100).toFixed(NUM_OF_DECIMALS)}g
        </div>
        <div className="col-xs-3 col-sm-1 col-protein">
          {((ingredient.protein * ingredient.mass) / 100).toFixed(
            NUM_OF_DECIMALS
          )}
          g
        </div>
        <div className="col-xs-3 col-sm-2 col-kcal">
          {((ingredient.kcal * ingredient.mass) / 100).toFixed(NUM_OF_DECIMALS)}
          kcal
        </div>
      </div>
    );
  }

  renderMacroPieChart(meal) {
    var carbohydrate = 0;
    var fat = 0;
    var protein = 0;
    _.map(meal.ingredients, ingredient => {
      carbohydrate += (ingredient.carbohydrate * ingredient.mass) / 100;
      fat += (ingredient.fat * ingredient.mass) / 100;
      protein += (ingredient.protein * ingredient.mass) / 100;
    });
    const data = [
      { name: 'Carbohydrate', value: Math.round(carbohydrate * 10) / 10 },
      { name: 'Fat', value: Math.round(fat * 10) / 10 },
      { name: 'Protein', value: Math.round(protein * 10) / 10 }
    ];
    const colors = ['#0066ff', '#ff0000', '#669900'];

    return (
      <PieChart width={320} height={200}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={60}
          fill="#8884d8"
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Legend />
        <Tooltip />
      </PieChart>
    );
  }

  renderMealPanel(meal) {
    const timeStr = moment(meal.date).format('HH:mm');
    var energy = 0;
    _.map(meal.ingredients, ingredient => {
      energy += (ingredient.kcal * ingredient.mass) / 100;
    });

    return (
      <div className="panel panel-default" key={meal._id}>
        <div className="panel-heading" key={meal._id}>
          <div className="row" key={meal._id}>
            <div className="col-xs-2">{timeStr}</div>
            <a role="button" data-toggle="collapse" href={`#${meal._id}`}>
              <div className="col-xs-4">{meal.name}</div>
            </a>
            <div className="col-xs-2">
              {energy.toFixed(NUM_OF_DECIMALS)} kcal
            </div>
            <div className="col-xs-4" align="right">
              <button
                className="btn btn-xs btn-success btn-meal-list"
                onClick={() => this.editMeal(meal)}
              >
                Edit
              </button>
              <button
                className="btn btn-xs btn-danger btn-meal-list"
                onClick={() => this.deleteMeal(meal)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <div
          id={`${meal._id}`}
          className="panel-collapse collapse"
          role="tabpanel"
        >
          <div className="panel-body">
            <div className="col-xs-12 col-md-8">
              {_.map(_.sortBy(meal.ingredients, ['name']), ingredient => {
                return this.renderIngredientRow(ingredient);
              })}
            </div>
            <div className="col-xs-12 col-md-4">
              {this.renderMacroPieChart(meal)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderMeals() {
    var totalCalories = 0;
    _.map(this.props.meals, meal => {
      _.map(meal.ingredients, ingredient => {
        totalCalories += (ingredient.kcal * ingredient.mass) / 100;
      });
    });
    return (
      <div>
        <h4>
          {this.props.meals.length} meals today,{' '}
          {totalCalories.toFixed(NUM_OF_DECIMALS)} kcal
        </h4>
        <div>
          {_.map(_.sortBy(this.props.meals, ['date']), meal => {
            return this.renderMealPanel(meal);
          })}
          <Link to="/meals/new">
            <div className="panel panel-default panel-new-meal">
              <div className="panel-heading">
                Click here to add new meal!
              </div>
            </div>
          </Link>
        </div>
      </div>
    );
  }

  renderWater() {
    return (
      <div>
        <DailyWater showTargetSettings={this.state.showMore} />
      </div>
    );
  }

  render() {
    return (
      <div className="container">
        {this.renderDateAndControls()}
        {this.renderMeals()}
        {this.renderWater()}
      </div>
    );
  }
}

function mapsStateToProps({ meals, date }) {
  return { meals, date };
}

export default connect(
  mapsStateToProps,
  {
    chooseDate,
    fetchDailyMeals,
    fetchDailyWater,
    fetchDefaultWaterTarget,
    deleteMeal
  }
)(Meals);
