import React from 'react';

const TextInput = field => {
  const {
    meta: { touched, error }
  } = field;
  const className = `form-group ${touched && error ? ' has-error' : ''} `;

  return (
    <div className={className}>
      <label>{field.label}</label>
      <input
        placeholder={field.placeholder ? field.placeholder : ''}
        className="form-control"
        type="text"
        {...field.input} //generate all input events, like equliant to examples of: onChange={field.input.onChange} or onFocus={field.input.onFocus} or onBlur....
      />
      <div className="help-block">{touched ? error : ''}</div>
    </div>
  );
};

export default TextInput;
