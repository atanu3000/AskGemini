import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {Dispatch, SetStateAction} from 'react';
import LottieView from 'lottie-react-native';
import {useTheme} from '../Context/ThemeContext';

interface SplashScreenProps {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const SplashScreen = ({setIsLoading}: SplashScreenProps): JSX.Element => {
  const {theme} = useTheme();
  const Background = theme === 'dark' ? '#222831' : '#fff';
  const barStyle = theme === 'dark' ? 'light-content' : 'dark-content';
  return (
    <View style={[styles.conatiner, {backgroundColor: Background}]}>
      <StatusBar animated backgroundColor={Background} barStyle={barStyle}/>
      <LottieView
        style={{width: '35%', height: '35%'}}
        source={require('../assets/message-loading-animation.json')}
        autoPlay
        loop={false}
        resizeMode="cover"
        speed={2}
        onAnimationFinish={() => setIsLoading(false)}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
  },
});
