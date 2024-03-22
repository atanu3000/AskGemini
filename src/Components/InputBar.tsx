import {
  Keyboard,
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputContentSizeChangeEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {RefObject} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {useTheme} from '../Context/ThemeContext';
import useChatContext from '../Context/ChatContext';

interface InputBarProps {
  setText: (value: string) => void;
  runChat: () => void;
}

const InputBar: React.FC<InputBarProps> = ({setText, runChat}) => {
  const [textInput, setTextInput] = React.useState<string>('');
  const [marginBottom, setMarginBottom] = React.useState<number>(0);
  const [keyboardEnabled, setKeyboardEnabled] = React.useState(true);
  const [inputHeight, setInputHeight] = React.useState(50);
  const {theme} = useTheme();
  const colorMode = theme === 'dark' ? '#fff' : '#000';
  const Themecolor = theme === 'dark' && {
    backgroundColor: '#383838',
  };

  React.useEffect(() => {
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

  const toggleKeyboard = () => {
    if (keyboardEnabled) {
      textInputRef.current?.blur();
    } else {
      textInputRef.current?.focus();
    }
    setKeyboardEnabled(!keyboardEnabled);
    setKeyboardEnabled(!keyboardEnabled);
  };

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

  return (
    <View style={[styles.textInputContainer, {marginBottom}, Themecolor]}>
      <TextInput
        ref={textInputRef}
        value={textInput}
        onChangeText={text => inputHandler(text)}
        style={{
          color: colorMode,
          height: Math.min(160, inputHeight),
          fontSize: 16,
          width: '85%',
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
      ) : textInput.trim().length === 0 ? (
        <TouchableOpacity
          onPress={toggleKeyboard}
          style={{padding: 10}}>
          <Icon
            name={'keyboard'}
            size={20}
            color={colorMode}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            runChat();
            setTextInput('');
            setInputHeight(50);
          }}
          style={{padding: 10}}>
          <Icon
            name={'paper-plane'}
            size={20}
            color={colorMode}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default InputBar;

const styles = StyleSheet.create({
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#a7c2fc',
  },
});
