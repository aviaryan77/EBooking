import React from 'react';
import {navigationRef} from './RootNavigation';
import {useAppSelector} from '../store/ReduxHook';
import {NavigationContainer} from '@react-navigation/native';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

import AppStack from './AppStack';
import AuthStack from './AuthStack';

const MainNavigation = () => {
  const {accessToken} = useAppSelector(s => s.auth);
  return (
    <NavigationContainer ref={navigationRef}>
      <BottomSheetModalProvider>
        {accessToken ? <AppStack /> : <AuthStack />}
      </BottomSheetModalProvider>
    </NavigationContainer>
  );
};

export default MainNavigation;
