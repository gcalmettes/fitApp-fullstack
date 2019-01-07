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