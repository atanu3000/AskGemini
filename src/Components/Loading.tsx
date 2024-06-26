import { ActivityIndicator, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from '../Context/ThemeContext';

const Loading = () => {
  const {theme} = useTheme();
  const Background = theme === 'dark' ? '#222831' : '#fff';
  const barStyle = theme === 'dark' ? 'light-content' : 'dark-content';
  const FontColor = theme === 'dark' ? '#eee' : '#444';

  return (
    <>
    <StatusBar backgroundColor={Background} barStyle={barStyle} />
    <View style={[styles.container, {backgroundColor: Background}]}>
      <ActivityIndicator size={45} color="#1d9bf0" />
      <Text style={{color: FontColor, marginTop: 5}}>Loading...</Text>
    </View>
    </>
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