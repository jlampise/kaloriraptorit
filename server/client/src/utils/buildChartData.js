import moment from 'moment';
import MIterator from 'moment-iterator';
import _ from 'lodash';

const buildChartData = (meals, waters, startDate, endDate) => {
  // We combine all the data to common chart data which could be used
  // to render single chart with individual lines. In reality, we render
  // a couple of charts because we need different units for many of the
  // lines.

  // First creating zero-data -array for each date in date range
  var data = [];
  const start = startDate;
  const end = endDate;
  MIterator(start, end).each('days', day => {
    data.push({
      date: day.format('YYYY-MM-DD'),
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
  _.map(meals, meal => {
    // We find the correct daily object from chart data array
    const mealDate = moment(meal.date).format('YYYY-MM-DD');
    const dailyValues = _.find(data, record => {
      return record.date === mealDate;
    });

    if (dailyValues) {
      // for each ingredient
      _.map(meal.ingredients, ingredient => {
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
  _.map(data, zeroWater => {
    // If fetched daily waters contain this date, set the chart data value
    const existingRecord = _.find(waters, record => {
      return record.date === zeroWater.date;
    });
    if (existingRecord) {
      zeroWater.water = existingRecord.desiliters;
    }
  });

  return data;
};

export default buildChartData;
