import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  setWater,
  setDefaultWaterTarget,
  fetchDefaultWaterTarget,
} from '../actions';
import WaterProgressBar from './WaterProgressBar';
import WaterTargetSettings from './WaterTargetSettings';

class DailyWater extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showtargetSettings: false
    };
    this.toggleShowTargetSettings = this.toggleShowTargetSettings.bind(this);
    this.incWater = this.incWater.bind(this);
    this.incDailyTarget = this.incDailyTarget.bind(this);
    this.incDefaultTarget = this.incDefaultTarget.bind(this);
    this.updateDailyTarget = this.updateDailyTarget.bind(this);
  }

  componentDidMount() {
    this.props.fetchDefaultWaterTarget();
  }

  toggleShowTargetSettings() {
    this.setState({ showTargetSettings: !this.state.showTargetSettings });
  }

  async incWater(increment) {
    var newValue = this.props.water.desiliters + increment;
    if (newValue < 0) {
      newValue = 0;
    }
    await this.props.setWater(
      this.props.date,
      this.props.water.target,
      newValue
    );
  }

  async incDailyTarget(increment) {
    var newValue = this.props.water.target + increment;
    if (newValue < 0) {
      newValue = 0;
    }
    await this.props.setWater(
      this.props.date,
      newValue,
      this.props.water.desiliters
    );
  }

  async updateDailyTarget() {
    await this.props.setWater(
      this.props.date,
      this.props.water.defaultTarget,
      this.props.water.desiliters
    );
  }

  async incDefaultTarget(increment) {
    var newValue = this.props.water.defaultTarget + increment;
    if (newValue < 0) {
      newValue = 0;
    }
    this.props.setDefaultWaterTarget(newValue);
  }

  renderButtonRow() {
    return (
      <div className="row">
        <div className="col-3 col-sm-2 offset-sm-2 col-md-1 offset-md-4">
          <button
            className="btn btn-link"
            disabled={this.props.water.desiliters <= 0}
            onClick={() => this.incWater(-5)}
          >
            <i className="fas fa-minus" />
            <i className="fas fa-wine-glass-alt" />
          </button>
        </div>
        <div className="col-3 col-sm-2 col-md-1">
          <button
            className="btn btn-link"
            disabled={this.props.water.desiliters <= 0}
            onClick={() => this.incWater(-1)}
          >
            <i className="fas fa-minus" />
            <i className="fas fa-tint" />
          </button>
        </div>
        <div className="col-3 col-sm-2 col-md-1">
          <button
            className="btn btn-link"
            onClick={() => this.incWater(1)}
          >
            <i className="fas fa-plus" />
            <i className="fas fa-tint" />
          </button>
        </div>
        <div className="col-3 col-sm-2 col-md-1">
          <button
            className="btn btn-link"
            onClick={() => this.incWater(5)}
          >
            <i className="fas fa-plus" />
            <i className="fas fa-wine-glass-alt" />
          </button>
        </div>
      </div>
    );
  }

  renderWaterTargetSettings() {
    if (this.state.showTargetSettings) {
      return (
        <WaterTargetSettings
          dailyTarget={this.props.water.target}
          defaultTarget={this.props.water.defaultTarget}
          incDaily={this.incDailyTarget}
          updateDaily={this.updateDailyTarget}
          incDefault={this.incDefaultTarget}
        />
      );
    }
  }

  renderWater() {
    return (
      <div>
        <WaterProgressBar
          desiliters={this.props.water.desiliters}
          target={this.props.water.target}
        />
        {this.renderButtonRow()}
        {this.renderWaterTargetSettings()}
      </div>
    );
  }

  render() {
    return (
      <div className="water-container">
        <h2>
          {`Water: ${(this.props.water.desiliters / 10).toFixed(1)} / ${(
            this.props.water.target / 10
          ).toFixed(1)} liters`}{' '}
          <button
            className="btn btn-link btn-show-more"
            onClick={this.toggleShowTargetSettings}
          >
            <i className="fas fa-edit" />
          </button>
        </h2>
        {this.renderWater()}
      </div>
    );
  }
}

export default connect(
  null,
  {
    setWater,
    setDefaultWaterTarget,
    fetchDefaultWaterTarget
  }
)(DailyWater);
