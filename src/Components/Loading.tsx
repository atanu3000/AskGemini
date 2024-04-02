import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from '../Context/ThemeContext';

const Loading = () => {
  const {theme} = useTheme();
  const Background = theme === 'dark' ? '#222' : '#fff';
  const FontColor = theme === 'dark' ? '#eee' : '#444';
  return (
    <View style={[styles.container, {backgroundColor: Background}]}>
      <ActivityIndicator size={40} color="#1d9bf0" />
      <Text style={{color: FontColor, marginTop: 5}}>Loading...</Text>
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default Loading