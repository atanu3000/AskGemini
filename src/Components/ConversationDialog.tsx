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

interface ConversationDialogProps {
  visible: boolean;
  onClose: () => void;
}

const ConversationDialog: React.FC<ConversationDialogProps> = ({visible, onClose}) => {
  const {theme} = useTheme();
  const {conversationType, setConversationType} = useChatContext();
  const backgroundColor = theme === 'dark' ? '#000' : '#fff';
  const fontColor = theme === 'dark' ? '#fff' : '#000';

  const handleConversationStyle = (conversationType: string) => {
    setConversationType(conversationType)
    saveConversationType(conversationType)
    onClose();
  }

  const saveConversationType = async (conversationType: string) => {
    await AsyncStorage.setItem('askGemini_conversation_type', conversationType);
  };

  if (!visible) return null;

  return (
    <>
      <StatusBar backgroundColor={theme === 'dark' ? '#111' :'#00000060'} animated/>
      <View style={styles.container}>
        <View style={[styles.popup, {backgroundColor: backgroundColor}]}>
          <Text style={{fontSize: sc(16) > 26 ? 26 : sc(16), marginBottom: 10, color: fontColor}}>
          Choose a conversation style
          </Text>
          <RadioButton.Group onValueChange={handleConversationStyle} value={conversationType}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5,marginVertical: sc(4) > 13 ? 13 : sc(4)}}>
              <RadioButton.Android value="creative" />
              <TouchableOpacity onPress={() => handleConversationStyle('creative')}>
                <Text style={{color: fontColor, fontSize: sc(13) > 22 ? 22 : sc(13)}}>More Creative</Text>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5,marginVertical: sc(4) > 13 ? 13 : sc(4)}}>
              <RadioButton.Android value="balanced" />
              <TouchableOpacity onPress={() => handleConversationStyle('balanced')}>
                <Text style={{color: fontColor, fontSize: sc(13) > 22 ? 22 : sc(13)}}>More Balanced</Text>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5,marginVertical: sc(4) > 13 ? 13 : sc(4)}}>
              <RadioButton.Android value="precise" />
              <TouchableOpacity onPress={() => handleConversationStyle('precise')}>
                <Text style={{color: fontColor, fontSize: sc(13) > 22 ? 22 : sc(13)}}>More Precise</Text>
              </TouchableOpacity>
            </View>
          </RadioButton.Group>
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
  popupText: {
    fontSize: 16,
    marginBottom: 10,
  },
  option: {
    fontSize: 14,
    marginBottom: 5,
  },
});

export default ConversationDialog;
