import {combineReducers} from 'redux';
import axios from 'axios';

import auth from './auth/reducer';

const appReducer = combineReducers({
  auth,
});

// clear all data in redux store
export function clearStore() {
  return {
    type: 'CLEAR_STORE',
  };
}

const rootReducer = (state: any, action: any) => {
  if (action.type === 'CLEAR_STORE') {
    state = undefined;
    delete axios.defaults.headers.common.Authorization;
  }
  return appReducer(state, action);
};

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
