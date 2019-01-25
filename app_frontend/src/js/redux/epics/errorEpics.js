import { ofType } from 'redux-observable';
import { filter, map } from 'rxjs/operators';

import { alertActions as alert} from './../actionTypes'

export const catchError = action$ => action$.pipe(
  filter(action => action.type != alert.SHOW_ALERT && action.error),
  map( action => ({ type: alert.SHOW_ALERT, error: action.error}) )
)