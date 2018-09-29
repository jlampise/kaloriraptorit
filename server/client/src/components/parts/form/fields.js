import React from 'react';
import { Field } from 'redux-form';
import moment from 'moment';
import { DateTimePicker } from 'react-widgets';
import momentLocaliser from 'react-widgets-moment';
import 'react-widgets/dist/css/react-widgets.css';
momentLocaliser(moment);

//field parameter handles all events properties for Field component
export const renderField = function(field) {
  const {
    meta: { touched, error }
  } = field;
  const colSize = field.size ? field.size : '';
  const className = `form-group ${colSize} ${
    touched && error ? ' has-error' : ''
  } `;

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

export const renderDateField = function(field) {
  const {
    meta: { touched, error }
  } = field;
  const colSize = field.size ? field.size : '';
  const className = `form-group ${colSize} ${
    touched && error ? ' has-error' : ''
  } `;

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

export const renderIngredients = function({
  fields,
  meta: { error, submitFailed }
}) {
  return (
    <div>
      <button
        className="btn btn-primary"
        type="button"
        onClick={() => fields.unshift({})}
      >
        Or add custom ingredient
      </button>
      <ul>
        <li>{submitFailed && error && <span>{error}</span>}</li>

        {fields.map(function(ingredient, index) {
          return (
            <li key={index}>
              <h4>{`Ingredient #${fields.length - index} `}</h4>

              <div className="row ingredient">
                <div className="col-sm-12">
                  <div className="row">
                    <Field
                      name={`${ingredient}.name`}
                      type="text"
                      placeholder="type an ingredient"
                      component={renderField}
                      label={'Ingredient name'}
                      size="col-md-4" //bootstrap size
                    />
                    <Field
                      name={`${ingredient}.mass`}
                      type="text"
                      placeholder="100"
                      component={renderField}
                      label="Quantity (g/ml)"
                      size="col-xs-5 col-sm-4 col-md-2" //bootstrap size
                    />
                  </div>
                  <div className="row">
                    <div className="panel panel-default">
                      <div className="panel-heading">
                        <a
                          role="button"
                          data-toggle="collapse"
                          href={`#${index}`}
                        >
                          Edit nutritions (per 100g)
                        </a>
                      </div>
                      <div
                        id={`${index}`}
                        className="panel-collapse collapse"
                        role="tabpanel"
                      >
                        <div className="panel-body">
                          <Field
                            name={`${ingredient}.kcal`}
                            type="text"
                            placeholder="add calories (per 100g)"
                            component={renderField}
                            label="kcal "
                            size="col-xs-6 col-sm-2 col-md-2"
                          />
                          <Field
                            name={`${ingredient}.fat`}
                            type="text"
                            placeholder="add fat in grams  (per 100g)"
                            component={renderField}
                            label="fat"
                            size="col-xs-6 col-sm-2 col-md-2"
                          />
                          <Field
                            name={`${ingredient}.protein`}
                            type="text"
                            placeholder="add protein in grams (per 100g)"
                            component={renderField}
                            label="Protein"
                            size="col-xs-6 col-sm-2 col-md-2"
                          />
                          <Field
                            name={`${ingredient}.carbohydrate`}
                            type="text"
                            placeholder="add carbs i grams (per 100g)"
                            component={renderField}
                            label="Carbohydrate"
                            size="col-xs-6 col-sm-2 col-md-2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn btn-danger remove-ingredient"
                    type="button"
                    title="Remove ingredient"
                    onClick={() => fields.remove(index)}
                  >
                    <i className="fa fa-times" />
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="row ingredient-actions">
        <div className="col-sm-6" />
      </div>
    </div>
  );
};
