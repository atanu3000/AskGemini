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
      <ScrollView
        // contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 100}}>
        <Text style={[styles.heading, {color: FontColor}]}>
          Welcome to AskGemini an AI Chatting App
        </Text>
        <View style={[styles.seprator, {backgroundColor: FontColor}]}></View>
        <Text style={[styles.caption, {color: FontColor}]}>
          {/* - Where Text and Images Unite! */}
          - Your AI companion for daily assistance.
        </Text>
        <View style={[styles.seprator, {backgroundColor: FontColor}]}></View>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png')}
            style={styles.image}
          />
        </View>
        <TouchableWithoutFeedback
          onPress={() => {
            setIsLogedin(true);
            ToastAndroid.show('Welcome to AskGemini', ToastAndroid.SHORT);
          }}>
          <View style={[styles.btn, {backgroundColor: FontColor}]}>
            <Text style={{color: ThemeColor, fontSize: 16}}>Continue</Text>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: '10%',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: '300',
    color: '#000',
    textAlign: 'center',
    marginVertical: 16,
  },
  seprator: {
    height: 1,
    backgroundColor: '#BBB',
  },
  caption: {
    marginVertical: 5,
    fontSize: 20,
    fontWeight: '400',
    fontStyle: 'italic',
    color: '#000',
    textAlign: 'center',
  },
  imageContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#FFFFFF',
    marginTop: 25,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 55,
  },
  image: {
    width: 100,
    height: 100,
  },
  btn: {
    alignItems: 'center',
    alignSelf: 'center',
    width: '60%',
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 50,
  },
});
