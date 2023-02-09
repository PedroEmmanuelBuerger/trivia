import { combineReducers } from 'redux';
import { userInfo } from './login';

const rootReducer = combineReducers({
  player: userInfo,
});

export default rootReducer;
