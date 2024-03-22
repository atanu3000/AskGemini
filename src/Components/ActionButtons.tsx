import {
  ColorValue,
  Linking,
  Share,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Clipboard from '@react-native-clipboard/clipboard';
import Tts from 'react-native-tts';

interface ActionButtonsProps {
  text: string;
  colorMode: ColorValue;
  role: string;
}

const ActionButtons = ({text, colorMode, role}: ActionButtonsProps) => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isDisliked, setIsDisliked] = useState<boolean>(false);

  const handleCopy = (text: string) => {
    Clipboard.setString(text);
    ToastAndroid.show('Copied to clipboard', ToastAndroid.SHORT);
  };

  const handleShare = (text: string) => {
    Share.share({message: text}, {dialogTitle: 'Share from AskGemini'});
  };

  useEffect(() => {
    if (isLiked) {
      setIsDisliked(false);
    } else {
      setIsLiked(false);
    }
  }, [isLiked, isDisliked]);

  const speak = async (text: string) => {
    try {
      if (isSpeaking) {
        await Tts.stop();
      } else {
        await Tts.getInitStatus();
        Tts.speak(text);
      }
      setIsSpeaking(!isSpeaking);
    } catch (error) {
      Tts.requestInstallEngine();
      console.error('Error occurred:', error);
    }
  };

  useEffect(() => {
    const ttsFinishListener = () => {
      setIsSpeaking(false);
    };

    Tts.addEventListener('tts-finish', ttsFinishListener);
  }, []);
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 3,
        paddingBottom: 10,
        paddingLeft: 37,
      }}>
      <TouchableOpacity onPress={() => handleCopy(text.replace(/\*\*/g, '*'))}>
        <Icon
          name={'clipboard'}
          size={16}
          color={colorMode}
          style={[styles.actionButtons, {borderColor: colorMode}]}
        />
      </TouchableOpacity>
      {role === 'You' ? (
        <>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                'https://www.google.com/search?q=' + text.replace(/ /g, '+'),
              )
            }>
            <Icon
              name={'google'}
              size={16}
              color={colorMode}
              style={[styles.actionButtons, {borderColor: colorMode}]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                'https://www.bing.com/search?q=' + text.replace(/ /g, '+'),
              )
            }>
            <Icon
              name={'edge'}
              size={16}
              color={colorMode}
              style={[styles.actionButtons, {borderColor: colorMode}]}
            />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity onPress={() => setIsLiked(!isLiked)}>
            <Icon
              name={'thumbs-up'}
              solid={isLiked}
              size={19}
              color={colorMode}
              style={[
                styles.actionButtons,
                {borderColor: colorMode, padding: 5},
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsDisliked(!isDisliked)}>
            <Icon
              name={'thumbs-down'}
              solid={isDisliked}
              size={19}
              color={colorMode}
              style={[
                styles.actionButtons,
                {borderColor: colorMode, padding: 5},
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleShare(text.replace(/\*\*/g, '*'))}>
            <Icon
              name={'share-from-square'}
              size={16}
              color={colorMode}
              style={[styles.actionButtons, {borderColor: colorMode}]}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => speak(text.replace(/\*/g, ' '))}>
            <Icon
              name={isSpeaking ? 'pause' : 'volume-low'}
              size={16}
              color={colorMode}
              style={[styles.actionButtons, {borderColor: colorMode}]}
            />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default ActionButtons;

const styles = StyleSheet.create({
  actionButtons: {
    borderWidth: 1,
    padding: 7,
    borderRadius: 5,
  },
});
