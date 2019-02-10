import React from 'react';

const WaterProgressBar = ({ desiliters, target }) => {
  let percentage = 0;
  if (desiliters && target && target > 0) {
    percentage = (desiliters / target) * 100;
  }
  return (
    <div className="progress my-3">
      <div
        className="progress-bar bg-info"
        role="progressbar"
        style={{ width: `${percentage}%` }}
      >
        {`${Math.floor(percentage)}%`}
      </div>
    </div>
  );
};

export default WaterProgressBar;
