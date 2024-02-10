import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  useColorScheme,
} from 'react-native';
import React from 'react';
import InputBar from '../Components/InputBar';
import Icon from 'react-native-vector-icons/FontAwesome6';

const {height, width} = Dimensions.get('window');

const ChatScreen: React.FC = () => {
  const colorMode = useColorScheme() === 'dark' ? '#fff' : '#000';
  return (
    <KeyboardAvoidingView behavior={'height'} style={styles.container}>
      <View style={styles.headContainer}>
        <TouchableWithoutFeedback>
          <Icon name={'bars'} color={colorMode} size={20} />
        </TouchableWithoutFeedback>
        <Text style={[styles.heading, {color: colorMode}]}>AskGemini 1.0</Text>
        <TouchableWithoutFeedback>
          <Icon name={'ellipsis-vertical'} color={colorMode} size={20} />
        </TouchableWithoutFeedback>
      </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inputBarContainer}>
          <InputBar />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
    flex: 1,
    paddingHorizontal: 15,
  },
  heading: {
    fontSize: 18,
    fontWeight: '500',
  },
  headContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingTop: 10,
    alignItems: 'center',
  },
  inputBarContainer: {
    position: 'absolute',
    bottom: 8,
    width: width * 0.95,
    alignSelf: 'center',
  },
});
