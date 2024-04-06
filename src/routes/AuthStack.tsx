import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Screen imports
import Login from '../Screens/Login';
import Signup from '../Screens/Signup';
import {useTheme} from '../Context/ThemeContext';

export type AuthStackParamList = {
  Signup: undefined;
  Login: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStack = () => {
  const {theme} = useTheme();
  const Background = theme === 'dark' ? '#222' : '#fff';
  const FontColor = theme === 'dark' ? '#eee' : '#444';
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
};
