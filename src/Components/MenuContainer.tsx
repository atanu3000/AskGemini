import {StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View} from 'react-native';
import React, {RefObject, useEffect, useState} from 'react';
import useChatContext from '../Context/ChatContext';
import {useTheme} from '../Context/ThemeContext';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {getChats} from '../MainContainer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { chatsType } from '../Screens/ChatScreen';

interface MainContainerProps {
  isVisible: boolean;
  openRenameTitle: () => void;
  onClose: () => void;
}

const MenuContainer = ({isVisible, onClose, openRenameTitle}: MainContainerProps) => {
  const {
    isChatStarted,
    setIsChatStarted,
    setChatTitle,
    chatId,
    setChatId,
    setChatHistory,
  } = useChatContext();
  
  const {theme} = useTheme();
  const colorMode = theme === 'dark' ? '#ddd' : '#555';
  const backgroundColor = theme === 'dark' ? '#000' : '#fff';

  const shareChat = () => {}

  const deleteChat = async () => {
    try {
      const existingChats = await AsyncStorage.getItem('AskGemini_ChatHistory');

      const currentChat: chatsType[] = existingChats ? JSON.parse(existingChats) : [];
      // console.log(currentChat);
      

      const indexToDelete = currentChat.findIndex(chat => chat.id === chatId);
      // console.log(indexToDelete);
      
      if (indexToDelete !== -1) {
        currentChat.splice(indexToDelete!, 1);
        // console.log(currentChat);
        
        await AsyncStorage.setItem(
          'AskGemini_ChatHistory',
          JSON.stringify(currentChat),
        );
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setChatHistory([]);
      setIsChatStarted(false);
      setChatTitle(undefined);
      setChatId('');
      ToastAndroid.show('Chat is deleted', ToastAndroid.SHORT)
      onClose();
    }
  }

  if (!isVisible) return null;

  return (
    <View style={[styles.popup, {backgroundColor: backgroundColor}]}>
      <TouchableOpacity>
        <View style={styles.buttons}>
          <Icon name={'circle-info'} size={20} color={colorMode} />
          <Text style={{color: colorMode, fontSize: 15}}>View Details</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity>
        <View style={styles.buttons}>
          <Icon name={'file-lines'} size={20} color={colorMode} />
          <Text style={{color: colorMode, fontSize: 15}}>
            Terms and Conditions
          </Text>
        </View>
      </TouchableOpacity>
      {isChatStarted && (
        <>
          <TouchableOpacity>
            <View style={styles.buttons}>
              <Icon name={'share-from-square'} size={20} color={colorMode} />
              <Text style={{color: colorMode, fontSize: 15}}>Share</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => {
              openRenameTitle();
              onClose();
            }}>
            <View style={styles.buttons}>
              <Icon name={'pen'} size={20} color={colorMode} />
              <Text style={{color: colorMode, fontSize: 15}}>Rename</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={deleteChat}>
            <View style={styles.buttons}>
              <Icon name={'trash-can'} size={20} color={colorMode} />
              <Text style={{color: colorMode, fontSize: 15}}>Delete</Text>
            </View>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default MenuContainer;

const styles = StyleSheet.create({
  popup: {
    position: 'absolute',
    zIndex: 1000,
    alignSelf: 'flex-end',
    top: 50,
    right: 5,
    elevation: 100,
    shadowOffset: {
      width: 1,
      height: 1,
    },

    padding: 25,
    borderRadius: 15,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingVertical: 10,
  },
});
