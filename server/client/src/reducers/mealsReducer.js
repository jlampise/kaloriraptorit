import { FETCH_DAILY_MEALS } from '../actions/types';

// This reducer is setting meals for one day.
// We don't handle actions creating or deleting meals right now,
// because we cannot be sure that the new created or deleted
// meal was part of that days meals.

export default function(state = [], action) {
  switch (action.type) {
    case FETCH_DAILY_MEALS:
      return !(action.payload === null) ? action.payload : [];
    default:
      return state;
  }
}
