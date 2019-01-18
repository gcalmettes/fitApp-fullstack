import { combineReducers } from 'redux';

import { alert, registrationError } from './errorReducers';
import { dataset } from './dataReducers';
import { authentication } from './authenticationReducers';

export const rootReducer = combineReducers({
  alert,
  authentication,
  registrationError,
  dataset
});