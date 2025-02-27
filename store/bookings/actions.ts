import { EventType } from '../../components/experiences/EVENT_DATA';
import { PayloadType } from '../../types';
import {
  GET_MY_BOOKINGS,
  GET_MY_BOOKINGS_SUCCESS,
  UPDATE_MY_BOOKINGS,
  UPDATE_MY_BOOKINGS_SUCCESS,
  BOOKINGS_ERROR,
} from './actionTypes';

export const getMyBookings = (data: PayloadType) => ({
  type: GET_MY_BOOKINGS,
  payload: data,
});

export const getMyBookingsSuccess = (data: PayloadType) => ({
  type: GET_MY_BOOKINGS_SUCCESS,
  payload: data,
});

export const updateMyBookings = (data: PayloadType) => ({
  type: UPDATE_MY_BOOKINGS,
  payload: data,
});

export const updateMyBookingsSuccess = (data: PayloadType) => ({
  type: UPDATE_MY_BOOKINGS_SUCCESS,
  payload: data,
});

export const bookingsError = (error: any) => ({
  type: BOOKINGS_ERROR,
  payload: error,
});

export type BookingActionType =
  | { type: typeof GET_MY_BOOKINGS; payload: PayloadType }
  | { type: typeof GET_MY_BOOKINGS_SUCCESS; payload: PayloadType }
  | { type: typeof UPDATE_MY_BOOKINGS; payload: PayloadType }
  | { type: typeof UPDATE_MY_BOOKINGS_SUCCESS; payload: {data:{event:EventType}} }
  | { type: typeof BOOKINGS_ERROR; payload: any };
