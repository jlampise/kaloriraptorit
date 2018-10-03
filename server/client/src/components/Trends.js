import React, { Component } from 'react';
import connect from 'react-redux/lib/connect/connect';
import moment from 'moment';
import { DateTimePicker } from 'react-widgets';
import LineChart from './charts/LineChart';
import {
  clearTrendsData,
  fetchTrendsWater,
  fetchTrendsMeals
} from '../actions';
import buildChartData from '../utils/buildChartData';
import '../css/trends.css';

const WATER = 'water';
const MACRO = 'macronutrients';
const ENERGY = 'energy';

class Trends extends Component {
  constructor(props) {
    super(props);

    this.handleToggles = this.handleToggles.bind(this);

    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      gotData: false,
      showWater: false,
      showMacros: false,
      showEnergy: false
    };
  }

  componentWillMount() {
    this.props.clearTrendsData();
  }

  handleToggles(e) {
    if (e.target.value === WATER) {
      this.setState({ showWater: !this.state.showWater });
    } else if (e.target.value === ENERGY) {
      this.setState({ showEnergy: !this.state.showEnergy });
    } else if (e.target.value === MACRO) {
      this.setState({ showMacros: !this.state.showMacros });
    }
  }

  fetchTrendsData() {
    // Let's make it simple here. We fetch both water and meals data to
    // be able to show everything the user chooses after fetching.
    // The data is cleared when user changes the date range and must be
    // fetched again.

    const after = moment(this.state.startDate)
      .startOf('day')
      .toDate();
    const before = moment(this.state.endDate)
      .endOf('day')
      .toDate();
    this.props.fetchTrendsMeals(after, before);

    // Ok, we are a little bit restricted by our backend API now.
    // We can only get ALL water data for our user (without start and end dates)
    // AND this data does not contain zero-water-dates
    this.props.fetchTrendsWater();

    this.setState({ gotData: true });
  }

  setStartDate(date) {
    this.props.clearTrendsData();
    this.setState({ startDate: date, gotData: false });
  }

  setEndDate(date) {
    this.props.clearTrendsData();
    this.setState({ endDate: date, gotData: false });
  }

  validDateRange() {
    return (
      this.state.startDate &&
      this.state.endDate &&
      this.state.endDate > this.state.startDate &&
      !moment(this.state.startDate).isSame(moment(this.state.endDate), 'day')
    );
  }

  renderDateRangeButton() {
    return (
      <div>
        <DateTimePicker
          value={this.state.startDate}
          onChange={value => this.setStartDate(value)}
        />
        <DateTimePicker
          value={this.state.endDate}
          onChange={value => this.setEndDate(value)}
        />
      </div>
    );
  }

  renderLoadButton() {
    const disabled = this.state.gotData || !this.validDateRange();
    let glyph = '';
    if (this.state.gotData) {
      glyph = 'fas fa-check-circle';
    } else {
      glyph = 'fas fa-download';
    }
    return (
      <button
        className="btn btn-primary btn-load-data"
        onClick={this.fetchTrendsData.bind(this)}
        disabled={disabled}
      >
        <i className={glyph} />
      </button>
    );
  }

  renderDateAndControls() {
    var header = 'My Trends: ';
    if (this.validDateRange()) {
      header +=
        moment(this.state.startDate).format('DD.MM.YYYY') +
        ' - ' +
        moment(this.state.endDate).format('DD.MM.YYYY');
    } else {
      header += 'Valid range not set';
    }

    return (
      <div>
        <h3>{header}</h3>
        {this.renderDateRangeButton()}
        {this.renderLoadButton()}
      </div>
    );
  }

  renderChartToggles() {
    return (
      <div>
        <h4>Charts to show</h4>
        <div>
          <label>
            <input
              value={ENERGY}
              name="showEnergy"
              type="checkbox"
              checked={this.state.showEnergy}
              onChange={this.handleToggles}
            />
            Energy
          </label>
          <label>
            <input
              value={MACRO}
              name="showMacros"
              type="checkbox"
              checked={this.state.showMacros}
              onChange={this.handleToggles}
            />
            Macronutrients
          </label>
          <label>
            <input
              value={WATER}
              name="showWater"
              type="checkbox"
              checked={this.state.showWater}
              onChange={this.handleToggles}
            />
            Water
          </label>
        </div>
      </div>
    );
  }

  renderCharts() {
    // To make it simple here, we must have fetched data to render charts
    if (this.props.trends.meals && this.props.trends.waters) {
      const chartData = buildChartData(
        this.props.trends.meals,
        this.props.trends.waters,
        this.state.startDate,
        this.state.endDate
      );

      const macroChartKeys = [
        { dataKey: 'protein', name: 'Protein (g)', stroke: '#669900' },
        {
          dataKey: 'carbohydrate',
          name: 'Carbohydrate (g)',
          stroke: '#0066ff'
        },
        { dataKey: 'fat', name: 'Fat (g)', stroke: '#ff0000' }
      ];
      const energyChartKeys = [{ dataKey: 'energy', name: 'Energy (kcal)' }];
      const waterChartKeys = [{ dataKey: 'water', name: 'Water (dl)' }];

      return (
        <div>
          {this.state.showEnergy ? (
            <LineChart data={chartData} instructions={energyChartKeys} />
          ) : null}
          {this.state.showMacros ? (
            <LineChart data={chartData} instructions={macroChartKeys} />
          ) : null}
          {this.state.showWater ? (
            <LineChart data={chartData} instructions={waterChartKeys} />
          ) : null}
        </div>
      );
    }
  }

  render() {
    return (
      <div className="container trends-container">
        {this.renderDateAndControls()}
        {this.renderChartToggles()}
        {this.renderCharts()}
      </div>
    );
  }
}

function mapStateToProps({ trends }) {
  return { trends };
}
export default connect(
  mapStateToProps,
  {
    clearTrendsData,
    fetchTrendsWater,
    fetchTrendsMeals
  }
)(Trends);
