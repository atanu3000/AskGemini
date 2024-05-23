import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {useTheme} from '../Context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {sc} from '../assets/Styles/Dimensions';
import useChatContext from '../Context/ChatContext';

interface ChatControlDialogProps {
  visible: boolean;
  onClose: () => void;
}

const ChatControlDialog: React.FC<ChatControlDialogProps> = ({visible, onClose}) => {
  const {theme} = useTheme();
  const backgroundColor = theme === 'dark' ? '#000' : '#fff';
  const fontColor = theme === 'dark' ? '#fff' : '#000';
    
  const removeValue = async () => {
    try {
      await AsyncStorage.removeItem('AskGemini_ChatHistory');
    } catch (e) {}
    console.log('All chats are removed');
    onClose();
  };

  if (!visible) return null;

  return (
    <>
        <StatusBar backgroundColor={theme === 'dark' ? '#111' :'#00000060'} animated/>
        <View style={styles.container}>
        <View style={[styles.popup, {backgroundColor: backgroundColor}]}>
            <Text style={{fontSize: sc(16) > 26 ? 26 : sc(16), marginBottom: 10, color: '#888'}}>
            Do you want to clear all your chats from history? This cannot be undone.
            </Text>
            <View style={styles.buttonContianer}>
                <TouchableOpacity onPress={onClose}>
                    <Text style={{color: fontColor, fontSize: sc(13) > 22 ? 22 : sc(13), fontWeight: '500'}}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={removeValue}>
                    <Text style={{color: 'red', fontSize: sc(13) > 22 ? 22 : sc(13), fontWeight: '500'}}>Clear chats</Text>
                </TouchableOpacity>
            </View>
        </View>
        </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1000,
    height: '100%',
    width: '100%',
    backgroundColor: '#00000066',
  },
  popup: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: '40%',
    // height: sc(200) > 280 ? 280 : sc(200),
    width: '75%',
    elevation: 40,
    shadowOffset: {
      width: 1,
      height: 1,
    },

    padding: 25,
    borderRadius: 15,
  },
  buttonContianer: {
    flexDirection: 'row', gap: 20, alignSelf: 'flex-end', marginTop: 20
  }

});

export default ChatControlDialog;
