import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import authReducer from './reducers/authReducer';
import planReducer from './reducers/planReducer';
import contentReducer from './reducers/contentReducer';
import progressReducer from './reducers/progressReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  plans: planReducer,
  contents: contentReducer,
  progress: progressReducer
});

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store; 