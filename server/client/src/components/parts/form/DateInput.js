import React from 'react';
import moment from 'moment';
import { DateTimePicker } from 'react-widgets';
import momentLocaliser from 'react-widgets-moment';
momentLocaliser(moment);

const DateInput = field => {
  const {
    meta: { touched, error }
  } = field;
  const className = `form-group ${touched && error ? ' has-error' : ''} `;

  return (
    <div className={className}>
      <label>{field.label}</label>
      <DateTimePicker
        {...field.input}
        onChange={field.input.onChange}
        time={field.showTime}
        value={
          !field.input.value
            ? new Date(field.date)
            : new Date(field.input.value)
        }
      />

      <div className="help-block">{touched ? error : ''}</div>
    </div>
  );
};

export default DateInput;
