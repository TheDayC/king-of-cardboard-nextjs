import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from './slices';
import { createInitialState } from './state';

// Create our store and allow thunks for future development if required.
const store = createStore(rootReducer, createInitialState(), composeWithDevTools(applyMiddleware(thunk)));

export default store;
