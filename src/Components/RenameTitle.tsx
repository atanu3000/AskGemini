import {
  NativeSyntheticEvent,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TextInputContentSizeChangeEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import useChatContext from '../Context/ChatContext';
import {useTheme} from '../Context/ThemeContext';
import {chatsType} from '../Screens/ChatScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RenameTitleProps {
  isVisible: boolean;
  onClose: () => void;
}

const RenameTitle = ({isVisible, onClose}: RenameTitleProps) => {
  const {chatTitle, setChatTitle, chatId} = useChatContext();
  const [newTitle, setNewTitle] = useState<string>('');

  useEffect(() => {
    setNewTitle(chatTitle!);
  }, [chatTitle]);

  const {theme} = useTheme();
  const colorMode = theme === 'dark' ? '#ddd' : '#555';
  const backgroundColor = theme === 'dark' ? '#000' : '#fff';

  const renameChatTitle = async () => {
    try {
      const existingChat = await AsyncStorage.getItem('AskGemini_ChatHistory');
      const currentChat: chatsType[] = existingChat
        ? JSON.parse(existingChat)
        : [];

      const index = currentChat.findIndex(chat => chat.id === chatId);

      if (index !== -1) currentChat[index].title = newTitle;

      await AsyncStorage.setItem(
        'AskGemini_ChatHistory',
        JSON.stringify(currentChat),
      );
    } catch (error) {
      console.error('Error saving chat history', error);
    } finally {
      setChatTitle(newTitle);
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#00000066'} />
      <View style={[styles.popup, {backgroundColor: backgroundColor}]}>
        <TextInput
          style={{
            height: 90,
            color: colorMode,
            fontSize: 16,
            padding: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colorMode,
          }}
          value={newTitle}
          onChangeText={setNewTitle}
          multiline={true}
          numberOfLines={3}
          textAlignVertical="top"
          autoCorrect={false}
          autoFocus={true}
          selectTextOnFocus={true}
          autoCapitalize="sentences"
          placeholder="Enter new chat title..."
          placeholderTextColor={theme === 'dark' ? '#bbb' : '#888'}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.button, {color: colorMode}]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={renameChatTitle}>
            <Text style={[styles.button, {color: colorMode}]}>Rename</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RenameTitle;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: 100,
    height: '100%',
    width: '100%',
    backgroundColor: '#00000066',
  },
  popup: {
    position: 'absolute',
    justifyContent: 'space-between',
    alignSelf: 'center',
    bottom: '40%',
    height: 170,
    width: '80%',
    maxWidth: 460,
    elevation: 100,
    shadowOffset: {
      width: 1,
      height: 1,
    },

    padding: 15,
    borderRadius: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
    alignSelf: 'flex-end',
  },
  button: {
    fontSize: 15,
    fontWeight: '500',
  },
});
