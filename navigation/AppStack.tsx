import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
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
      <Stack.Screen name="TabNavigator" component={TabNavigator} />
      <Stack.Screen name="EventListingScreen" component={EventListingScreen} />
      <Stack.Screen name="EventDetailsScreen" component={EventDetailsScreen} />
      <Stack.Screen
        name="ConfirmDetailsScreen"
        component={ConfirmDetailsScreen}
      />
      <Stack.Screen
        name="TicketBookingScreen"
        component={TicketBookingScreen}
      />
      <Stack.Screen
        name="BookingConfirmationScreen"
        component={BookingConfirmationScreen}
      />
      <Stack.Screen
        name="CheckEventPaymentStatusScreen"
        component={CheckEventPaymentStatusScreen}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
