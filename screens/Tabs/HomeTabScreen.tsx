import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import {Screen} from '../../theme';

import {useAppDispatch} from '../../store/ReduxHook';
import EventEntry from '../../components/experiences/EventEntry';

const HomeTabScreen = () => {
  const dispatch = useAppDispatch();

  // Fetch current device location

  return (
    <Screen pt={32} px={16}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 40}}>

          <EventEntry visible={true}/>
        </ScrollView>
    </Screen>
  );
};

export default HomeTabScreen;
