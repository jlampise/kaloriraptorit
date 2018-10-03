import React from 'react';
import { DateTimePicker } from 'react-widgets';

export default ({ chooseDate, currentDate }) => {
  return (
    <DateTimePicker
      containerClassName="persehe"
      className="date-input"
      format="YYYY-MM-DD"
      parse="YYYY-MM-DD"
      onChange={chooseDate}
      time={false}
      value={currentDate}
    />
  );
};
