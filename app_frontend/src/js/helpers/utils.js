export const makeAuthHeader = (token) => ( 
  // return authorization header with token
  token 
    ? ({ 'Authorization': `Bearer ${token}`})
    : ({})
)

export const isEmpty = objectInput => {
   for ( name in objectInput) {
     return false;
   }
   return true;
}