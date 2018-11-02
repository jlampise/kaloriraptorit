export default function validate(values) {
  const errors = {};
  //validate the inputs
  if (!values.name) {
    errors.name = 'Enter a Meal name';
  }

  if (!values.ingredients || !values.ingredients.length) {
    errors.ingredients = { _error: 'At least one ingredient must be entered' };
  } else {
    const ingredientsArrayErrors = [];
    values.ingredients.forEach((ingredient, ingredientIndex) => {
      const ingredientErrors = {};
      if (!ingredient || !ingredient.name) {
        ingredientErrors.name = 'please fill the ingredient name';
        ingredientsArrayErrors[ingredientIndex] = ingredientErrors;
      }
      if (!ingredient || !ingredient.mass) {
        ingredientErrors.mass = 'please fill mass of ingredient';
        ingredientsArrayErrors[ingredientIndex] = ingredientErrors;
      }
    });
    if (ingredientsArrayErrors.length) {
      errors.ingredients = ingredientsArrayErrors;
    }
  }
  //return empty object means no errors and form is valid
  return errors;
}
