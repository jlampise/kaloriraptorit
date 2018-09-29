import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  setWater,
  setDefaultWaterTarget,
  fetchDefaultWaterTarget
} from '../actions';

class DailyWater extends Component {
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

  renderProgressBarRow() {
    if (this.props.water.target > 0) {
      const style = {
        width:
          (this.props.water.desiliters / this.props.water.target) * 100 + '%'
      };
      return (
        <div className="row">
          <div className="progress">
            <div class="progress">
              <div
                class="progress-bar progress-bar-striped bg-info"
                role="progressbar"
                style={style}
              />
            </div>
          </div>
        </div>
      );
    }
  }

  renderButtonRow() {
    return (
      <div className="row">
        <div className="col-xs-3 col-sm-1">
          <button
            className="btn btn-info btn-water"
            disabled={this.props.water.desiliters <= 0}
            onClick={this.incWater.bind(this, -5)}
          >
            <i className="fas fa-minus" />
          </button>
        </div>
        <div className="col-xs-3 col-sm-1">
          <button
            className="btn btn-info btn-water"
            disabled={this.props.water.desiliters <= 0}
            onClick={this.incWater.bind(this, -1)}
          >
            -
          </button>
        </div>
        <div className="col-xs-3 col-sm-1">
          <button
            className="btn btn-info btn-water"
            onClick={this.incWater.bind(this, 1)}
          >
            +
          </button>
        </div>
        <div className="col-xs-3 col-sm-1">
          <button
            className="btn btn-info btn-water"
            onClick={this.incWater.bind(this, 5)}
          >
            <i className="fas fa-plus" />
          </button>
        </div>
      </div>
    );
  }

  renderWater() {
    return (
      <div className="container">
        {this.renderProgressBarRow()}
        {this.renderButtonRow()}
      </div>
    );
  }

  renderTargetSettings() {
    if (this.props.showTargetSettings) {
      return (
        <div>
          <h4>Water target settings</h4>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h5>
                  This day's target: {(this.props.water.target / 10).toFixed(1)}{' '}
                  liters
                </h5>
              </div>

              <div className="col-12">
                <button
                  className="btn btn-sync-target"
                  onClick={this.updateDailyTarget.bind(this)}
                  disabled={
                    this.props.water.defaultTarget === this.props.water.target
                  }
                >
                  Update to default
                </button>
              </div>
              <div className="col-12">
                <button
                  className="btn btn-dec-target"
                  onClick={this.incDailyTarget.bind(this, -1)}
                  disabled={this.props.water.target <= 0}
                >
                  <i className="fas fa-minus" />{' '}
                </button>
                <button
                  className="btn btn-inc-target"
                  onClick={this.incDailyTarget.bind(this, 1)}
                >
                  <i className="fas fa-plus" />{' '}
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <h5>
                  Your default target:{' '}
                  {(this.props.water.defaultTarget / 10).toFixed(1)} liters
                </h5>
              </div>
              <div className="col-12">
                <button
                  className="btn btn-dec-target"
                  onClick={this.incDefaultTarget.bind(this, -1)}
                  disabled={this.props.water.defaultTarget <= 0}
                >
                  <i className="fas fa-minus" />{' '}
                </button>
                <button
                  className="btn-inc-target"
                  onClick={this.incDefaultTarget.bind(this, 1)}
                >
                  <i className="fas fa-plus" />{' '}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        <h4>
          Water: {(this.props.water.desiliters / 10).toFixed(1)} /{' '}
          {(this.props.water.target / 10).toFixed(1)} liters (daily target)
        </h4>
        {this.renderWater()}
        {this.renderTargetSettings()}
      </div>
    );
  }
}

function mapsStateToProps({ date, water }) {
  return { date, water };
}

export default connect(
  mapsStateToProps,
  {
    setWater,
    setDefaultWaterTarget,
    fetchDefaultWaterTarget
  }
)(DailyWater);
