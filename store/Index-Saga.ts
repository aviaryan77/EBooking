import {all} from 'redux-saga/effects';

import authSaga from './auth/saga';

export default function* () {
  yield all([
    authSaga(),
  ]);
}
