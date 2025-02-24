import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './RootNavigation';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

const MainNavigation = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <BottomSheetModalProvider>
        {true ? <AuthStack /> : <AppStack />}
      </BottomSheetModalProvider>
    </NavigationContainer>
  );
};

export default MainNavigation;
