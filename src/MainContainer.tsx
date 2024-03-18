import {
  Animated,
  Button,
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
import React from 'react';
import ChatScreen from './Screens/ChatScreen';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome6';
import useChatContext from './Context/ChatContext';
import ThemeDialog from './Components/ThemeDialog';
import {useTheme} from './Context/ThemeContext';

const MainContainer = () => {
  const {theme, mode} = useTheme();
  const isDarkTheme = theme === 'dark' ? true : false;
  const ThemeColor = !isDarkTheme ? '#fff' : '#212121';
  const FontColor = !isDarkTheme ? '#212121' : '#fff';
  const barStyle = !isDarkTheme ? 'dark-content' : 'light-content';
  const {width} = Dimensions.get('window');  

  const offsetValue = React.useRef(new Animated.Value(0)).current;
  const modelImage = require('../android/app/src/main/res/mipmap-hdpi/ic_launcher.png');
  const {setIsChatStarted, showMenu, setShowMenu} = useChatContext();

  const [dialogVisible, setDialogVisible] = React.useState(false);
  const toggleDialog = () => {
    setDialogVisible(prevState => !prevState);
  };
  
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <SafeAreaView
      style={[
        styles.menuContainer,
        {backgroundColor: !isDarkTheme ? '#6a97f7' : '#1e2b47'},
      ]}>
      <StatusBar backgroundColor={ThemeColor} barStyle={barStyle} />
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
              setIsChatStarted(false);
              setShowMenu(false);
              Animated.timing(offsetValue, {
                toValue: showMenu ? 0 : width*0.8,
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
              <Text style={{color: FontColor, fontSize: 15}}>AskGemini</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <TouchableOpacity
          onPress={toggleDialog}
          style={[
            styles.themeButton,
            {backgroundColor: !isDarkTheme ? '#9dbafa' : '#485675'},
          ]}>
          <View>
            <View style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
              <Icon
                name={'circle-half-stroke'}
                color={FontColor}
                size={20}
                style={{paddingTop: 5}}
              />
              <Text style={{color: FontColor, fontSize: 14}}>Theme</Text>
            </View>
            <Text style={{color: FontColor, paddingLeft: 35}}>
              {capitalizeFirstLetter(mode)}
            </Text>
          </View>
        </TouchableOpacity>
        <ThemeDialog visible={dialogVisible} onClose={toggleDialog} />
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
          colors={['#ffffff00', '#a7c2fc77']}
          style={[styles.container, {backgroundColor: ThemeColor}]}>
          <ChatScreen offsetValue={offsetValue} />
        </LinearGradient>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    height: '100%',
    width: '100%',
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
    paddingHorizontal: 10,
  },
  themeButton: {
    paddingVertical: 10,
    marginVertical: 10,
    width: '75%',
    marginHorizontal: 10,
    borderRadius: 20,
    paddingLeft: 25,
  },
});

export default MainContainer;
