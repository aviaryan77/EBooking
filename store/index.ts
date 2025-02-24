import {compose} from 'redux';

import {configureStore} from '@reduxjs/toolkit';
import {persistReducer} from 'redux-persist';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet';

import createSagaMiddleware from 'redux-saga';

import rootReducer from './Index-Reducer';
import IndexSaga from './Index-Saga';
import {reduxStorage} from './persistor';

const sagaMiddleware = createSagaMiddleware();

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: typeof compose;
  }
}

const persistConfig = {
  key: 'root',
  storage: reduxStorage,
  // whitelist: [],
  blacklist: [],
  stateReconciler: hardSet,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleWares = [sagaMiddleware]; //add more middleware if required here

//Configure the Redux store with appReducer, middleware, and any other options
const store = configureStore({
  reducer: persistedReducer,
  // @ts-ignore
  middleware: () => middleWares,
  // Add other options as needed
});

sagaMiddleware.run(IndexSaga);

export {store};

export type IAppDispatch = typeof store.dispatch;
