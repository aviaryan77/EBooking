import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import HomeScreen from '../screens/Home/HomeScreen';
import TabNavigator from './TabNavigator';

export type AppStackParamList = {
  HomeScreen: undefined;
  TabNavigator: undefined;
};

const Stack = createStackNavigator<AppStackParamList>();

const AppStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="TabNavigator"
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="TabNavigator" getComponent={() => TabNavigator} />
    </Stack.Navigator>
  );
};

export default AppStack;
