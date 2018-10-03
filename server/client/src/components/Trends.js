import React, { Component } from 'react';
import connect from 'react-redux/lib/connect/connect';
import { DateTimePicker } from 'react-widgets';
import {
  clearTrendsData,
  fetchTrendsWater,
  fetchTrendsMeals
} from '../actions';
import moment from 'moment';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
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

  renderEnergyChart(chartData) {
    // Energy is in its own chart because it has unit of kcal. The chart is
    // shown only if ENERGY is activated.
    if (this.state.showEnergy) {
      return (
        <ResponsiveContainer width="100%" aspect={3}>
          <LineChart
            data={chartData}
            margin={{ top: 50, right: 50, left: 0, bottom: 50 }}
          >
            <Line name="Energy (kcal)" type="monotone" dataKey="energy" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="datePresentation" />
            <YAxis dataKey="energy" />
            <Tooltip />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      );
    }
  }

  renderMacronutrientChart(chartData) {
    // Macronutrients are in their own chart because they have unit of grams.
    // The chart is shown only if MACRO is activated
    if (this.state.showMacros) {
      return (
        <ResponsiveContainer width="100%" aspect={3}>
          <LineChart
            data={chartData}
            margin={{ top: 50, right: 50, left: 0, bottom: 50 }}
          >
            <Line
              name="Protein (g)"
              type="monotone"
              dataKey="protein"
              stroke="#669900"
            />
            <Line
              name="Carbohydrate (g)"
              type="monotone"
              dataKey="carbohydrate"
              stroke="#0066ff"
            />
            <Line
              name="Fat (g)"
              type="monotone"
              dataKey="fat"
              stroke="#ff0000"
            />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="datePresentation" />
            <YAxis />
            <Tooltip />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      );
    }
  }

  renderWaterChart(chartData) {
    // Water is in its own chart because it has unit of desiliter. The chart
    // is shown only if WATER is activated
    if (this.state.showWater) {
      return (
        <ResponsiveContainer width="100%" aspect={3}>
          <LineChart
            data={chartData}
            margin={{ top: 50, right: 50, left: 0, bottom: 50 }}
          >
            <Line name="Water (dl)" type="monotone" dataKey="water" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="datePresentation" />
            <YAxis dataKey="water" />
            <Tooltip />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      );
    }
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
      return (
        <div>
          {this.renderEnergyChart(chartData)}
          {this.renderMacronutrientChart(chartData)}
          {this.renderWaterChart(chartData)}
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
