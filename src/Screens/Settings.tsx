import {
  Linking,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {useTheme} from '../Context/ThemeContext';
import {useAppwrite} from '../appwrite/AppwriteContext';
import ThemeDialog from '../Components/ThemeDialog';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from '../routes/AppStack';
import {sc} from '../assets/Styles/Dimensions';
import ConversationDialog from '../Components/ConversationDialog';
import ChatControlDialog from '../Components/ChatControlDialog';

interface settingsScreenProps {
  name?: string;
  email?: string;
  onClose: () => void;
}

const Settings = ({name, email, onClose}: settingsScreenProps) => {
  // const {name, email} = route.params;
  const {appwrite, setIsLogedin} = useAppwrite();
  const {theme, mode} = useTheme();
  const Background = theme === 'dark' ? '#222' : '#fff';
  const FontColor = theme === 'dark' ? '#ddd' : '#444';
  const barStyle = theme === 'dark' ? 'light-content' : 'dark-content';
  const [themeDialogVisible, setThemeDialogVisible] = useState(false);
  const [conversationDialogVisible, setConversationDialogVisible] = useState(false);
  const [chatControlDialogVisible, setChatControlDialogVisible] = useState(false);

  const capitalizeFirstLetter = (str: string) => {
    return '(' + str.charAt(0).toUpperCase() + str.slice(1) + ')';
  };

  const handleLogout = () => {
    appwrite.LogoutUser().then(() => {
      setIsLogedin(false);
      ToastAndroid.show('Good bye ' + name?.split(' ')[0], ToastAndroid.SHORT);
    });
  };

  const toggleThemeDialog = () => {
    setThemeDialogVisible(prevState => !prevState);
  };
  
  const toggleConversationDialog = () => {
    setConversationDialogVisible(prevState => !prevState);
  };

  const toggleChatControlDialog = () => {
    setChatControlDialogVisible(prevState => !prevState);
  };

  const notFound = () => {
    ToastAndroid.show('Not Found', ToastAndroid.SHORT);
  }

  return (
    <>
      <StatusBar backgroundColor={Background} barStyle={barStyle} animated/>
      <Modal
        animationType='fade'
        visible={themeDialogVisible}
        onRequestClose={toggleThemeDialog}>
          <ThemeDialog visible={themeDialogVisible} onClose={toggleThemeDialog} />
      </Modal>
      <ConversationDialog visible={conversationDialogVisible} onClose={toggleConversationDialog}/>
      <ChatControlDialog visible={chatControlDialogVisible} onClose={toggleChatControlDialog}/>
      <ScrollView
        style={[styles.container, {backgroundColor: Background}]}
        showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={onClose}>
          <Icon style={{paddingTop: 20}} name={'arrow-left'} size={26} color={FontColor}/>
        </TouchableOpacity>
        <Text style={[styles.settings, {color: FontColor}]}>Settings</Text>
        <View style={styles.userContainer}>
          <Icon name={'circle-user'} solid size={32} color={FontColor} />
          <View>
            <Text style={[styles.name, {color: FontColor}]}>{name}</Text>
          </View>
        </View>
        <Text style={{color: FontColor, fontWeight: '500', marginBottom: 10, fontSize: sc(13) > 19 ? 19 : sc(13)}}>
          Accounts
        </Text>
        <View>
          <View style={styles.options}>
            <Icon name={'envelope'} size={18} color={FontColor} />
            <Text style={{color: FontColor, fontSize: sc(14.5) > 22 ? 22 : sc(14.5)}}>{email}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={toggleConversationDialog}>
          <View style={styles.options}>
            <Icon name={'message'} size={18} color={FontColor} />
            <Text style={{color: FontColor, fontSize: sc(14.5) > 22 ? 22 : sc(14.5)}}>
              Conversation Style
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleChatControlDialog}>
          <View style={styles.options}>
            <Icon name={'database'} size={18} color={FontColor} />
            <Text style={{color: FontColor, fontSize: sc(14.5) > 22 ? 22 : sc(14.5)}}>Chat Controls</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleThemeDialog}>
          <View style={styles.options}>
            <Icon name={'palette'} size={18} color={FontColor} />
            <Text style={{color: FontColor, fontSize: sc(14.5) > 22 ? 22 : sc(14.5)}}>Theme</Text>
            <Text style={{color: FontColor, paddingLeft: 0}}>
              {capitalizeFirstLetter(mode)}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openSettings()}>
          <View style={styles.options}>
            <Icon name={'lock'} size={18} color={FontColor} />
            <Text style={{color: FontColor, fontSize: sc(14.5) > 22 ? 22 : sc(14.5)}}>Permissions</Text>
          </View>
        </TouchableOpacity>
        <Text style={{color: FontColor, fontWeight: '500', marginVertical: 10, fontSize: sc(13) > 19 ? 19 : sc(13)}}>
          About
        </Text>
        <TouchableOpacity onPress={notFound}>
          <View style={styles.options}>
            <Icon name={'hand-holding-hand'} size={18} color={FontColor} />
            <Text style={{color: FontColor, fontSize: sc(14.5) > 22 ? 22 : sc(14.5)}}>Helps Center</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={notFound}>
          <View style={styles.options}>
            <Icon name={'file-lines'} size={18} color={FontColor} />
            <Text style={{color: FontColor, fontSize: sc(14.5) > 22 ? 22 : sc(14.5)}}>Terms of Use</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={notFound}>
          <View style={styles.options}>
            <Icon name={'user-lock'} size={18} color={FontColor} />
            <Text style={{color: FontColor, fontSize: sc(14.5) > 22 ? 22 : sc(14.5)}}>Privacy Policy</Text>
          </View>
        </TouchableOpacity>
        <View>
          <View style={styles.options}>
            <Icon name={'android'} size={18} color={FontColor} />
            <Text style={{color: FontColor, fontSize: sc(14.5) > 22 ? 22 : sc(14.5)}}>
              AskGemini for Andriod
            </Text>
            <Text style={{color: FontColor}}>1.0.0</Text>
          </View>
        </View>
        <TouchableOpacity style={{paddingBottom: 100}} onPress={handleLogout}>
          <View style={styles.options}>
            <Icon name={'right-from-bracket'} size={18} color={'red'} />
            <Text style={{color: 'red', fontSize: sc(14.5) > 22 ? 22 : sc(14.5)}}>Sign out</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 35,
  },
  userContainer: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
    marginVertical: 30,
  },
  options: {
    flexDirection: 'row',
    gap: 13,
    alignItems: 'center',
    marginVertical: 17,
  },
  settings: {
    paddingTop: 10,
    fontSize: sc(27) > 46 ? 46 : sc(27),
    fontWeight: "300",
  },
  name: {
    fontSize: sc(16) > 25 ? 25 : sc(16),
    fontWeight: '500',
  },
});
