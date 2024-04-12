import {
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ChatScreen from './Screens/ChatScreen';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome6';
import useChatContext from './Context/ChatContext';
import {useTheme} from './Context/ThemeContext';
import {useAppwrite} from './appwrite/AppwriteContext';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from './routes/AppStack';
import SplashScreen from './Screens/SpashScreen';
import { vc } from './assets/Styles/Dimensions';

export type userObj = {
  name: string;
  email: string;
};

type ScreenProps = NativeStackScreenProps<AppStackParamList, 'MainContainer'>;

const MainContainer = ({navigation}: ScreenProps) => {
  const {theme} = useTheme();
  const isDarkTheme = theme === 'dark' ? true : false;
  const ThemeColor = !isDarkTheme ? '#fff' : '#222831';
  const FontColor = !isDarkTheme ? '#212121' : '#fff';
  const barStyle = !isDarkTheme ? 'dark-content' : 'light-content';
  const {width, height} = Dimensions.get('window');

  const offsetValue = React.useRef(new Animated.Value(0)).current;
  const modelImage = require('../android/app/src/main/res/mipmap-hdpi/ic_launcher.png');
  const {setIsChatStarted, showMenu, setShowMenu, isLoading} = useChatContext();

  const {appwrite, setIsLogedin} = useAppwrite();
  const [userData, setUserData] = useState<userObj>();
  const [isAppStarted, setIsAppStarted] = useState<boolean>(true);

  useEffect(() => {
    appwrite.GetCurrentUser().then(response => {
      if (response) {
        const user: userObj = {
          name: response.name,
          email: response.email,
        };
        setUserData(user);
      }
    });
  }, [appwrite]);

  return (
    <>
      {isAppStarted ? (
        <SplashScreen setIsLoading={setIsAppStarted} />
      ) : (
        <SafeAreaView
          style={[
            styles.menuContainer,
            {backgroundColor: !isDarkTheme ? '#6a97f7' : '#1e2b47', paddingTop: height*0.04},
          ]}>
          <StatusBar
            animated
            backgroundColor={'transparent'}
            barStyle={barStyle}
            translucent
          />
          <View style={{height: '100%', justifyContent: 'space-between'}}>
            <View>
              <TouchableWithoutFeedback>
                <View
                  style={[
                    styles.searchBox,
                    {backgroundColor: !isDarkTheme ? '#9dbafa' : '#485675'},
                  ]}>
                  <Icon name={'magnifying-glass'} size={16} color={FontColor} />
                  <Text style={{color: FontColor, fontSize: 15}}>Search</Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => {
                  !isLoading && setIsChatStarted(false);
                  setShowMenu(false);
                  Animated.timing(offsetValue, {
                    toValue: showMenu ? 0 : width * 0.8,
                    duration: 300,
                    useNativeDriver: true,
                  }).start();
                }}>
                <View
                  style={[
                    styles.newChat,
                    {backgroundColor: !isDarkTheme ? '#acdcfa' : '#60879e'},
                  ]}>
                  <Image source={modelImage} style={{height: 35, width: 35}} />
                  <Text style={{color: FontColor, fontSize: 15}}>
                    AskGemini
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Settings');
                Animated.timing(offsetValue, {
                  toValue: showMenu ? 0 : width * 0.8,
                  duration: 300,
                  useNativeDriver: true,
                }).start();
                setShowMenu(!showMenu);
              }}
              style={[
                styles.themeButton,
                {backgroundColor: !isDarkTheme ? '#9dbafa' : '#485675'},
              ]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View
                  style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                  <Icon
                    name={'circle-user'}
                    solid
                    size={35}
                    color={FontColor}
                  />
                  <View>
                    <Text
                      style={{
                        color: FontColor,
                        fontSize: 16,
                        fontWeight: '500',
                      }}>
                      {userData?.name}
                    </Text>
                    <Text style={{color: FontColor}}>
                      {userData?.email.split('').slice(0, 17)}
                      {userData?.email.length! > 17 && '...'}
                    </Text>
                  </View>
                </View>
                <Icon name={'ellipsis-vertical'} color={FontColor} size={20} />
              </View>
            </TouchableOpacity>
          </View>
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              transform: [{scale: 1}, {translateX: offsetValue}],
            }}>
            <LinearGradient
              colors={['#ffffff00', '#a7c2fc' + `${isDarkTheme ? '44' : '88'}`]}
              style={[styles.container, {backgroundColor: ThemeColor}]}>
              <ChatScreen offsetValue={offsetValue} />
            </LinearGradient>
          </Animated.View>
        </SafeAreaView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    height: '100%',
    width: '100%',
    // paddingTop: vc(13),
  },
  searchBox: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 15,
    marginHorizontal: 10,
    width: '75%',
  },
  newChat: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginTop: 15,
    paddingLeft: 20,
    paddingVertical: 15,
  },
  container: {
    height: '100%',
    width: '100%',
    flex: 1,
  },
  themeButton: {
    paddingVertical: 10,
    marginVertical: 10,
    width: '75%',
    marginHorizontal: 10,
    borderRadius: 20,
    paddingHorizontal: 25,
  },
});

export default MainContainer;
