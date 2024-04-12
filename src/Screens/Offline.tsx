import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableWithoutFeedback,
  View,
  Image,
} from 'react-native';
import React from 'react';
import {useAppwrite} from '../appwrite/AppwriteContext';
import {useTheme} from '../Context/ThemeContext';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';

const Welcome = () => {
  const {setIsLogedin} = useAppwrite();
  const {theme} = useTheme();
  const ThemeColor = theme === 'dark' ? '#222831' : '#7EA1FF';
  const FontColor = theme === 'dark' ? '#ddd' : '#1C1678';
  const barStyle = theme === 'dark' ? 'light-content' : 'dark-content';
  return (
    <View style={[styles.container, {backgroundColor: ThemeColor}]}>
      <StatusBar
        backgroundColor={'transparent'}
        translucent
        barStyle={barStyle}
      />
      <Image
        source={require('../assets/icons8-offline-94.png')}
        style={styles.image}
      />
      <Text style={[styles.heading, {color: FontColor}]}>
        You're looking offline
      </Text>
      <Text style={[styles.caption, {color: '#D5FDFF'}]}>
        Please check your Internet connection, join WiFi for stronger signal.
      </Text>
      <TouchableWithoutFeedback
        onPress={() =>
          ToastAndroid.show('Turn on your data', ToastAndroid.SHORT)
        }>
        <View style={[styles.btn, {backgroundColor: FontColor}]}>
          <Icon name="rotate-right" size={22} color={ThemeColor} />
          <Text style={{color: ThemeColor, fontSize: 16}}>Try Again</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: '10%',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  caption: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 25,
  },
  btn: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '60%',
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 50,
  },
});
