import { PayloadType, UserType } from '../../types';
import {
  SEND_OTP,
  SEND_OTP_SUCCESS,
  LOGIN,
  LOGIN_SUCCESS,
  REFRESH_TOKEN,
  REFRESH_TOKEN_SUCCESS,

  //PROFILE
  GET_PROFILE,
  GET_PROFILE_SUCCESS,
  UPDATE_PROFILE,
  UPDATE_PROFILE_SUCCESS,
  LOGOUT,
  LOGOUT_SUCCESS,
  AUTH_ERROR,
} from './actionTypes';



export const sendOtp = (
  data: PayloadType<{ phone?: string } | { email?: string }>
) => {
  return {
    type: SEND_OTP,
    payload: data,
  };
};
export const sendOtpSuccess = (data: PayloadType) => {
  return {
    type: SEND_OTP_SUCCESS,
    payload: data,
  };
};
export const login = (
  data: PayloadType<{ phone?: string; email?: string; password: string }>
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
export const refreshToken = (data: PayloadType) => {
  return {
    type: REFRESH_TOKEN,
    payload: data,
  };
};
export const refreshTokenSuccess = (data: string) => {
  return {
    type: REFRESH_TOKEN_SUCCESS,
    payload: { accessToken: data },
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
  | { type: typeof SEND_OTP; payload: PayloadType }
  | { type: typeof SEND_OTP_SUCCESS; payload: PayloadType }
  | { type: typeof LOGIN; payload: PayloadType }
  | {
      type: typeof LOGIN_SUCCESS;
      payload: {
        accessToken?: string;
        user: UserType;
      };
    }
  | { type: typeof REFRESH_TOKEN; payload: PayloadType }
  | { type: typeof REFRESH_TOKEN_SUCCESS; payload: any }
  | { type: typeof GET_PROFILE; payload: PayloadType }
  | { type: typeof GET_PROFILE_SUCCESS; payload: PayloadType }
  | { type: typeof UPDATE_PROFILE; payload: PayloadType }
  | {
      type: typeof UPDATE_PROFILE_SUCCESS;
      payload: {
        user: UserType;
      };
    }
  | { type: typeof LOGOUT; payload: PayloadType }
  | { type: typeof LOGOUT_SUCCESS; payload: PayloadType }
  | { type: typeof AUTH_ERROR; payload: PayloadType };
