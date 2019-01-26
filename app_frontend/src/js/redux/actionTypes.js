export const alertActions = {

  SHOW_ALERT: 'SHOW_ALERT',

};

export const authenticationActions = {

  REGISTER: 'REGISTER_NEW_USER',

  LOGIN_ATTEMPT: 'USER_LOGIN_ATTEMPT',
  LOGIN_SUCCESS: 'USER_LOGIN_SUCCESS',
  LOGIN_FAILURE: 'USER_LOGIN_FAILURE',
  
  LOGOUT: 'USER_LOGOUT',
  LOGOUT_SUCCESS: 'USER_LOGOUT_SUCCESS',
  LOGOUT_FAILURE: 'USER_LOGOUT_FAILURE',
};

export const navigationActions = {

  NAVIGATE_TO_HOME: 'NAVIGATE_TO_HOME',
  NAVIGATE_TO_LOGIN: 'NAVIGATE_TO_LOGIN',
  NAVIGATE_TO_REGISTER: 'NAVIGATE_TO_REGISTER',

};

export const dataActions = {

  PROCESS_FILE: 'PROCESS_FILE',
  INCOMING_DATA: 'INCOMING_DATA',
  PREVIOUS_TRACE: 'PREVIOUS_TRACE',
  NEXT_TRACE: 'NEXT_TRACE',
  SET_FOCUS_RANGE: 'SET_FOCUS_RANGE',
  SET_FIT_OPTIONS: 'SET_FIT_OPTIONS',
  SEND_DATA_TO_FIT: 'SEND_DATA_TO_FIT',
  INCOMING_FIT_DATA: 'INCOMING_FIT_DATA',
  SET_FIT_COMMENT: 'SET_FIT_COMMENT',
  SAVE_DATA_TO_DATABASE: 'SAVE_DATA_TO_DATABASE',

};