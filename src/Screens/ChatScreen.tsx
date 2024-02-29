import {
  Dimensions,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useColorScheme,
} from 'react-native';
import React from 'react';
import InputBar from '../Components/InputBar';
import Icon from 'react-native-vector-icons/FontAwesome6';

//generative AI impports
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  InputContent,
} from '@google/generative-ai';
import {Google_API_KEY} from '../../API';
import ChatContainer from '../Components/ChatContainer';

const ChatScreen: React.FC = () => {
  const [textInput, setTextInput] = React.useState<string>('');
  const [chatHistory, setChatHistory] = React.useState<InputContent[]>([]);
  const colorMode = useColorScheme() === 'dark' ? '#fff' : '#000';
  const scrollViewRef = React.useRef<FlatList<any>>(null);
  const [showGoToBottomButton, setShowGoToBottomButton] =
    React.useState<boolean>(false);

  const handleScroll = (event: {
    nativeEvent: {
      contentOffset: {y: number};
      layoutMeasurement: {height: number};
      contentSize: {height: number};
    };
  }) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    const screenHeight = event.nativeEvent.layoutMeasurement.height;
    const contentHeight = event.nativeEvent.contentSize.height;

    const threshold = 150;
    const isCloseToBottom =
      contentHeight - screenHeight - scrollPosition < threshold;

    setShowGoToBottomButton(!isCloseToBottom);
  };

  const handleGoToBottom = () => {
    scrollViewRef.current?.scrollToEnd({animated: true});
  };

  const updateChatHistory = (role: string, content: string) => {
    setChatHistory(prevHistory => [
      ...prevHistory,
      {
        role: role,
        parts: [content],
      },
    ]);
  };

  async function runChat() {
    updateChatHistory('user', textInput);
    try {
      const genAI = new GoogleGenerativeAI(Google_API_KEY);
      const model = genAI.getGenerativeModel({model: 'gemini-pro'});

      const generationConfig = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      };

      const safetySettings = [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ];

      const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: chatHistory,
      });

      const result = await chat.sendMessage(textInput!);
      const response = result.response;
      updateChatHistory('model', response.text());
    } catch (error) {
      console.log(error);
      updateChatHistory('model', 'Something went wrong. Please try again');
    }
  }

  return (
    <KeyboardAvoidingView behavior={'height'} style={{height: '100%'}}>
      <View style={styles.headContainer}>
        <TouchableWithoutFeedback>
          <Icon name={'bars'} color={colorMode} size={20} />
        </TouchableWithoutFeedback>
        <Text style={[styles.heading, {color: colorMode}]}>AskGemini 1.0</Text>
        <TouchableWithoutFeedback>
          <Icon name={'ellipsis-vertical'} color={colorMode} size={20} />
        </TouchableWithoutFeedback>
      </View>
      <ChatContainer
        chat={chatHistory}
        scrollRef={scrollViewRef}
        handleScroll={handleScroll}
      />
      <View style={{flex: 1}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inputBarContainer}>
            {showGoToBottomButton && (
              <TouchableOpacity
                style={styles.goToBottomButton}
                onPress={handleGoToBottom}>
                <Icon name="angles-down" color={'#222'} size={16} />
              </TouchableOpacity>
            )}
            <InputBar setText={setTextInput} runChat={runChat} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: '500',
  },
  headContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingVertical: 10,
    alignItems: 'center',
  },
  inputBarContainer: {
    position: 'absolute',
    bottom: 8,
    gap: 10,
    width: '100%',
    alignSelf: 'center',
  },
  goToBottomButton: {
    alignSelf: 'center',
    backgroundColor: '#91b2fa',
    padding: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
  },
});
