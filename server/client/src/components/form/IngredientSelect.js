import React from 'react';
import AsyncSelect from 'react-select/async';
import axios from 'axios';

export default ({ selectIngredient }) => {
  return (
    <div className="form-group selectIngredient">
      <label>Search and Add Ingredient</label>
      <AsyncSelect
        placeholder="Search Fineli API..."
        value={null}
        getOptionLabel={ingredient => ingredient.name}
        loadOptions={getIngredients}
        onChange={selectIngredient}
      />
    </div>
  );
};

async function getIngredients(searchTerm) {
  try {
    const res = await axios.get(`/api/ingredients?q=${searchTerm}`);
    return res.data.data;
  } catch (err) {
    return [];
  }
}
