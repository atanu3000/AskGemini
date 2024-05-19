import {
  Animated,
  Dimensions,
  DrawerLayoutAndroid,
  Image,
  Modal,
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
import Settings from './Screens/Settings';
import {sc} from './assets/Styles/Dimensions';

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
  const drawerWidth = (width * 0.8) > 800 ? 800 : (width * 0.8);
  const [settingVisible, setSettingVisible] = useState<boolean>(false);

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
    setChatTitle(undefined);
  };

  const NavigationView: React.FC = () => {
    return (
      <View style={{height: '100%', flex: 1, paddingTop: height * 0.04, alignItems: 'center'}}>
        <View style={{width: '100%', alignItems: 'center'}}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.searchBox,
                {backgroundColor: !isDarkTheme ? '#9dbafa' : '#485675',
                width: '95%'},
              ]}>
              <Icon name={'magnifying-glass'} size={16} color={FontColor} />
              <Text style={{color: FontColor, fontSize: 15}}>Search</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={newChat}>
            <View
              style={[
                styles.newChat,
                {backgroundColor: !isDarkTheme ? '#acdcfa' : '#60879e',
                width: '100%'},
              ]}>
              <Image source={modelImage} style={{height: 35, width: 35}} />
              <Text style={{color: FontColor, fontSize: 15}}>AskGemini</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={{flex: 1, width: '100%'}}>
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
            drawer.current?.closeDrawer();
            setSettingVisible(true);
            // navigation.navigate('Settings', {
            //   name: userData?.name,
            //   email: userData?.email,
            // });
          }}
          style={[
            styles.profileButton,
            {backgroundColor: !isDarkTheme ? '#9dbafa' : '#485675',
            width: drawerWidth * 0.95},
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
                  {userData?.email.split('').slice(0, sc(16) > 25 ? 25 : sc(16))}
                  {userData?.email.length! > (sc(16) > 27 ? 27 : sc(16)) && '...'}
                </Text>
              </View>
            </View>
            <Icon name={'ellipsis-vertical'} color={FontColor} size={20} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  // console.log(settingVisible);

  return (
    <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={ drawerWidth }
      drawerPosition={'left'}
      drawerBackgroundColor={!isDarkTheme ? '#6a97f7' : '#1e2b47'}
      renderNavigationView={() => <NavigationView />}>
      <View style={styles.container}>
        {isAppStarted ? (
          <SplashScreen setIsLoading={setIsAppStarted} />
        ) : (
          <SafeAreaView style={[styles.menuContainer]}>
            <StatusBar
              animated
              backgroundColor={'transparent'}
              barStyle={barStyle}
              translucent
            />
            <Modal
              animationType="slide"
              visible={settingVisible}
              onRequestClose={() => setSettingVisible(false)}>
              <Settings
                name={userData?.name}
                email={userData?.email}
                onClose={() => setSettingVisible(false)}
              />
            </Modal>
            {!settingVisible && (
              <LinearGradient
                colors={[
                  '#ffffff00',
                  '#a7c2fc' + `${isDarkTheme ? '44' : '88'}`,
                ]}
                style={[styles.container, {backgroundColor: ThemeColor}]}>
                <ChatScreen openDrawer={drawer} />
              </LinearGradient>
            )}
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
    //marginHorizontal: 10,
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
    marginHorizontal: 10,
    borderRadius: 30,
    paddingLeft: 15,
    paddingRight: 20,
  },
});

export default MainContainer;
