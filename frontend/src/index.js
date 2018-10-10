import React from 'react';
import ReactDOM from 'react-dom';
import App from './js/App';
import './css/styles.css'

const elem = document.createElement('div');
elem.setAttribute("id", "app")
document.body.appendChild(elem);

ReactDOM.render(
  <App />, document.getElementById("app")
);