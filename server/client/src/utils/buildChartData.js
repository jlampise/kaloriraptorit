import moment from 'moment';
import MIterator from 'moment-iterator';

const buildChartData = (meals, waters, startDate, endDate) => {
  // We combine all the data to common chart data which could be used
  // to render single chart with individual lines. In reality, we render
  // a couple of charts because we need different units for many of the
  // lines.

  // First creating zero-data -array for each date in date range
  var data = new Map();
  const start = startDate;
  const end = endDate;
  MIterator(start, end).each('days', day => {
    data.set(day.format('YYYY-MM-DD'), {
      datePresentation: day.format('DD.MM'),
      protein: 0,
      carbohydrate: 0,
      fat: 0,
      energy: 0,
      water: 0
    });
  });

  // 1. Energy and macronutrients from fetched meals

  // for each meal in fetched meals data
  meals.forEach(meal => {
    // We find the correct daily object from chart data array
    const mealDate = moment(meal.date).format('YYYY-MM-DD');
    const dailyValues = data.get(mealDate);

    if (dailyValues) {
      // for each ingredient
      meal.ingredients.forEach(ingredient => {
        // We calculate sum values from unit values and mass and add
        // them to chart data object
        const factor = ingredient.mass / 100;
        dailyValues.protein += ingredient.protein * factor;
        dailyValues.carbohydrate += ingredient.carbohydrate * factor;
        dailyValues.fat += ingredient.fat * factor;
        dailyValues.energy += ingredient.kcal * factor;
      });
    }
  });

  // 2. Water from fetched daily waters

  // API returns us only non-zero-dates, so we do this differently
  // from above energy and macro -stuff

  // for each daily record in chart data array
  data.forEach((value, key) => {
    // If fetched daily waters contain this date, set the chart data value
    const existingRecord = waters.find(record => {
      return record.date === key;
    });
    if (existingRecord) {
      value.water = existingRecord.desiliters;
    }
  });
  return Array.from(data.values());
};

export default buildChartData;
