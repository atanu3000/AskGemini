import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import React from 'react';
import ChatScreen from './Screens/ChatScreen';
import LinearGradient from 'react-native-linear-gradient';

export default function App() {
  const colorScheme = useColorScheme();
  const ThemeColor = colorScheme === 'light' ? '#fff' : '#212121';
  const barStyle = colorScheme === 'light' ? 'dark-content' : 'light-content';
  
  return (
    <LinearGradient colors={['#ffffff00', '#a7c2fc77']} style={[styles.container, {backgroundColor: ThemeColor}]}>
      <StatusBar backgroundColor={ThemeColor} barStyle={barStyle} />
      <ChatScreen />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    flex: 1,
    paddingHorizontal: 15,
  },
});
