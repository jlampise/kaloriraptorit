import { FETCH_MEAL } from '../actions/types';

export default function(state = null, action) {
  switch (action.type) {
    case FETCH_MEAL:
      return action.payload;
    default:
      return state;
  }
}
