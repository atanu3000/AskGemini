import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Screen imports
import Login from '../Screens/Login';
import Signup from '../Screens/Signup';
import Welcome from '../Screens/Welcome';

export type AuthStackParamList = {
  Signup: undefined;
  Login: undefined;
  Welcome: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false, gestureEnabled: false}}>
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Welcome" component={Welcome} />
    </Stack.Navigator>
  );
};
