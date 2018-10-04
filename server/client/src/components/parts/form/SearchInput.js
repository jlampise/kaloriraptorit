import React from 'react';

const SearchInput = field => {
  const {
    meta: { touched, error }
  } = field;
  const className = `form-group ${touched && error ? ' has-error' : ''} `;
  return (
    <div className={className}>
      <label>{field.label}</label>
      <div className="input-group">
        <input
          name={field.name}
          placeholder={field.placeholder ? field.placeholder : ''}
          className="form-control"
          type="text"
          {...field.input}
        />
        <div className="input-group-append">
          <button className="btn btn-secondary" disabled={!field.search} onClick={field.search} type="button">
            <i className="fas fa-search" />
          </button>
        </div>
      </div>
      <div className="help-block">{touched ? error : ''}</div>
    </div>
  );
};

export default SearchInput;