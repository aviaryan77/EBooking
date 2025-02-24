import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SigninScreen from '../screens/Auth/SigninScreen';


export type AuthStackParamList = {
  SigninScreen: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SigninScreen" component={SigninScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;