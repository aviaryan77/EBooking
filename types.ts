import {AppStackParamList} from './navigation/AppStack';
import {IAppDispatch} from './store';
import {RootState as IRootState} from './store/Index-Reducer';

import {StackScreenProps} from '@react-navigation/stack';
import {AuthStackParamList} from './navigation/AuthStack';

export type RootState = IRootState;
export type AppDispatch = IAppDispatch;

// REDUX
export interface Action {
  type: string;
  payload?: any;
}

// NAVIGATION
export type AuthScreenProps = StackScreenProps<AuthStackParamList>;
export type AppScreenProps = StackScreenProps<AppStackParamList>;
export type StackParamList = AppStackParamList & AuthStackParamList;

// combine these two
// export type ScreenProps = CompositeScreenProps<StackScreenProps<AuthStackParamList> , StackScreenProps<AppStackParamList>>
export type ScreenProps = StackScreenProps<AppStackParamList>;

// REDUX
export interface Action {
  type: string;
  payload?: any;
}

export interface PayloadType<D = any, P = any> {
  data?: D;
  callback?: (cb: any) => void;
  _id?: string;
  params?: P;
}

export interface SagaPayloadType {
  payload: PayloadType;
  type: string;
}

export interface UserType {
  _id?: string;
  email: string;
  name?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}
