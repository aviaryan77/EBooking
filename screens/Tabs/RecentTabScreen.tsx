import React from 'react';

import { Flex, Screen, Text, VStack} from '../../theme';
import {ScrollView} from 'react-native';

const RecentTabScreen = () => {
  return (
    <Screen pt={32} px={16}>
      <Flex justify="space-between" align="center">
        <Text variant="regular">Recently visited</Text>
      </Flex>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 40}}></ScrollView>
    </Screen>
  );
};

export default RecentTabScreen;
