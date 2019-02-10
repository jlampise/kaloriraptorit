import React, { Component } from 'react';
import connect from 'react-redux/lib/connect/connect';
import moment from 'moment';
import DayPicker from '../ui/DayPicker';
import LineChart from '../charts/LineChart';
import { CheckboxButton, DownloadButton } from '../ui/Buttons';
import {
  clearTrendsData,
  fetchTrendsWater,
  fetchTrendsMeals
} from '../../actions';
import buildChartData from '../../utils/buildChartData';
import './Trends.css';

class Trends extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      showWater: false,
      showMacros: false,
      showEnergy: false
    };

    this.setStartDate = this.setStartDate.bind(this);
    this.setEndDate = this.setEndDate.bind(this);
    this.validDateRange = this.validDateRange.bind(this);
    this.fetchTrendsData = this.fetchTrendsData.bind(this);
  }

  componentWillMount() {
    this.props.clearTrendsData();
  }

  gotData() {
    return (this.props.trends.waters && this.props.trends.meals);
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
  }

  setStartDate(date) {
    this.props.clearTrendsData();
    this.setState({ startDate: date });
  }

  setEndDate(date) {
    this.props.clearTrendsData();
    this.setState({ endDate: date });
  }

  validDateRange() {
    return (
      this.state.startDate &&
      this.state.endDate &&
      this.state.endDate > this.state.startDate &&
      !moment(this.state.startDate).isSame(moment(this.state.endDate), 'day')
    );
  }

  renderDateAndControls() {
    return (
      <div>
        <div className="date-container">
          <div className="row">
            <div className="col-12 col-sm-6 col-lg-4">
              <h2>1. Choose dates</h2>
              <div className="row">
                <div className="col-2">From</div>
                <div className="col">
                  <DayPicker
                    chooseDate={this.setStartDate}
                    currentDate={this.state.startDate}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-2">To</div>
                <div className="col">
                  <DayPicker
                    chooseDate={this.setEndDate}
                    currentDate={this.state.endDate}
                  />
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-4">
              <h2>2. Choose charts</h2>
              <div>
                <CheckboxButton
                  checked={this.state.showEnergy}
                  onClick={() =>
                    this.setState({ showEnergy: !this.state.showEnergy })
                  }
                />
                Energy
              </div>
              <div>
                <CheckboxButton
                  checked={this.state.showMacros}
                  onClick={() =>
                    this.setState({ showMacros: !this.state.showMacros })
                  }
                />
                Macronutrients
              </div>
              <div>
                <CheckboxButton
                  checked={this.state.showWater}
                  onClick={() =>
                    this.setState({ showWater: !this.state.showWater })
                  }
                />
                Water
              </div>
            </div>
            <div className="col-12 col-sm-12 col-lg-4">
              <h2>3. Load data</h2>
              <div className="centering">
                <DownloadButton
                  hasData={this.gotData()}
                  validRange={this.validDateRange()}
                  onClick={this.fetchTrendsData}
                />
              </div>
            </div>
          </div>
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
        <h1>Trends</h1>
        {this.renderDateAndControls()}
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
