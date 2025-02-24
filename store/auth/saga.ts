// Auth Redux States
import {takeEvery, fork, put, all, call, select} from 'redux-saga/effects';
import {
  SEND_OTP,
  LOGIN,
  REFRESH_TOKEN,
  //PROFILE
  GET_PROFILE,
  UPDATE_PROFILE,
  LOGOUT,
} from './actionTypes';

import {
  sendOtpSuccess,
  loginSuccess,
  refreshTokenSuccess,
  getProfileSuccess,
  updateProfileSuccess,
  logoutSuccess,
  authError,
} from './actions';

import {loginApi, updateProfileApi} from '../../helpers/Api';

// import { SagaPayloadType } from '@/types/Types';
// import { toast } from '@/helpers/Toast';

import {store} from '../index';
import {SagaPayloadType} from '../../types';
import {toast} from '../../theme';

// LOGIN
function* login({
  payload: {data, callback = () => {}},
}: SagaPayloadType): Generator<any, void, any> {
  try {
    const response = yield call(loginApi, {data});
    if (response?.status === 200 || response?.status === 201) {
      yield put(loginSuccess(response?.data));
      callback(response?.data);
      toast({
        title: 'Success',
        message: 'Login Successful',
        type: 'success',
      });
    } else {
      console.log('error in verify otp', response?.data);
      toast({
        title: 'Error',
        message: response?.data?.error,
        type: 'error',
      });
      yield put(authError(`error with status code : ${response.status}`));
    }
  } catch (error) {
    yield put(authError(error));
    console.log('error in verify otp', error);
    toast({
      title: 'Error',
      message: 'Something went wrong',
      type: 'error',
    });
  }
}

// PROFILE
function* getProfile({
  payload: {data, callback = () => {}},
}: SagaPayloadType): Generator<any, void, any> {
  try {
    const state: any = store.getState();

    yield put(getProfileSuccess(state?.auth?.user));
    callback(state?.auth?.user);
  } catch (error) {
    yield put(authError(error));
  }
}

function* updateProfile({
  payload: {data, callback = () => {}},
}: SagaPayloadType): Generator<any, void, any> {
  try {
    const response = yield call(updateProfileApi, {data});
    if (response?.status === 200) {
      yield put(updateProfileSuccess(response?.data));
      callback(response?.data);
      toast({
        title: 'Success',
        message: 'Profile Updated Successfully',
        type: 'success',
      });
    } else {
      yield put(authError(`error with status code : ${response.status}`));
    }
  } catch (error) {
    yield put(authError(error));
  }
}

// LOGOUT
function* logout({
  payload: {callback = () => {}},
}: SagaPayloadType): Generator<any, void, any> {
  try {
    // const response = yield call(logoutApi);
    if (true) {
      yield put(logoutSuccess({}));
      if (callback) callback('success');
    }
  } catch (error) {
    console.log('error', error);
    yield put(authError(error));
  }
}

export function* watchAuth() {
  yield takeEvery(LOGIN, login);
  yield takeEvery(GET_PROFILE, getProfile);
  yield takeEvery(UPDATE_PROFILE, updateProfile);
  yield takeEvery(LOGOUT, logout);
}

export default function* authSaga() {
  yield all([fork(watchAuth)]);
}
