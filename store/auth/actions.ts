import {PayloadType, UserType} from '../../types';
import {
  LOGIN,
  LOGIN_SUCCESS,

  //PROFILE
  GET_PROFILE,
  GET_PROFILE_SUCCESS,
  UPDATE_PROFILE,
  UPDATE_PROFILE_SUCCESS,
  LOGOUT,
  LOGOUT_SUCCESS,
  AUTH_ERROR,
} from './actionTypes';

export const login = (
  data: PayloadType<{email?: string; password: string}>,
) => {
  return {
    type: LOGIN,
    payload: data,
  };
};
export const loginSuccess = (data: PayloadType) => {
  return {
    type: LOGIN_SUCCESS,
    payload: data,
  };
};

// PROFILE
export const getProfile = (data: PayloadType) => {
  return {
    type: GET_PROFILE,
    payload: data,
  };
};

export const getProfileSuccess = (data: PayloadType) => {
  return {
    type: GET_PROFILE_SUCCESS,
    payload: data,
  };
};

export const updateProfile = (data: PayloadType) => {
  return {
    type: UPDATE_PROFILE,
    payload: data,
  };
};

export const updateProfileSuccess = (data: PayloadType) => {
  return {
    type: UPDATE_PROFILE_SUCCESS,
    payload: data,
  };
};

// LOGOUT
export const logout = (data: PayloadType) => {
  return {
    type: LOGOUT,
    payload: data,
  };
};
export const logoutSuccess = (data: PayloadType) => {
  return {
    type: LOGOUT_SUCCESS,
    payload: data,
  };
};

export const authError = (error: any) => {
  return {
    type: AUTH_ERROR,
    payload: error,
  };
};

// TYPESCRIPT ACTION TYPES
export type AuthActionType =
  | {type: typeof LOGIN; payload: PayloadType}
  | {
      type: typeof LOGIN_SUCCESS;
      payload: {
        accessToken?: string;
        user: UserType;
      };
    }
  | {type: typeof GET_PROFILE; payload: PayloadType}
  | {type: typeof GET_PROFILE_SUCCESS; payload: PayloadType}
  | {type: typeof UPDATE_PROFILE; payload: PayloadType}
  | {
      type: typeof UPDATE_PROFILE_SUCCESS;
      payload: {
        user: UserType;
      };
    }
  | {type: typeof LOGOUT; payload: PayloadType}
  | {type: typeof LOGOUT_SUCCESS; payload: PayloadType}
  | {type: typeof AUTH_ERROR; payload: PayloadType};
