import {FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme} from 'react-native';
import React, { RefObject } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {InputContent} from '@google/generative-ai';
import getMarkdownStyle from '../markdownStyle';
import MarkdownDisplay from 'react-native-markdown-display';

interface ChatContainerProps {
  chat: InputContent[];
  scrollRef: RefObject<FlatList<any>>
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
}

const ChatContainer: React.FC<ChatContainerProps> = React.memo(({chat, scrollRef, handleScroll}) => {
  const colorMode = useColorScheme() === 'dark' ? '#fff' : '#000';
  const markdownStyle = getMarkdownStyle();

  return (
    <View style={{height: '86%'}}>
      <FlatList
        data={chat}
        ref={scrollRef}
        onScroll={handleScroll}
        contentContainerStyle={{paddingBottom: 30}}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <View style={{marginVertical: 7, marginTop: 20}}>
            <View style={{flexDirection: 'row', gap: 10, marginBottom: 5}}>
              {item.role === 'user' ? (
                <Icon name={'circle-user'} color={colorMode} size={20} />
              ) : (
                <Icon name={'sun'} color={colorMode} size={20} />
              )}
              <View style={{width: 332}}>
                <Text style={{color: colorMode}}>
                  {item.role === 'user' ? 'You' : 'AskGemini'}
                </Text>
                <MarkdownDisplay style={markdownStyle}>
                  {addSpacesToCodeBlocks(item.parts.toString().replace(/```/g, "\n`\n\n"))}
                </MarkdownDisplay>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

    </View>
  );
});

export default ChatContainer;

const styles = StyleSheet.create({
  
});
