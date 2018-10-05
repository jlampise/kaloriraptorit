import React from 'react';
import { Field } from 'redux-form';
import TextInput from './TextInput';

const IngredientsInput = ({ fields, meta: { error, submitFailed } }) => {
  return (
    <div className="container ingredients">
      <div className="row">{submitFailed && error && <span>{error}</span>}</div>
      <h2>Ingredients</h2>

      {fields.map(function(ingredient, index) {
        return (
          <div className="row ingredient" key={index}>
            <div className="col-12 col-sm-6">
              <Field
                name={`${ingredient}.name`}
                type="text"
                placeholder="type an ingredient"
                component={TextInput}
                label={'Ingredient name'}
              />
            </div>
            <div className="col-12 col-sm-6">
              <Field
                name={`${ingredient}.mass`}
                type="text"
                placeholder="100"
                component={TextInput}
                label="Quantity (g/ml)"
              />
            </div>
            <div className="col-12">
              <div id={`collapse-${index}`} className="collapse">
                <div className="row">
                  <div className="col-12 col-sm-6 col-md-3">
                    <Field
                      name={`${ingredient}.kcal`}
                      component={TextInput}
                      label="Energy (kcal) "
                    />
                  </div>
                  <div className="col-12 col-sm-6 col-md-3">
                    <Field
                      name={`${ingredient}.fat`}
                      component={TextInput}
                      label="Fat (g)"
                    />
                  </div>
                  <div className="col-12 col-sm-6 col-md-3">
                    <Field
                      name={`${ingredient}.protein`}
                      component={TextInput}
                      label="Protein (g)"
                    />
                  </div>
                  <div className="col-12 col-sm-6 col-md-3">
                    <Field
                      name={`${ingredient}.carbohydrate`}
                      component={TextInput}
                      label="Carbohydrate (g)"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12">
              <button
                className="btn btn-link collapsed"
                type="button"
                data-toggle="collapse"
                data-target={`#collapse-${index}`}
              >
                Edit nutritions (per 100g)
              </button>

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
        );
      })}
    </div>
  );
};

export default IngredientsInput;
