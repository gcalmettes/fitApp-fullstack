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

export const postData = (url = '', data = {}, access_token = null) => {
  return fetch(url, { 
    method: 'POST', 
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...makeAuthHeader(access_token)
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
}

export const throttle = (func, limit) => {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

export const debounce = (func, delay) => {
  let inDebounce
  return function() {
    const context = this
    const args = arguments
    clearTimeout(inDebounce)
    inDebounce = setTimeout(() => func.apply(context, args), delay)
  }
}