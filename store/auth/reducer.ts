import {
  LOGIN,
  LOGIN_SUCCESS,

  //PROFILE
  GET_PROFILE,
  GET_PROFILE_SUCCESS,
  UPDATE_PROFILE,
  UPDATE_PROFILE_SUCCESS,

  // LOGOUT
  LOGOUT,
  LOGOUT_SUCCESS,
  AUTH_ERROR,
} from './actionTypes';
import {AuthActionType} from './actions';

interface AuthState {
  // Define your state properties here
  accessToken?: string;
  logoutLoading: boolean;
  loginLoading: boolean;
  refreshToken?: string | null;
  updateProfileLoading: boolean;
  user?: any;
  error: any;
}

const initialState: AuthState = {
  // Define your initial state here
  accessToken: '',
  refreshToken: null,
  loginLoading: false,
  user: null,
  logoutLoading: false,
  updateProfileLoading: false,
  error: null,
};

const authReducer = (state = initialState, action: AuthActionType) => {
  switch (action.type) {
    case LOGIN:
      state = {
        ...state,
        loginLoading: true,
      };
      break;

    case LOGIN_SUCCESS:
      state = {
        ...state,
        loginLoading: false,
        accessToken: action.payload?.accessToken,
        user: action.payload?.user,
      };
      break;

    // PROFILE
    case GET_PROFILE:
      state = {
        ...state,
      };
      break;

    case GET_PROFILE_SUCCESS:
      state = {
        ...state,
        user: action.payload,
      };
      break;

    case UPDATE_PROFILE:
      state = {
        ...state,
        updateProfileLoading: true,
      };
      break;

    case UPDATE_PROFILE_SUCCESS:
      state = {
        ...state,
        user: action.payload?.user,
        updateProfileLoading: false,
      };
      break;

    // LOGOUT
    case LOGOUT:
      state = {
        ...state,
        logoutLoading: true,
      };
      break;

    case LOGOUT_SUCCESS:
      state = {
        ...state,
        accessToken: '',
        refreshToken: null,
        updateProfileLoading: false,
        user: null,
        logoutLoading: false,
        error: null,
      };
      break;

    case AUTH_ERROR:
      state = {
        ...state,
        updateProfileLoading: false,
        loginLoading: false,
        logoutLoading: false,
        error: action?.payload,
      };
      break;

    default:
      state = {...state};
      break;
  }
  return state;
};

export default authReducer;
