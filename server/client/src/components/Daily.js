import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Water from './Water';
import MealList from './MealList';
import DayPicker from './DayPicker';

import {
  fetchDailyMeals,
  fetchDailyWater,
  chooseDate,
  deleteMeal
} from '../actions';

import '../css/daily.css';

class Daily extends Component {
  constructor(props) {
    super(props);

    this.chooseDate = this.chooseDate.bind(this);
    this.incrementDate = this.incrementDate.bind(this);
    this.decrementDate = this.decrementDate.bind(this);
    this.editMeal = this.editMeal.bind(this);
    this.deleteMeal = this.deleteMeal.bind(this);
  }

  componentDidMount() {

    this.props.fetchDailyMeals(this.props.date);
    this.props.fetchDailyWater(this.props.date);
  }
  async chooseDate(date) {
    // When typing on date picker bar, it generates undefined values
    if (date) {
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
        <div className="date-container">
          <div className="row">
            <div className="col-3 offset-3 col-sm-2 offset-sm-4 col-date-button">
              <button
                className="btn btn-link btn-date"
                onClick={this.decrementDate}
              >
                <i className="fas fa-chevron-left" />
              </button>
            </div>
            <div className="col-3 col-sm-2 col-date-button">
              <button
                className="btn btn-link btn-date"
                onClick={this.incrementDate}
              >
                <i className="fas fa-chevron-right" />
              </button>
            </div>
            <div className="col-12 col-md-4 col-date-controls">
              <DayPicker
                chooseDate={this.chooseDate}
                currentDate={this.props.date}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="container daily-container">
        {this.renderDateAndControls()}
        <MealList meals={this.props.meals} editMeal={this.editMeal} deleteMeal={this.deleteMeal}/>
        <Water date={this.props.date} water={this.props.water}/>
      </div>
    );
  }
}

function mapsStateToProps({ water, meals, date }) {
  return { water, meals, date };
}

export default connect(
  mapsStateToProps,
  {
    chooseDate,
    fetchDailyMeals,
    fetchDailyWater,
    deleteMeal
  }
)(Daily);
