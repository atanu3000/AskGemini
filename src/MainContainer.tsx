import {
  Animated,
  Dimensions,
  DrawerLayoutAndroid,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import ChatScreen, {chatsType} from './Screens/ChatScreen';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome6';
import useChatContext from './Context/ChatContext';
import {useTheme} from './Context/ThemeContext';
import {useAppwrite} from './appwrite/AppwriteContext';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from './routes/AppStack';
import SplashScreen from './Screens/SpashScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type userObj = {
  name: string;
  email: string;
};

type ScreenProps = NativeStackScreenProps<AppStackParamList, 'MainContainer'>;

export const getChats = async (): Promise<chatsType[]> => {
  const chatContents = await AsyncStorage.getItem('AskGemini_ChatHistory');
  const parsedChats: chatsType[] = chatContents ? JSON.parse(chatContents) : [];
  return parsedChats;
};

const MainContainer = ({navigation}: ScreenProps) => {
  const {theme} = useTheme();
  const isDarkTheme = theme === 'dark' ? true : false;
  const ThemeColor = !isDarkTheme ? '#fff' : '#222831';
  const FontColor = !isDarkTheme ? '#212121' : '#fff';
  const barStyle = !isDarkTheme ? 'dark-content' : 'light-content';
  const {width, height} = Dimensions.get('window');

  const offsetValue = React.useRef(new Animated.Value(0)).current;
  const modelImage = require('../android/app/src/main/res/mipmap-hdpi/ic_launcher.png');
  const {
    setIsChatStarted,
    showMenu,
    setShowMenu,
    isLoading,
    setChatHistory,
    setChatTitle,
    chatId,
    setChatId,
  } = useChatContext();
  const [chats, setChats] = useState<chatsType[]>();

  const {appwrite, setIsLogedin} = useAppwrite();
  const [userData, setUserData] = useState<userObj>();
  const [isAppStarted, setIsAppStarted] = useState<boolean>(true);
  const drawer = useRef<DrawerLayoutAndroid>(null);

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

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const chatContents = await getChats();
      setChats(chatContents);
      // AsyncStorage.setItem('AskGemini_ChatHistory', JSON.stringify([]))
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);
  //  console.log(chats);
  //  console.log(chatId);

  const viewChatHistory = (chatContent: chatsType, id: string) => {
    if (!isLoading) {
      setIsChatStarted(true);
      setChatId(id);
      setChatHistory(chatContent.chat);
      setChatTitle(chatContent.title);
      drawer.current?.closeDrawer();
    }
  };

  const newChat = () => {
    drawer.current?.closeDrawer();
    !isLoading && setIsChatStarted(false);
    setChatId('');
  };

  const NavigationView: React.FC = () => {
    return (
      <View style={{height: '100%', flex: 1, paddingTop: height * 0.04}}>
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
          <TouchableWithoutFeedback onPress={newChat}>
            <View
              style={[
                styles.newChat,
                {backgroundColor: !isDarkTheme ? '#acdcfa' : '#60879e'},
              ]}>
              <Image source={modelImage} style={{height: 35, width: 35}} />
              <Text style={{color: FontColor, fontSize: 15}}>
                AskGemini{isLoading}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={{flex: 1}}>
          {chats?.length === 0 ? (
            <View style={styles.noChats}>
              <Icon name={'message'} size={25} color={FontColor} />
              <Text style={{color: FontColor, fontSize: 16}}>
                No recent chats
              </Text>
            </View>
          ) : (
            <ScrollView style={{paddingTop: 10}}>
              {chats?.map(chat => (
                <TouchableOpacity
                  key={chat.id}
                  onPress={() => {
                    viewChatHistory(chat, chat.id);
                    
                  }}
                  style={[
                    styles.oldChats,
                    chatId === chat.id && {
                      backgroundColor: !isDarkTheme ? '#9dbafa' : '#485675',
                    },
                  ]}>
                  <Text style={[styles.chatTitles, {color: FontColor}]}>
                    {chat.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Settings', {
              name: userData?.name,
              email: userData?.email,
            });
            drawer.current?.closeDrawer();
          }}
          style={[
            styles.profileButton,
            {backgroundColor: !isDarkTheme ? '#9dbafa' : '#485675'},
          ]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
              <Icon name={'circle-user'} solid size={35} color={FontColor} />
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
    );
  };

  return (
    <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={width * 0.8}
      drawerPosition={'left'}
      drawerBackgroundColor={!isDarkTheme ? '#6a97f7' : '#1e2b47'}
      renderNavigationView={() => <NavigationView />}>
      <View style={styles.container}>
        {isAppStarted ? (
          <SplashScreen setIsLoading={setIsAppStarted} />
        ) : (
          <SafeAreaView
            style={[
              styles.menuContainer,
              {
                // backgroundColor: !isDarkTheme ? '#6a97f7' : '#1e2b47',
                // paddingTop: height * 0.04,
              },
            ]}>
            <StatusBar
              animated
              backgroundColor={'transparent'}
              barStyle={barStyle}
              translucent
            />

            <LinearGradient
              colors={['#ffffff00', '#a7c2fc' + `${isDarkTheme ? '44' : '88'}`]}
              style={[styles.container, {backgroundColor: ThemeColor}]}>
              <ChatScreen
                openDrawer={drawer}
              />
            </LinearGradient>
          </SafeAreaView>
        )}
      </View>
    </DrawerLayoutAndroid>
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
    width: '85%',
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
  noChats: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    padding: 10,
    width: '85%',
    alignItems: 'center',
    flex: 1,
  },
  oldChats: {
    // backgroundColor: '#ffffff55',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    width: '85%',
  },
  chatTitles: {
    fontSize: 16,
    fontWeight: '500',
  },
  profileButton: {
    paddingVertical: 10,
    marginVertical: 10,
    width: '85%',
    marginHorizontal: 10,
    borderRadius: 20,
    paddingHorizontal: 15,
    // position: 'absolute',
    // bottom: 0
  },
});

export default MainContainer;
