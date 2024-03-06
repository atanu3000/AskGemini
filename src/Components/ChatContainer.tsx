import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import React, {RefObject, useMemo} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {InputContent} from '@google/generative-ai';
import getMarkdownStyle from '../markdownStyle';
import MarkdownDisplay from 'react-native-markdown-display';

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
  // console.log(modifiedText);

  return modifiedText;
};

const ChatItem: React.FC<{
  item: InputContent;
  colorMode: string;
  markdownStyle: any;
}> = React.memo(({item, colorMode, markdownStyle}) => {
  const userImage = useMemo(() => require('../../src/assets/user.png'), []);
  const modelImage = useMemo(() => require('../../android/app/src/main/res/mipmap-hdpi/ic_launcher.png'), []);

  return (
    <View style={{marginVertical: 7, marginTop: 20}}>
      <View style={{flexDirection: 'row', gap: 10, marginBottom: 5}}>
        {item.role === 'user' ? (
          <Image source={userImage} style={{height: 27, width: 27}} />
        ) : (
          <Image source={modelImage} style={{height: 27, width: 27}} />
        )}
        <View style={{width: 332}}>
          <Text style={{color: colorMode}}>
            {item.role === 'user' ? 'You' : 'AskGemini'}
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
    const colorMode = useColorScheme() === 'dark' ? '#fff' : '#000';
    const markdownStyle = getMarkdownStyle();

    return (
      <View style={{height: '86%'}}>
        <FlatList
          data={chat}
          ref={scrollRef}
          onScroll={handleScroll}
          contentContainerStyle={{paddingBottom: 30, width: '100%'}}
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
      </View>
    );
  },
);

export default ChatContainer;

const styles = StyleSheet.create({});
