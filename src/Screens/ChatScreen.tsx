import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState} from 'react';
import InputBar from '../Components/InputBar';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { Image as ImageType } from 'react-native-image-crop-picker';

//generative AI impports
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  InputContent,
} from '@google/generative-ai';
import {Google_API_KEY1, Google_API_KEY2} from '../../API';
import ChatContainer from '../Components/ChatContainer';
import useChatContext from '../Context/ChatContext';
import suggestions from '../assets/suggestions';
import {useTheme} from '../Context/ThemeContext';
import ImageOptions from '../Components/ImageOptions';

interface AnimationProps {
  offsetValue: Animated.Value;
  scaleValue?: Animated.Value;
  closeButtonOffset?: Animated.Value;
}

const ChatScreen: React.FC<AnimationProps> = ({offsetValue}) => {
  const [textInput, setTextInput] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<ImageType>();
  const [isSuggestionChat, setIsSuggestionChat] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<InputContent[]>([]);
  const {theme} = useTheme();
  const colorMode = theme === 'dark' ? '#ddd' : '#000';
  const isDarkTheme = theme === 'dark' ? true : false;
  const scrollViewRef = React.useRef<FlatList<any>>(null);
  const [showGoToBottomButton, setShowGoToBottomButton] =
    useState<boolean>(false);
  const [title, setTitle] = useState<string>();
  const [currentApiKeyIndex, setCurrentApiKeyIndex] = useState<number>(0);
  const {isChatStarted, setIsChatStarted, showMenu, setShowMenu, setIsLoading} =
    useChatContext();
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);

  React.useEffect(() => {
    const chatCleared = () => {
      if (!isChatStarted) {
        setChatHistory([]);
        setShowGoToBottomButton(false);
        setTitle('');
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

  const updateChatHistory = async (role: string, content: string) => {
    setChatHistory(prevHistory => [
      ...prevHistory,
      {
        role: role,
        parts: [content],
      },
    ]);
  };

  const API_KEYS = [Google_API_KEY1, Google_API_KEY2];

  function getNextApiKey() {
    setCurrentApiKeyIndex((currentApiKeyIndex + 1) % API_KEYS.length);
    return API_KEYS[currentApiKeyIndex];
  }

  async function generateTitle() {
    const api_key = getNextApiKey();
    try {
      const genAI = new GoogleGenerativeAI(api_key);
      const model = genAI.getGenerativeModel({model: 'gemini-pro'});
      const query =
        'Write a very short title in 3 to 5 words about the following topic: ' +
        textInput;
      const result = await model.generateContent(query);
      const response = result.response;
      setTitle(response.text().replace(/\*\*/g, ''));
    } catch (error) {}
  }

  async function runChat() {
    await updateChatHistory('user', textInput);
    setIsChatStarted(true);
    setIsLoading(true);
    handleGoToBottom();
    const api_key = getNextApiKey();
    try {
      const genAI = new GoogleGenerativeAI(api_key);
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
    } finally {
      if (!isChatStarted) {
        generateTitle();
      }
      setIsLoading(false);
      handleGoToBottom();
    }
  }

  React.useEffect(() => {
    if (textInput !== '' && isSuggestionChat) {
      runChat();
    }
    setIsSuggestionChat(false);
  }, [textInput]);

  const startSuggestionChats = (text: string) => {
    setTextInput(text);
    setIsSuggestionChat(true);
  };

  const {width} = Dimensions.get('window');
  const modelImage = require('../../android/app/src/main/res/mipmap-hdpi/ic_launcher.png');
  return (
    <KeyboardAvoidingView behavior={'height'} style={{height: '100%'}}>
      <View style={styles.headContainer}>
        {
          // Head container
        }
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#DDDDDD55"
          onPress={() => {
            Animated.timing(offsetValue, {
              toValue: showMenu ? 0 : width * 0.8,
              duration: 300,
              useNativeDriver: true,
            }).start();
            setShowMenu(!showMenu);
          }}
          style={{padding: 10, borderRadius: 10}}>
          {showMenu ? (
            <Icon name={'xmark'} color={colorMode} size={22} />
          ) : (
            <Icon name={'bars'} color={colorMode} size={20} />
          )}
        </TouchableHighlight>
        <Text style={[styles.heading, {color: colorMode}]}>
          {title?.split('').slice(0, 27)}
          {title?.length! > 27 && '...'}
        </Text>
        <TouchableHighlight
          style={{padding: 10, borderRadius: 10}}
          activeOpacity={0.2}
          underlayColor="#DDDDDD">
          <Icon name={'ellipsis-vertical'} color={colorMode} size={20} />
        </TouchableHighlight>
      </View>

      <ImageOptions
        visible={dialogVisible}
        setImage={setSelectedImage}
        onClose={() => setDialogVisible(!dialogVisible)}
      />

      {isChatStarted ? (
        <ChatContainer
          chat={chatHistory}
          scrollRef={scrollViewRef}
          handleScroll={handleScroll}
        />
      ) : (
        <ScrollView
          contentContainerStyle={{paddingBottom: 100, paddingHorizontal: 10}}
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
                <TouchableWithoutFeedback
                  onPress={() => {
                    startSuggestionChats(suggestion.prompt);
                  }}>
                  <View>
                    <Image
                      source={{uri: suggestion.imgUri}}
                      style={{height: 240, borderRadius: 10}}
                    />
                    <Text
                      style={[
                        styles.suggestions,
                        {
                          color: colorMode,
                          backgroundColor: isDarkTheme
                            ? '#2b2f33e4'
                            : '#ffffffe4',
                        },
                      ]}>
                      {suggestion.prompt}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
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
          <Text style={[styles.initialPrompt, {color: colorMode}]}>
            Welcome back. I am excited to share more with you. What do you want
            to create today?
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
          <InputBar
            setText={setTextInput}
            setDialogVisible={setDialogVisible}
            image={selectedImage}
            cancelImage={setSelectedImage}
            runChat={runChat}
          />
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
    paddingHorizontal: 10,
    paddingBottom: 10,
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
    bottom: -40,
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
  initialPrompt: {
    marginTop: 15,
    lineHeight: 20,
    marginLeft: 30,
  },
  inputBarContainer: {
    position: 'absolute',
    bottom: 8,
    gap: 10,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
  goToBottomButton: {
    alignSelf: 'center',
    backgroundColor: '#91b2fa',
    padding: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
  },
});
