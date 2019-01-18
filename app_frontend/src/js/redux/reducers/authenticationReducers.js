import { authenticationActions as auth } from './../actionTypes';

export const authentication = 
  (state = { access_token: null, username: null }, action) => {
    const { type, username, password, error, access_token } = action
    switch (type) {
      case auth.LOGIN_ATTEMPT:
        return {
          username,
          access_token
        };
      case auth.LOGIN_SUCCESS:
        return {
          username: state.username,
          access_token
        };
      case auth.LOGIN_FAILURE:
        return { error };
      case auth.LOGOUT:
        return {};
      default:
        return state
    }
}