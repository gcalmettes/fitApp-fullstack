import { combineReducers } from 'redux';

import { alert } from './errorReducers';
import { dataset } from './dataReducers';

export const rootReducer = combineReducers({
  alert,
  dataset
});