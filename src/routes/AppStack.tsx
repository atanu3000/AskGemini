import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import MainContainer from '../MainContainer';
import Settings from '../Screens/Settings';
import { useTheme } from '../Context/ThemeContext';

export type AppStackParamList = {
  MainContainer: undefined;
  Settings: {name?: string, email?: string};
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppStack = () => {
  const {theme} = useTheme();
  const Background = theme === 'dark' ? '#222' : '#fff';
  const FontColor = theme === 'dark' ? '#eee' : '#444';
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
      }}>
      <Stack.Screen
        name="MainContainer"
        component={MainContainer}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShadowVisible: false,
          headerTitleAlign: 'left',
          headerTitleStyle: {fontSize: 20},
          headerStyle: {backgroundColor: Background},
          headerTintColor: FontColor
        }}
      />
    </Stack.Navigator>
  );
};
