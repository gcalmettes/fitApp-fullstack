import { combineEpics } from 'redux-observable';

import { 
  loginSuccess, 
  loginAttempt, 
  logout, 
  registerUser 
} from './authenticationEpics';
import { 
  navigateToHome, 
  navigateToLogin, 
  navigateToRegister 
} from './navigationEpics';
import { catchError } from './errorEpics';
import { 
  processFile,
  sendDataToFit, 
} from './dataEpics';

export const rootEpics = combineEpics(
  catchError,
  navigateToHome,
  navigateToLogin,
  navigateToRegister,
  registerUser,
  loginSuccess,
  loginAttempt,
  logout,
  processFile,
  sendDataToFit
)