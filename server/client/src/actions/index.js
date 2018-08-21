import axios from 'axios';
import moment from 'moment';

import {
  CHECKING_AUTHENTICATION,
  USER_DATA,
  CHOOSE_DATE,
  FETCH_DAILY_MEALS,
  FETCH_DAILY_WATER,
  CREATE_MEAL,
  DELETE_MEAL,
  FETCH_MEAL,
  CLEAR_TRENDS_DATA,
  FETCH_TRENDS_WATER_DATA,
  FETCH_TRENDS_MEALS_DATA,
  FETCH_DEFAULT_WATER_TARGET,
  UPDATE_MEAL,
  FETCH_INGREDIENTS
} from './types';

export const fetchUser = () => async dispatch => {
  dispatch({ type: CHECKING_AUTHENTICATION });

  const res = await axios.get('/api/current_user');

  dispatch({ type: USER_DATA, payload: res.data });
};

export const chooseDate = date => dispatch => {
  dispatch({ type: CHOOSE_DATE, payload: date });
};

export const fetchDefaultWaterTarget = () => async dispatch => {
  const url = '/api/water/target';
  try {
    const res = await axios.get(url);
    dispatch({ type: FETCH_DEFAULT_WATER_TARGET, payload: res.data });
  } catch (err) {
    dispatch({ type: FETCH_DEFAULT_WATER_TARGET, payload: null });
  }
};

export const setDefaultWaterTarget = target => async dispatch => {
  const url = '/api/water/target';
  const body = { target };
  try {
    await axios.post(url, body);
    dispatch({
      type: FETCH_DEFAULT_WATER_TARGET,
      payload: { defaultTarget: target }
    });
  } catch (err) {
    dispatch({ type: FETCH_DEFAULT_WATER_TARGET, payload: null });
  }
};

const fetchMealsWithStrictInterval = async (after, before) => {
  const url = '/api/meals/?after=' + after + '&before=' + before;
  try {
    const res = await axios.get(url);
    return res.data.meals;
  } catch (err) {
    return null;
  }
};

export const fetchDailyMeals = date => async dispatch => {
  const startOfDay = moment(date)
    .startOf('day')
    .toDate();
  const endOfDay = moment(date)
    .endOf('day')
    .toDate();
  const meals = await fetchMealsWithStrictInterval(startOfDay, endOfDay);
  dispatch({ type: FETCH_DAILY_MEALS, payload: meals });
};

export const fetchTrendsMeals = (after, before) => async dispatch => {
  const meals = await fetchMealsWithStrictInterval(after, before);
  dispatch({ type: FETCH_TRENDS_MEALS_DATA, payload: meals });
};

export const fetchMeal = mealId => async dispatch => {
  const res = await axios.get(`/api/meals/${mealId}`);

  dispatch({ type: FETCH_MEAL, payload: res.data });
};

export const initNewMeal = date => dispatch => {
  dispatch({ type: FETCH_MEAL, payload: { name: '', date, ingredients: [] }});
};

export const deleteMeal = mealId => async dispatch => {
  try {
    await axios.delete('/api/meals/' + mealId);
    dispatch({ type: DELETE_MEAL, payload: mealId });
  } catch (err) {
    dispatch({ type: DELETE_MEAL, payload: null });
  }
};

export const fetchDailyWater = date => async dispatch => {
  // Use moment to get string representing day in local time
  const day = moment(date).format('YYYY-MM-DD');
  const url = '/api/water/' + day;
  try {
    const res = await axios.get(url);
    dispatch({ type: FETCH_DAILY_WATER, payload: res.data });
  } catch (err) {
    dispatch({ type: FETCH_DAILY_WATER, payload: null });
  }
};

export const setWater = (date, target, desiliters) => async dispatch => {
  // Use moment to get string representing day in local time
  const day = moment(date).format('YYYY-MM-DD');
  const url = '/api/water/' + day;
  const body = { desiliters, target };
  try {
    await axios.post(url, body);
    dispatch({ type: FETCH_DAILY_WATER, payload: { target, desiliters } });
  } catch (err) {
    dispatch({ type: FETCH_DAILY_WATER, payload: null });
  }
};

export const createMeal = (values, callback) => async dispatch => {
  try {
    const res = await axios.post('/api/meals/new', values);
    callback();
    dispatch({ type: CREATE_MEAL, payload: res.data.createdMeal });
  } catch (err) {
    dispatch({ type: CREATE_MEAL, payload: null });
  }
};

export const fetchTrendsWater = () => async dispatch => {
  const url = '/api/water';
  try {
    const res = await axios.get(url);
    dispatch({ type: FETCH_TRENDS_WATER_DATA, payload: res.data.dailyWaters });
  } catch (err) {
    dispatch({ type: FETCH_TRENDS_WATER_DATA, payload: null });
  }
};

export const clearTrendsData = () => dispatch => {
  dispatch({ type: CLEAR_TRENDS_DATA, payload: null });
};

export const updateMeal = (mealId, values, callback) => async dispatch => {
  const res = await axios.post(`/api/meals/${mealId}`, values);
  callback();
  dispatch({ type: UPDATE_MEAL, payload: res.data });
};

export const searchIngredients = query => async dispatch => {
  const res = await axios.get(`/api/fineli/foods?q=${query}`);
  dispatch({ type: FETCH_INGREDIENTS, payload: res.data });
};
