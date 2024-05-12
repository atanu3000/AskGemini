import {
  Animated,
  Dimensions,
  DrawerLayoutAndroid,
  FlatList,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {RefObject, useState} from 'react';
import InputBar from '../Components/InputBar';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {Image as ImageType} from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs';

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
import MenuContainer from '../Components/MenuContainer';
import { sc, vc } from '../assets/Styles/Dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RenameTitle from '../Components/RenameTitle';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';

interface DrawerLayoutProps {
  openDrawer: RefObject<DrawerLayoutAndroid>
}

export type chatsType = {
  id: string;
  title: string;
  chat: InputContent[];
}

const ChatScreen: React.FC<DrawerLayoutProps> = ({openDrawer}) => {
  const {
    isChatStarted,
    setIsChatStarted,
    showMenu,
    setShowMenu,
    setIsLoading,
    chatHistory,
    setChatHistory,
    chatTitle,
    setChatTitle,
    chatId,
    setChatId,
    menuContainerVisible,
    setMenuContainerVisible
  } = useChatContext();
  const [textInput, setTextInput] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<ImageType>();
  const [isSuggestionChat, setIsSuggestionChat] = useState<boolean>(false);
  const {theme} = useTheme();
  const colorMode = theme === 'dark' ? '#ddd' : '#000';
  const isDarkTheme = theme === 'dark' ? true : false;
  const scrollViewRef = React.useRef<FlatList<any>>(null);
  const textInputRef = React.useRef<TextInput>(null);
  const [showGoToBottomButton, setShowGoToBottomButton] =
    useState<boolean>(false);
  const [currentApiKeyIndex, setCurrentApiKeyIndex] = useState<number>(0);
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [titleBoxVisible, setTitleBoxVisible] = useState<boolean>(false);

  React.useEffect(() => {
    const chatCleared = () => {
      if (!isChatStarted) {
        setChatHistory([]);
        setShowGoToBottomButton(false);
        setChatTitle('');
      }
    };

    chatCleared();
  }, [isChatStarted]);

const ID: string = uuidv4(); // creates a unique string as ID
// console.log(ID);

const saveChats = async (chatTitle: string, chatContent: InputContent[]) => {
  try {
    const existingChat = await AsyncStorage.getItem('AskGemini_ChatHistory');
    const currentChat: chatsType[] = existingChat ? JSON.parse(existingChat) : [];    

    const index = currentChat.findIndex(chat => chat.id === chatId);

    index !== -1
      ? currentChat[index].chat = chatContent
      : currentChat.push({id: chatId, title: chatTitle, chat: chatContent});

    await AsyncStorage.setItem(
      'AskGemini_ChatHistory',
      JSON.stringify(currentChat),
    );
  } catch (error) {
    console.error('Error saving chat history', error);
  }
};

React.useEffect(() => {
  const intervalId = setInterval(async () => {
    chatId && chatTitle && chatHistory && await saveChats(chatTitle, chatHistory)
  }, 100);
  return () => clearInterval(intervalId);
}, [chatHistory, chatTitle]);

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
      setChatTitle(response.text().replace(/\*\*/g, ''));
    } catch (error) {}
  }

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];

  async function runChat() {
    await updateChatHistory('user', textInput);
    setIsChatStarted(true);
    setIsLoading(true);
    handleGoToBottom();
    const api_key = getNextApiKey();
    try {
      const genAI = new GoogleGenerativeAI(api_key);
      const model = genAI.getGenerativeModel({model: 'gemini-pro'});

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
        setChatId(ID)
      }      
      setIsLoading(false);
      handleGoToBottom();
    }
  }

  // Converts local file information to a GoogleGenerativeAI.Part object.
  async function fileToGenerativePart(path: string, mimeType: string) {
    try {
      const fileContent = await RNFS.readFile(path, 'base64');
      return {
        inlineData: {
          data: fileContent,
          mimeType,
        },
      };
    } catch (error) {
      console.error('Error reading file:', error);
      throw error;
    }
  }

  async function genImgResponse() {
    await updateChatHistory('user', selectedImage!.path + textInput);
    setIsChatStarted(true);
    setIsLoading(true);
    handleGoToBottom();
    const api_key = getNextApiKey();
    try {
      const genAI = new GoogleGenerativeAI(api_key);

      const model = genAI.getGenerativeModel({
        model: 'gemini-pro-vision',
        safetySettings,
        generationConfig,
      });

      const part = await fileToGenerativePart(
        selectedImage!.path,
        selectedImage!.mime,
      );

      const query =
        'Understand this image carefully and answer the following question: ' +
        textInput;

      const result = await model.generateContent([query, part]);
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

  const handleOutside = () => {
    setMenuContainerVisible(false);
  }

  const {width} = Dimensions.get('window');
  const modelImage = require('../../android/app/src/main/res/mipmap-hdpi/ic_launcher.png');
  const {height} = Dimensions.get('screen');
  
  return (
    <SafeAreaView style={{flex: 1, paddingTop: height*0.04}}>
      <TouchableWithoutFeedback onPress={handleOutside}>
        <KeyboardAvoidingView behavior={'height'} style={{flex: 1}}>
          <View style={styles.headContainer}>
            {
              // Head container
            }
            <TouchableHighlight
              activeOpacity={0.6}
              underlayColor="#DDDDDD55"
              onPress={() => {
                openDrawer.current?.openDrawer();
                textInputRef.current?.blur();
                // setShowMenu(!showMenu);
                setMenuContainerVisible(false);
              }}
              style={{padding: 10, borderRadius: 10}}>
                <Icon name={'bars'} color={colorMode} size={20} />

            </TouchableHighlight>
            <Text style={[styles.heading, {color: colorMode}]}>
              {chatTitle?.split('').slice(0, sc(25))}
              {chatTitle?.length! > sc(25) && '...'}
            </Text>
            <TouchableHighlight
              activeOpacity={0.2}
              underlayColor="#DDDDDD55"
              onPress={() => setMenuContainerVisible(!menuContainerVisible)}
              style={{
                padding: 10,
                borderRadius: 10,
                paddingHorizontal: 12,
                backgroundColor: menuContainerVisible ? '#CCCCCC55' : 'transparent',
              }}>
              <Icon name={'ellipsis-vertical'} color={colorMode} size={20} />
            </TouchableHighlight>
          </View>

          <RenameTitle
            isVisible={titleBoxVisible}
            onClose={() => setTitleBoxVisible(false)}
          />

          <MenuContainer
            isVisible={menuContainerVisible}
            openRenameTitle={() => setTitleBoxVisible(true)}
            onClose={() => setMenuContainerVisible(false)}
          />

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
                <Image source={modelImage} style={{height: sc(50), width: sc(50), maxHeight: 70, maxWidth: 70}} />
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
                    style={{height: sc(290), width: sc(260), margin: 10, maxHeight: 420, maxWidth: 440}}>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        startSuggestionChats(suggestion.prompt);
                        setMenuContainerVisible(false);
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
              <View style={{flexDirection: 'row', gap: 5, marginTop: 25, alignItems: 'center'}}>
                <Image source={modelImage} style={{height: sc(26), width: sc(26), maxHeight: 38, maxWidth: 38 }} />
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
                textInputRef={textInputRef}
                setText={setTextInput}
                setDialogVisible={setDialogVisible}
                image={selectedImage}
                cancelImage={setSelectedImage}
                runChat={runChat}
                genImgResponse={genImgResponse}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
    
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  heading: {
    fontSize: sc(16) > 26 ? 26 : sc(16),
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
    fontSize: sc(30) > 60 ? 60 : sc(30),
    fontWeight: '500',
  },
  tagLine: {
    fontSize: sc(16) > 30 ? 30 : sc(16),
    fontWeight: '300',
    color: '#000',
    letterSpacing: 0.8,
    marginTop: 15,
  },
  suggestions: {
    position: 'absolute',
    bottom: -40,
    fontSize: sc(13) > 22 ? 22 : sc(13),
    alignSelf: 'center',
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    width: '94%',
    lineHeight: sc(16),
  },
  confession: {
    fontSize: sc(12) > 20 ? 20 : sc(12),
    color: '#000',
    alignSelf: 'center',
  },
  model: {
    fontSize: sc(14) > 26 ? 26 : sc(14),
    fontWeight: '500',
    color: '#000',
  },
  initialPrompt: {
    fontSize: sc(12) > 20 ? 20 : sc(12) ,
    // fontSize: sc(12),
    marginTop: 15,
    lineHeight: sc(16),
    marginLeft: 30,
  },
  inputBarContainer: {
    position: 'absolute',
    bottom: 5,
    gap: 10,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: sc(5),
  },
  goToBottomButton: {
    alignSelf: 'center',
    backgroundColor: '#91b2fa',
    padding: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
  },
});
