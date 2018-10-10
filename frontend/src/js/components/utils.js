export const postData = (url = '', data = {}) => {
  return fetch(url, { 
    method: 'POST', 
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
}