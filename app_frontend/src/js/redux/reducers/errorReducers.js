import { alertActions as al } from './../actionTypes';
import { navigationActions as nav } from './../actionTypes';


export const alert = 
  (state = { raise: false, message: null }, action) => {
    const { type, error } = action
    switch (type) {
      case al.SHOW_ALERT:
        return {
          raise: true,
          message: error
        };
      default:
        return {
          raise: false,
          message: null
        };
    }
}

export const registrationError = 
  (state = { error: null }, action) => {
    const { error, type } = action
    switch (type) {
      case nav.NAVIGATE_TO_HOME:
        return { error };
      case nav.NAVIGATE_TO_LOGIN:
        return { error };
      case nav.NAVIGATE_TO_REGISTER:
        return { error };
      default:
        return { error: null }
    }
}