import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

const MacroPieChart =  props => {
  const meal = props.meal;
  let carbohydrate = 0;
  let fat = 0;
  let protein = 0;

  meal.ingredients.forEach(ingredient => {
    carbohydrate += (ingredient.carbohydrate * ingredient.mass) / 100;
    fat += (ingredient.fat * ingredient.mass) / 100;
    protein += (ingredient.protein * ingredient.mass) / 100;
  });

  const data = [
    { name: 'Carbohydrate', value: Math.round(carbohydrate * 10) / 10 },
    { name: 'Fat', value: Math.round(fat * 10) / 10 },
    { name: 'Protein', value: Math.round(protein * 10) / 10 }
  ];

  const colors = ['#0066ff', '#ff0000', '#669900'];

  return (
    <PieChart width={props.size * 2} height={props.size * 2}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={props.size}
        fill="#8884d8"
      >
        {data.map((entry, index) => (
          <Cell key={index} fill={colors[index % colors.length]} />
        ))}
      </Pie>
    </PieChart>
  );
};

export default MacroPieChart;