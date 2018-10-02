import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import _ from 'lodash';
import DailyWater from './DailyWater';
import MealCard from './MealCard';

import {
  fetchDailyMeals,
  fetchDailyWater,
  fetchDefaultWaterTarget,
  deleteMeal,
  chooseDate
} from '../actions';

import '../css/meals.css';


class Meals extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMore: false
    };
    this.editMeal = this.editMeal.bind(this);
    this.deleteMeal = this.deleteMeal.bind(this);
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
    const dateString = moment(this.props.date).format('ddd, DD of MMM YYYY');

    return (
      <div>
        <h1>{dateString}</h1>
        <button
          className="btn btn-secondary btn-md btn-meals-date"
          onClick={this.decrementDate.bind(this)}
        >
          <i className="fas fa-chevron-left" />
        </button>
        <button
          className="btn btn-secondary btn-md btn-meals-date"
          onClick={this.incrementDate.bind(this)}
        >
          <i className="fas fa-chevron-right" />
        </button>

        <button
          className="btn btn-secondary btn-md btn-show-more"
          onClick={this.toggleShowMore.bind(this)}
        >
          <i className="fas fa-edit" />
        </button>
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
        <h2>
          {this.props.meals.length} meals,{' '}
          {totalCalories.toFixed(0)} kcal
        </h2>
        <div>
          {_.map(_.sortBy(this.props.meals, ['date']), meal => {
            return <MealCard key={meal._id} meal={meal} editMeal={this.editMeal} deleteMeal={this.deleteMeal}/>;
          })}
          <Link to="/meals/new">
            <div className="card mt-3 panel-new-meal">
              <div className="card-header">Click here to add new meal!</div>
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
      <div className="container meals-container">
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
