import { ofType } from 'redux-observable';
import { tap, ignoreElements } from 'rxjs/operators';

import { browserHistory } from './../../helpers' 

import { navigationActions as nav } from './../actionTypes'

export const navigateToHome = action$ => action$.pipe(
  ofType(nav.NAVIGATE_TO_HOME),
  tap(val => browserHistory.push('/')),
  ignoreElements()
)

export const navigateToLogin = action$ => action$.pipe(
  ofType(nav.NAVIGATE_TO_LOGIN),
  tap(val => browserHistory.push('/login')),
  ignoreElements()
)

export const navigateToRegister = action$ => action$.pipe(
  ofType(nav.NAVIGATE_TO_REGISTER),
  tap(val => browserHistory.push('/register')),
  ignoreElements()
)
