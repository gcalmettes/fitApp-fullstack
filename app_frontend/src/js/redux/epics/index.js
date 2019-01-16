import { combineEpics } from 'redux-observable';


import { catchError } from './errorEpics';
import { 
  processFile,
  sendDataToFit, 
} from './dataEpics';

export const rootEpics = combineEpics(
  catchError,
  processFile,
  sendDataToFit
)