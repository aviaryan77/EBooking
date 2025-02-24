import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import {Screen} from '../../theme';

import {useAppDispatch} from '../../store/ReduxHook';

const HomeTabScreen = () => {
  const dispatch = useAppDispatch();

  // Fetch current device location

  return (
    <Screen pt={32} px={16}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 40}}></ScrollView>
    </Screen>
  );
};

export default HomeTabScreen;
