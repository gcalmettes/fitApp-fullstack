import { 
  dataActions, 
  authenticationActions
} from './actionTypes' 

// used in Login page
export const loginAttempt = ( { username, password } ) => ({
  type: authenticationActions.LOGIN_ATTEMPT,
  username,
  password
})

// used in NavBar 
export const logout = ( { username } ) => ({ type: authenticationActions.LOGOUT, username })

// used in Register page
export const registerUser = ( { firstname, lastname, username, password } ) => ({
  type: authenticationActions.REGISTER,
  firstname,
  lastname,
  username,
  password
})



export const processFile = ( { fileName, fileData } ) => ({
  type: dataActions.PROCESS_FILE,
  fileName,
  fileData
})
