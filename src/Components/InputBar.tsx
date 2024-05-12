import {
  Image,
  Keyboard,
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputContentSizeChangeEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {RefObject, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {useTheme} from '../Context/ThemeContext';
import useChatContext from '../Context/ChatContext';
import {Image as ImageType} from 'react-native-image-crop-picker';
import {sc, vc} from '../assets/Styles/Dimensions';

interface InputBarProps {
  textInputRef: RefObject<TextInput>;
  setText: (value: string) => void;
  setDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
  image: ImageType | undefined;
  cancelImage: React.Dispatch<React.SetStateAction<ImageType | undefined>>;
  runChat: () => void;
  genImgResponse: () => void;
}

const InputBar: React.FC<InputBarProps> = ({
  textInputRef,
  setText,
  setDialogVisible,
  image,
  cancelImage,
  runChat,
  genImgResponse,
}) => {
  const [textInput, setTextInput] = useState<string>('');
  const [keyboardEnabled, setKeyboardEnabled] = useState(true);
  const [inputHeight, setInputHeight] = useState(50);
  const {theme} = useTheme();
  const colorMode = theme === 'dark' ? '#fff' : '#000';
  const Themecolor = theme === 'dark' ? '#383838' : '#ffffff';

  useEffect(() => {
    if (keyboardEnabled) {
      textInputRef.current?.focus();
    } else {
      textInputRef.current?.blur();
    }
  }, [keyboardEnabled]);

  const handleContentSizeChange = (
    event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>,
  ) => {
    setInputHeight(event.nativeEvent.contentSize.height);
  };

  const inputHandler = (value: string) => {
    setTextInput(value);
    setText(value);
  };

  const {isLoading, setMenuContainerVisible} = useChatContext();
  const isTextEnter = textInput.trim().length !== 0;
  const iconSize = sc(18) > 26 ? 26 : sc(18);
  // console.log(iconSize);
  
  return (
    <View
      style={[
        styles.container,
        {overflow: 'hidden', backgroundColor: Themecolor},
      ]}>
      {image && (
        <View style={{width: 70}}>
          <TouchableOpacity
            onPress={() => cancelImage(undefined)}
            style={[
              styles.cancelImage,
              {backgroundColor: Themecolor + 'bb'},
            ]}>
            <Icon name={'xmark'} size={15} color={colorMode} />
          </TouchableOpacity>
          <Image
            source={{uri: image.path}}
            style={{height: 70, width: 70, marginTop: 8, borderRadius: 15}}
          />
        </View>
      )}
      <View
        style={[styles.textInputContainer, {backgroundColor: Themecolor}]}>
        <TextInput
          ref={textInputRef}
          value={textInput}
          onChangeText={text => inputHandler(text)}
          style={{
            color: colorMode,
            height: Math.min(170, inputHeight),
            fontSize: sc(14) > 20 ? 20 : sc(14),
            flex: 1,
          }}
          multiline={true}
          numberOfLines={6}
          textAlignVertical="top"
          onContentSizeChange={handleContentSizeChange}
          autoCorrect={false}
          autoCapitalize="sentences"
          placeholder="Ask me anything..."
          placeholderTextColor={theme === 'dark' ? '#bbb' : '#888'}
        />
        {isLoading ? (
          <Icon
            name={'circle-stop'}
            size={iconSize}
            color={colorMode}
            style={{paddingRight: 10}}
          />
        ) : (
          <View style={{flexDirection: 'row'}}>
            {!isTextEnter && (
              <>
                <TouchableOpacity
                  onPress={() => {setDialogVisible(prevState => !prevState); setMenuContainerVisible(false)}}
                  style={{paddingHorizontal: sc(6) > 11 ? 11 : sc(6)}}>
                  <Icon name={'image'} size={iconSize} color={colorMode} />
                </TouchableOpacity>
                <TouchableOpacity style={{paddingHorizontal: sc(6) > 11 ? 11 : sc(6)}}>
                  <Icon name={'paperclip'} size={iconSize} color={colorMode} />
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity
              disabled={!isTextEnter}
              onPress={() => {
                if (image) {
                  cancelImage(undefined);
                  genImgResponse();
                } else {
                  runChat();
                }
                setMenuContainerVisible(false);
                setTextInput('');
                setInputHeight(50);
              }}
              style={{paddingHorizontal: sc(6) > 11 ? 11 : sc(6)}}>
              <Icon
                solid={isTextEnter}
                name={'paper-plane'}
                size={iconSize}
                color={isTextEnter ? colorMode : '#999'}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default InputBar;

const styles = StyleSheet.create({
  container: {
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: sc(3) >= 6 ? sc(3) : 3,
    borderWidth: 1,
    borderColor: '#a7c2fc',
  },
  cancelImage: {
    position: 'absolute',
    top: 12,
    right: 5,
    zIndex: 100,
    width: 25,
    alignItems: 'center',
    padding: 5,
    borderRadius: 20,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
