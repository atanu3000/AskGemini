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

interface InputBarProps {
  setText: (value: string) => void;
  setDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
  image: ImageType | undefined;
  cancelImage: React.Dispatch<React.SetStateAction<ImageType | undefined>>;
  runChat: () => void;
  genImgResponse: () => void;
}

const InputBar: React.FC<InputBarProps> = ({
  setText,
  setDialogVisible,
  image,
  cancelImage,
  runChat,
  genImgResponse,
}) => {
  const [textInput, setTextInput] = useState<string>('');
  const [marginBottom, setMarginBottom] = useState<number>(0);
  const [keyboardEnabled, setKeyboardEnabled] = useState(true);
  const [inputHeight, setInputHeight] = useState(50);
  const {theme} = useTheme();
  const colorMode = theme === 'dark' ? '#fff' : '#000';
  const Themecolor = theme === 'dark' ? '#383838' : '#ffffff';

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setMarginBottom(38);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setMarginBottom(0);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const textInputRef: RefObject<TextInput> = React.useRef<TextInput>(null);

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

  const {isLoading} = useChatContext();
  const isTextEnter = textInput.trim().length !== 0;

  return (
    <>
      <View
        style={[
          styles.container,
          {overflow: 'hidden', marginBottom, backgroundColor: Themecolor},
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
              height: Math.min(160, inputHeight),
              fontSize: 16,
              width: '79%',
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
              size={20}
              color={colorMode}
              style={{paddingRight: 10}}
            />
          ) : (
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => setDialogVisible(prevState => !prevState)}
                style={{padding: 8}}>
                <Icon name={'image'} size={20} color={colorMode} />
              </TouchableOpacity>
              <TouchableOpacity
                disabled={!isTextEnter}
                onPress={() => {
                  if (image) {
                    cancelImage(undefined);
                    genImgResponse();
                  } else {
                    runChat();
                  }
                  setTextInput('');
                  setInputHeight(50);
                }}
                style={{padding: 8}}>
                <Icon
                  solid={isTextEnter}
                  name={'paper-plane'}
                  size={20}
                  color={isTextEnter ? colorMode : '#999'}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </>
  );
};

export default InputBar;

const styles = StyleSheet.create({
  container: {
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 3,
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
