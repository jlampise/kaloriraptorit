import React from 'react';

const WaterTargetSettings = ({
  dailyTarget,
  defaultTarget,
  incDaily,
  updateDaily,
  incDefault
}) => {
  return (
    <div>
      <h4>Water target settings</h4>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h5>This day's target: {(dailyTarget / 10).toFixed(1)} liters</h5>
          </div>

          <div className="col-12">
            <button
              className="btn btn-sync-target"
              onClick={updateDaily}
              disabled={defaultTarget === dailyTarget}
            >
              Update to default
            </button>
          </div>
          <div className="col-12">
            <button
              className="btn btn-dec-target"
              onClick={() => {
                incDaily(-1);
              }}
              disabled={dailyTarget <= 0}
            >
              <i className="fas fa-minus" />{' '}
            </button>
            <button
              className="btn btn-inc-target"
              onClick={() => {
                incDaily(1);
              }}
            >
              <i className="fas fa-plus" />{' '}
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <h5>
              Your default target: {(defaultTarget / 10).toFixed(1)} liters
            </h5>
          </div>
          <div className="col-12">
            <button
              className="btn btn-dec-target"
              onClick={() => {
                incDefault(-1);
              }}
              disabled={defaultTarget <= 0}
            >
              <i className="fas fa-minus" />{' '}
            </button>
            <button
              className="btn-inc-target"
              onClick={() => {
                incDefault(1);
              }}
            >
              <i className="fas fa-plus" />{' '}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterTargetSettings;
