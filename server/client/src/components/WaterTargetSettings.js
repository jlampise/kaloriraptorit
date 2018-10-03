import React from 'react';

const WaterTargetSettings = ({
  dailyTarget,
  defaultTarget,
  incDaily,
  updateDaily,
  incDefault
}) => {
  return (
    <div className="water-settings-container">
      <h4>Target today: {(dailyTarget / 10).toFixed(1)}</h4>
      <div>
        <button
          className="btn btn-link btn-sync-target"
          onClick={updateDaily}
          disabled={defaultTarget === dailyTarget}
        >
          Update to default
        </button>
      </div>
      <div>
        <button
          className="btn btn-link btn-dec-target"
          onClick={() => {
            incDaily(-1);
          }}
          disabled={dailyTarget <= 0}
        >
          <i className="fas fa-minus" />{' '}
        </button>
        <button
          className="btn btn-link btn-inc-target"
          onClick={() => {
            incDaily(1);
          }}
        >
          <i className="fas fa-plus" />{' '}
        </button>
      </div>

      <h4>Default target: {(defaultTarget / 10).toFixed(1)}</h4>
      <div>
        <button
          className="btn btn-link btn-dec-target"
          onClick={() => {
            incDefault(-1);
          }}
          disabled={defaultTarget <= 0}
        >
          <i className="fas fa-minus" />{' '}
        </button>
        <button
          className="btn btn-link btn-inc-target"
          onClick={() => {
            incDefault(1);
          }}
        >
          <i className="fas fa-plus" />{' '}
        </button>
      </div>

      {/* <div className="row">
        <div className="col-12">
          <h4>
            Target today: 
            
          </h4>
        </div>

        <div className="col-12" />
        <div className="col-12" />
      </div>
      <div className="row">
        <div className="col-12">
          <h4>
            Default target: {(defaultTarget / 10).toFixed(1)} liters
            
          </h4>
        </div>
        <div className="col-12" /> */}
    </div>
  );
};

export default WaterTargetSettings;
