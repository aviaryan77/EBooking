import {takeEvery, fork, put, all, call} from 'redux-saga/effects';
import {GET_MY_BOOKINGS, UPDATE_MY_BOOKINGS} from './actionTypes';

import {
  getMyBookingsSuccess,
  updateMyBookingsSuccess,
  bookingsError,
} from './actions';

import {SagaPayloadType} from '../../types';
import {toast} from '../../theme';
import {store} from '../index';

function* getMyBookings({
  payload: {callback = () => {}},
}: SagaPayloadType): Generator<any, void, any> {
  try {
    const state: any = store.getState();
    yield put(getMyBookingsSuccess(state?.bookings.bookings));
    callback(state?.bookings.bookings);
  } catch (error) {
    yield put(bookingsError(error));
    toast({
      title: 'Error',
      message: 'Something went wrong',
      type: 'error',
    });
  }
}

function* updateMyBookings({
  payload: {data, callback = () => {}},
}: SagaPayloadType): Generator<any, void, any> {
  try {
    yield put(updateMyBookingsSuccess({data:{event:data}}));
    callback(data);
  } catch (error) {
    yield put(bookingsError(error));
    toast({
      title: 'Error',
      message: 'Something went wrong',
      type: 'error',
    });
  }
}

export function* watchBookings() {
  yield takeEvery(GET_MY_BOOKINGS, getMyBookings);
  yield takeEvery(UPDATE_MY_BOOKINGS, updateMyBookings);
}

export default function* bookingsSaga() {
  yield all([fork(watchBookings)]);
}
