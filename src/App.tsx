import {
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  useColorScheme,
} from 'react-native';
import React from 'react';
import ChatScreen from './Screens/ChatScreen';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome6';
import images from './assets';

export default function App() {
  const colorScheme = useColorScheme();
  const ThemeColor = colorScheme === 'light' ? '#fff' : '#212121';
  const FontColor = colorScheme === 'light' ? '#212121' : '#fff';
  const barStyle = colorScheme === 'light' ? 'dark-content' : 'light-content';

  const offsetValue = React.useRef(new Animated.Value(0)).current;

  return (
    <SafeAreaView style={styles.menuContainer}>
      <StatusBar backgroundColor={ThemeColor} barStyle={barStyle} />
      <View>
        <TouchableWithoutFeedback>
          <View style={styles.searchBox}>
            <Icon name={'magnifying-glass'} size={16} color={FontColor} />
            <Text style={{color: FontColor, fontSize: 15}}>Search</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback>
          <View style={styles.newChat}>
            <Image source={images.model} style={{height: 35, width: 35}} />
            <Text style={{color: FontColor, fontSize: 15}}>AskGemini</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          transform: [{scale: 1}, {translateX: offsetValue}],
        }}>
        <LinearGradient
          colors={['#ffffff00', '#a7c2fc77']}
          style={[styles.container, {backgroundColor: ThemeColor}]}>
          <ChatScreen offsetValue={offsetValue} />
        </LinearGradient>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    height: '100%',
    width: '100%',
    backgroundColor: '#6a97f7',
  },
  searchBox: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    backgroundColor: '#9dbafa',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 15,
    marginHorizontal: 10,
    width: '75%',
  },
  newChat: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginTop: 15,
    backgroundColor: '#acdcfa',
    paddingLeft: 20,
    paddingVertical: 15,
  },
  container: {
    height: '100%',
    width: '100%',
    flex: 1,
    paddingHorizontal: 15,
  },
});
