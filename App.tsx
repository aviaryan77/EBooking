import React from 'react';
import MainNavigation from './navigation/MainNavigation';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {store} from './store';
import {toastConfig} from './theme';
import {Provider} from 'react-redux';
import {persistStore} from 'redux-persist';
import Toast from 'react-native-toast-message';
import {PersistGate} from 'redux-persist/integration/react';

const App = () => {
  const persistor = persistStore(store);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SafeAreaProvider>
          <GestureHandlerRootView style={{flex: 1}}>
            <MainNavigation />
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </PersistGate>
      <Toast config={toastConfig} />
    </Provider>
  );
};

export default App;
