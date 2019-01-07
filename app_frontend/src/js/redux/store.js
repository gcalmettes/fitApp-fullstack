import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';

import { createLogger } from 'redux-logger';

import { rootReducer } from './reducers';
import { rootEpics } from './epics';

const epicMiddleware = createEpicMiddleware();
const loggerMiddleware = createLogger();

const store = createStore(
  rootReducer,
  applyMiddleware(
    epicMiddleware, 
    loggerMiddleware
  )
);

epicMiddleware.run(rootEpics);

export { store }


