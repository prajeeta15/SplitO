import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import sessionReducer from './session';
import expensesReducer from './expense';
import friendReducer, { friendDetailReducer } from './friends';
import groupsReducer from './groups';
import commentsReducer from './comments';

const rootReducer = combineReducers({
  session: sessionReducer,
  expense: expensesReducer,
  friends: friendReducer,
  friendDetail: friendDetailReducer,
  groups: groupsReducer,
  comment: commentsReducer,
});

let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const store = createStore(rootReducer, enhancer);

if (process.env.NODE_ENV !== 'production') {
  window.store = store;
}

export default store;
