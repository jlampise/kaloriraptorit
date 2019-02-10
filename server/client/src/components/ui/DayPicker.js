import React from 'react';
import { DateTimePicker } from 'react-widgets';
import './DayPicker.css';

export default ({ chooseDate, currentDate }) => {
  return (
    <DateTimePicker
      className="daypicker"
      format="YYYY-MM-DD"
      parse="YYYY-MM-DD"
      onChange={chooseDate}
      time={false}
      value={currentDate}
    />
  );
};
