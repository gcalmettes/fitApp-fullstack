import { ofType } from 'redux-observable';
import { mapTo, switchMap } from 'rxjs/operators';

import { 
  authenticationActions,
  navigationActions
} from './../actionTypes'

export const registerUser = (action$) => action$.pipe(
  ofType(authenticationActions.REGISTER),
  switchMap( action => {
    const { firstname, lastname, username, password } = action
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstname, lastname, username, password })
    };
    return fetch('/auth/register', requestOptions)
      .then(response => response.json())
      .then(result => {
        const { status, message, error } = result
        return (!error)
        ? ({type: navigationActions.NAVIGATE_TO_LOGIN })
        : ({type: navigationActions.NAVIGATE_TO_REGISTER, error })
      })
      .catch((error) => ({type: navigationActions.NAVIGATE_TO_REGISTER, error: error.message }))
    }
  )
)

export const loginAttempt = (action$) => action$.pipe(
  ofType(authenticationActions.LOGIN_ATTEMPT),
  switchMap( action => {
    const { username, password } = action
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    };
    return fetch('/auth/login', requestOptions)
      .then(response => response.json())
      .then(result => {
        const { status, message, access_token, error } = result
        return (!error)
        ? ({type: authenticationActions.LOGIN_SUCCESS, access_token })
        : ({type: authenticationActions.LOGIN_FAILURE, error })
      })
      .catch((error) => ({type: authenticationActions.LOGIN_FAILURE, error: error.message }))
    }
  )
)

// if successfully authenticated, redirect to home
export const loginSuccess = action$ => action$.pipe(
  ofType(authenticationActions.LOGIN_SUCCESS),
  mapTo({type: navigationActions.NAVIGATE_TO_HOME})
)

export const logout = (action$) => action$.pipe(
  ofType(authenticationActions.LOGOUT),
  switchMap( action => {
    const { username } = action
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    };
    return fetch('/auth/logout', requestOptions)
      .then(response => response.json())
      .then(result => {
        const { status, message, error } = result
        return (!error)
        ? ({type: authenticationActions.LOGOUT_SUCCESS})
        : ({type: authenticationActions.LOGOUT_FAILURE, error })
        
      })
      .catch((error) => ({type: authenticationActions.LOGOUT_FAILURE, error: error.message }))
    }
  )
)