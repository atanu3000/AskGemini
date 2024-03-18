import {Dimensions, FlatList, Image, Text, View} from 'react-native';
import React, {RefObject, memo, useMemo} from 'react';
import {InputContent} from '@google/generative-ai';
import getMarkdownStyle from '../markdownStyle';
import MarkdownDisplay from 'react-native-markdown-display';
import {useTheme} from '../Context/ThemeContext';
import useChatContext from '../Context/ChatContext';
import LottieView from 'lottie-react-native';

interface ChatContainerProps {
  chat: InputContent[];
  scrollRef: RefObject<FlatList<any>>;
  handleScroll: (event: {
    nativeEvent: {
      contentOffset: {y: number};
      layoutMeasurement: {height: number};
      contentSize: {height: number};
    };
  }) => void;
}

const addSpacesToCodeBlocks = (text: string): string => {
  const lines = text.split(/\n/);
  let insideCodeBlock = false;
  const modifiedLines = lines.map(line => {
    if (line.includes('`')) {
      insideCodeBlock = !insideCodeBlock;
      return `${line}`;
    } else if (insideCodeBlock) {
      return `    ${line}`;
    } else {
      return line;
    }
  });

  const modifiedText = modifiedLines.join('\n');

  return modifiedText;
};

const ChatItem: React.FC<{
  item: InputContent;
  colorMode: string;
  markdownStyle: any;
}> = React.memo(({item, colorMode, markdownStyle}) => {
  const userImage = useMemo(() => require('../../src/assets/user.png'), []);
  const modelImage = useMemo(
    () => require('../../android/app/src/main/res/mipmap-hdpi/ic_launcher.png'),
    [],
  );
  const imageSrc = item.role === 'user' ? userImage : modelImage;
  const role = item.role === 'user' ? 'You' : 'AskGemini';
  const {width} = Dimensions.get('window');

  return (
    <View style={{marginVertical: 0, marginTop: 0, }}>
      <View style={{flexDirection: 'row', gap: 10, marginBottom: 5}}>
        <Image source={imageSrc} style={{height: 27, width: 27}} />
        <View style={{width: width * 0.846}}>
          <Text style={{color: colorMode, fontWeight: '500', fontSize: 16}}>
            {role}
          </Text>
          <MarkdownDisplay style={markdownStyle}>
            {addSpacesToCodeBlocks(
              item.parts.toString().replace(/```/g, '\n`\n\n'),
            )}
          </MarkdownDisplay>
        </View>
      </View>
    </View>
  );
});

const ChatContainer: React.FC<ChatContainerProps> = React.memo(
  ({chat, scrollRef, handleScroll}) => {
    const {theme} = useTheme();

    const colorMode = theme === 'dark' ? '#fff' : '#000';
    const markdownStyle = getMarkdownStyle();
    const {isLoading} = useChatContext();

    return (
      <View style={{maxHeight: '86%',paddingBottom: 0}}>
        <FlatList
          data={chat}
          ref={scrollRef}
          onScroll={handleScroll}
          contentContainerStyle={{paddingBottom: 30, width: '100%',}}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <ChatItem
              item={item}
              colorMode={colorMode}
              markdownStyle={markdownStyle}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <View style={{ paddingLeft: 35}}>
          {isLoading && (
          <LottieView
            source={require('../assets/typing-animation2.json')}
            style={{width: 60, height: 40}}
            autoPlay
            loop
          />
          )}
        </View>
      </View>
    );
  },
);

export default memo(ChatContainer);
