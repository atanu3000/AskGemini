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

export default function App() {
  const colorScheme = useColorScheme();
  const ThemeColor = colorScheme === 'light' ? '#eee' : '#212121';
  const barStyle = colorScheme === 'light' ? 'dark-content' : 'light-content';
  return (
    <View style={[styles.container, {backgroundColor: ThemeColor}]}>
      <StatusBar backgroundColor={ThemeColor} barStyle={barStyle}/>
      <ChatScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    flex: 1,
  },
});
