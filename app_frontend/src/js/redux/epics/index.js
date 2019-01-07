import { combineEpics } from 'redux-observable';


import { catchError } from './errorEpics';
import { processFile } from './dataEpics';

export const rootEpics = combineEpics(
  catchError,
  processFile
)