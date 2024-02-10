import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import React from 'react';

const InputBar = () => {
  const [textInput, setTextInput] = React.useState<string>('');
  const [marginBottom, setMarginBottom] = React.useState<number>(0);
  const Themecolor = useColorScheme() === 'dark' && {
    backgroundColor: '#66666666',
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

  return (
    <View style={[styles.textInputContainer, {marginBottom}, Themecolor]}>
      <TextInput
        value={textInput}
        onChangeText={setTextInput}
        style={[useColorScheme() === 'dark' ? {color: '#fff'} : {color: '#000'}, {fontSize: 16}]}
        autoCorrect={false}
        autoCapitalize='sentences'
        placeholder="Ask me anything..."
        placeholderTextColor={useColorScheme() === 'dark' ? '#bbb' : '#888'}
      />
    </View>
  );
};

export default InputBar;

const styles = StyleSheet.create({
  textInputContainer: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#aaa',
  },
});
