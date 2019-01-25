import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { App } from './js/App';
import { store } from './js/redux'

import './styles/main.scss'

const elem = document.createElement('div');
elem.setAttribute("id", "app")
document.body.appendChild(elem);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("app")
);