import {all} from 'redux-saga/effects';

import authSaga from './auth/saga';
import bookingsSaga from './bookings/saga';

export default function* () {
  yield all([
    authSaga(),
    bookingsSaga(),
  ]);
}
