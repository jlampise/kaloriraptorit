import React from 'react';
import { Field } from 'redux-form';
import TextInput from './TextInput';

const IngredientsInput = ({ fields, meta: { error, submitFailed } }) => {
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
                      component={TextInput}
                      label={'Ingredient name'}
                      size="col-md-4" //bootstrap size
                    />
                    <Field
                      name={`${ingredient}.mass`}
                      type="text"
                      placeholder="100"
                      component={TextInput}
                      label="Quantity (g/ml)"
                      size="col-5 col-sm-4 col-md-2" //bootstrap size
                    />
                  </div>
                  <div className="row">
                    <div className="card" style={{ width: '100%' }}>
                      <div className="card-header">
                        <button
                          className="btn btn-link collapsed"
                          type="button"
                          data-toggle="collapse"
                          data-target={`#collapse-${index}`}
                        >
                          Edit nutritions (per 100g)
                        </button>
                      </div>
                      <div id={`collapse-${index}`} className="collapse">
                        <div className="card-body">
                          <Field
                            name={`${ingredient}.kcal`}
                            type="text"
                            placeholder="add calories (per 100g)"
                            component={TextInput}
                            label="kcal "
                            size="col-6 col-sm-3 col-md-3"
                          />
                          <Field
                            name={`${ingredient}.fat`}
                            type="text"
                            placeholder="add fat in grams  (per 100g)"
                            component={TextInput}
                            label="fat"
                            size="col-6 col-sm-3 col-md-3"
                          />
                          <Field
                            name={`${ingredient}.protein`}
                            type="text"
                            placeholder="add protein in grams (per 100g)"
                            component={TextInput}
                            label="Protein"
                            size="col-6 col-sm-3 col-md-3"
                          />
                          <Field
                            name={`${ingredient}.carbohydrate`}
                            type="text"
                            placeholder="add carbs i grams (per 100g)"
                            component={TextInput}
                            label="Carbohydrate"
                            size="col-6 col-sm-3 col-md-3"
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

export default IngredientsInput;