import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import HomeScreen from '../screens/Home/HomeScreen';
import TabNavigator from './TabNavigator';
import {
  EventListingScreen,
  EventDetailsScreen,
  ConfirmDetailsScreen,
  TicketBookingScreen,
  BookingConfirmationScreen,
  CheckEventPaymentStatusScreen,
} from '../screens/Experiences';

export type AppStackParamList = {
  HomeScreen: undefined;
  TabNavigator: undefined;
  EventListingScreen: undefined;
  EventDetailsScreen: undefined;
  ConfirmDetailsScreen: undefined;
  TicketBookingScreen: undefined;
  BookingConfirmationScreen: undefined;
  CheckEventPaymentStatusScreen: undefined;
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
      <Stack.Screen
        name="EventListingScreen"
        getComponent={() => EventListingScreen}
      />
      <Stack.Screen
        name="EventDetailsScreen"
        getComponent={() => EventDetailsScreen}
      />
      <Stack.Screen
        name="ConfirmDetailsScreen"
        getComponent={() => ConfirmDetailsScreen}
      />
      <Stack.Screen
        name="TicketBookingScreen"
        getComponent={() => TicketBookingScreen}
      />
      <Stack.Screen
        name="BookingConfirmationScreen"
        getComponent={() => BookingConfirmationScreen}
      />
      <Stack.Screen
        name="CheckEventPaymentStatusScreen"
        getComponent={() => CheckEventPaymentStatusScreen}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
