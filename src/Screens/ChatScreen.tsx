import {
  Animated,
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
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
import useChatContext from '../Context/ChatContext';
import suggestions from '../assets/suggestions';

interface AnimationProps {
  offsetValue: Animated.Value;
  scaleValue?: Animated.Value;
  closeButtonOffset?: Animated.Value;
}

const ChatScreen: React.FC<AnimationProps> = ({offsetValue}) => {
  const [textInput, setTextInput] = React.useState<string>('');
  const [chatHistory, setChatHistory] = React.useState<InputContent[]>([]);
  const colorMode = useColorScheme() === 'dark' ? '#fff' : '#000';
  const isDarkTheme = useColorScheme() === 'dark' ? true : false;
  const scrollViewRef = React.useRef<FlatList<any>>(null);
  const [showGoToBottomButton, setShowGoToBottomButton] =
    React.useState<boolean>(false);
  // const [showMenu, setShowMenu] = React.useState<boolean>(false);
  const [title, setTitle] = React.useState<string>();
  const {isChatStarted, setIsChatStarted, showMenu, setShowMenu} =
    useChatContext();

  React.useEffect(() => {
    const chatCleared = () => {
      if (!isChatStarted) {
        setChatHistory([]);
      }
    };

    chatCleared();
  }, [isChatStarted]);

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

  async function generateTitle() {
    try {
      const genAI = new GoogleGenerativeAI(Google_API_KEY);
      const model = genAI.getGenerativeModel({model: 'gemini-pro'});
      const query = '';
      const result = await model.generateContent(query);
      const response = result.response;
    } catch (error) {}
  }

  async function runChat() {
    updateChatHistory('user', textInput);
    setIsChatStarted(true);
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
  const modelImage = require('../../android/app/src/main/res/mipmap-hdpi/ic_launcher.png');
  const gradientColors = '#124076';
  return (
    <KeyboardAvoidingView behavior={'height'} style={{height: '100%'}}>
      <View style={styles.headContainer}>
        {
          // Head container
        }
        <TouchableOpacity
          onPress={() => {
            Animated.timing(offsetValue, {
              toValue: showMenu ? 0 : 315,
              duration: 300,
              useNativeDriver: true,
            }).start();
            setShowMenu(!showMenu);
          }}
          style={{paddingHorizontal: 0}}>
          {showMenu ? (
            <Icon name={'xmark'} color={colorMode} size={22} />
          ) : (
            <Icon name={'bars'} color={colorMode} size={20} />
          )}
        </TouchableOpacity>
        <Text style={[styles.heading, {color: colorMode}]}>{title}</Text>
        <TouchableOpacity>
          <Icon name={'ellipsis-vertical'} color={colorMode} size={20} />
        </TouchableOpacity>
      </View>

      {isChatStarted ? (
        <ChatContainer
          chat={chatHistory}
          scrollRef={scrollViewRef}
          handleScroll={handleScroll}
        />
      ) : (
        <ScrollView
          style={{marginTop: 15}}
          showsVerticalScrollIndicator={false}>
          <View style={{alignItems: 'center', alignSelf: 'center'}}>
            <Image source={modelImage} style={{height: 55, width: 55}} />
            <View style={{flexDirection: 'row'}}>
              <Text
                style={[
                  styles.AskGemini,
                  {color: isDarkTheme ? '#fff' : '#1B3C73' + 'ff'},
                ]}>
                A
              </Text>
              <Text
                style={[
                  styles.AskGemini,
                  {color: isDarkTheme ? '#fff' : '#1B3C73' + 'cc'},
                ]}>
                s
              </Text>
              <Text
                style={[
                  styles.AskGemini,
                  {color: isDarkTheme ? '#fff' : '#1B3C73' + '99'},
                ]}>
                k
              </Text>
              <Text
                style={[
                  styles.AskGemini,
                  {color: isDarkTheme ? '#fff' : '#1B3C73' + '66'},
                ]}>
                G
              </Text>
              <Text
                style={[
                  styles.AskGemini,
                  {color: isDarkTheme ? '#fff' : '#1B3C73' + '55'},
                ]}>
                e
              </Text>
              <Text
                style={[
                  styles.AskGemini,
                  {color: isDarkTheme ? '#fff' : '#1B3C73' + '77'},
                ]}>
                m
              </Text>
              <Text
                style={[
                  styles.AskGemini,
                  {color: isDarkTheme ? '#fff' : '#1B3C73' + '99'},
                ]}>
                i
              </Text>
              <Text
                style={[
                  styles.AskGemini,
                  {color: isDarkTheme ? '#fff' : '#1B3C73' + 'cc'},
                ]}>
                n
              </Text>
              <Text
                style={[
                  styles.AskGemini,
                  {color: isDarkTheme ? '#fff' : '#1B3C73' + 'ff'},
                ]}>
                i
              </Text>
            </View>
            <Text style={[styles.tagLine, {color: colorMode}]}>
              Your everyday AI assistant
            </Text>
          </View>
          <ScrollView
            horizontal={true}
            style={{marginTop: 25}}
            showsHorizontalScrollIndicator={false}>
            {suggestions.map(suggestion => (
              <View
                key={suggestion.imgUri}
                style={{height: 300, width: 270, margin: 10}}>
                <Image
                  source={{uri: suggestion.imgUri}}
                  style={{height: 240, borderRadius: 10}}
                />
                <Text
                  style={[
                    styles.suggestions,
                    {
                      color: colorMode,
                      backgroundColor: isDarkTheme ? '#2b2f33e4' : '#ffffffe4',
                    },
                  ]}>
                  {suggestion.prompt}
                </Text>
              </View>
            ))}
          </ScrollView>
          <Text style={[styles.confession, {color: colorMode}]}>
            AskGemini is utilizing AI, can make mistakes.
          </Text>
          <View style={{flexDirection: 'row', gap: 5, marginTop: 25}}>
            <Image source={modelImage} style={{height: 27, width: 27}} />
            <Text style={[styles.model, {color: colorMode}]}>AskGemini</Text>
          </View>
          <Text
            style={{
              color: colorMode,
              marginTop: 15,
              lineHeight: 20,
              marginLeft: 30,
            }}>
            Welcome back. I am excited to share more with you. What do you want to create today?
          </Text>
        </ScrollView>
      )}

      <View style={{flex: 1}}>
        {
          // Scroller button and InputBar section
        }
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
  AskGemini: {
    fontSize: 34,
    fontWeight: '500',
  },
  tagLine: {
    fontSize: 18,
    fontWeight: '300',
    color: '#000',
    letterSpacing: 0.8,
    marginTop: 15,
  },
  suggestions: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    width: '94%',
    lineHeight: 20,
  },
  confession: {
    fontSize: 12,
    color: '#000',
    alignSelf: 'center',
  },
  model: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
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
