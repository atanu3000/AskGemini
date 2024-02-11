import {FlatList, StyleSheet, Text, View, useColorScheme} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {InputContent} from '@google/generative-ai';
import getMarkdownStyle from '../markdownStyle';
import Markdown from 'react-native-markdown-display';

interface ChatContainerProps {
  chat: InputContent[];
}

const ChatContainer: React.FC<ChatContainerProps> = ({chat}) => {
  const colorMode = useColorScheme() === 'dark' ? '#fff' : '#000';
  const markdownStyle = getMarkdownStyle();
  return (
    <View>
      <FlatList
        data={chat}
        contentContainerStyle={{paddingBottom: 150}}
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
                <Markdown style={markdownStyle}>
                  {item.parts.toString()}
                </Markdown>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default ChatContainer;

const styles = StyleSheet.create({});
