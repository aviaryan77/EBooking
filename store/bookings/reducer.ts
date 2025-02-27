import {EventType} from '../../components/experiences/EVENT_DATA';
import {
  GET_MY_BOOKINGS,
  GET_MY_BOOKINGS_SUCCESS,
  UPDATE_MY_BOOKINGS,
  UPDATE_MY_BOOKINGS_SUCCESS,
  BOOKINGS_ERROR,
} from './actionTypes';
import {BookingActionType} from './actions';

interface BookingsState {
  bookings: EventType[];
  loading: boolean;
  updateLoading: boolean;
  error: any;
}

const initialState: BookingsState = {
  bookings: [],
  loading: false,
  updateLoading: false,
  error: null,
};

const bookingsReducer = (state = initialState, action: BookingActionType) => {
  switch (action.type) {
    case GET_MY_BOOKINGS:
      state = {
        ...state,
        loading: true,
      };
      break;

    case GET_MY_BOOKINGS_SUCCESS:
      state = {
        ...state,
        loading: false,
      };
      break;

    case UPDATE_MY_BOOKINGS:
      state = {
        ...state,
        updateLoading: true,
      };
      break;

    case UPDATE_MY_BOOKINGS_SUCCESS:
      state = {
        ...state,
        updateLoading: false,
        bookings: [...state.bookings, action.payload.data.event],
      };
      break;

    case BOOKINGS_ERROR:
      state = {
        ...state,
        loading: false,
        updateLoading: false,
        error: action.payload,
      };
      break;

    default:
      state = {...state};
      break;
  }
  return state;
};

export default bookingsReducer;
