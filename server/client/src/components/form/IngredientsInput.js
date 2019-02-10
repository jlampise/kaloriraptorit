import React, { Component } from 'react';
import { Field } from 'redux-form';
import TextInput from './TextInput';

const IngredientsInput = ({ fields, meta: { error, submitFailed } }) => {
  return (
    <div className="container ingredients">
      <h2>Ingredients</h2>
      <button
        className="btn btn-primary"
        type="button"
        onClick={() => fields.unshift('ingredients', {})}
      >
        Add custom ingredient
      </button>
      <div className="row">{submitFailed && error && <span>{error}</span>}</div>

      {fields.map(function(ingredient, index) {
        return (
          <IngredientInput
            key={index}
            ingredient={ingredient}
            index={index}
            remove={fields.remove}
          />
        );
      })}
    </div>
  );
};

class IngredientInput extends Component {
  constructor(props) {
    super(props);

    this.state = { expanded: false };
  }
  render() {
    const remove = this.props.remove;
    const index = this.props.index;
    const ingredient = this.props.ingredient;
    const collapseCtrlClass = this.state.expanded
      ? 'fas fa-minus'
      : 'fas fa-plus';
    const collapseClass = this.state.expanded ? 'collapse show' : 'collapse';

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
          <div id={`collapse-${index}`} className={collapseClass}>
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
            className="btn btn-sm btn-primary btn-expand"
            type="button"
            onClick={() => {
              this.setState({ expanded: !this.state.expanded });
            }}
          >
            <i className={collapseCtrlClass} />
          </button>
          <button
            className="btn btn-sm btn-danger btn-remove-ingredient"
            type="button"
            title="Remove ingredient"
            onClick={() => {
              remove(index);
            }}
          >
            <i className="far fa-trash-alt" />
          </button>
        </div>
      </div>
    );
  }
}

export default IngredientsInput;
