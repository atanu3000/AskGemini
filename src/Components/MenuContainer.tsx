import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import useChatContext from '../Context/ChatContext';
import {useTheme} from '../Context/ThemeContext';
import Icon from 'react-native-vector-icons/FontAwesome6';

interface MainContainerProps {
  isVisible: boolean;
  onClose: () => void;
}

const MenuContainer = ({isVisible, onClose}: MainContainerProps) => {
  const {isChatStarted} = useChatContext();
  const {theme} = useTheme();

  const colorMode = theme === 'dark' ? '#ddd' : '#555';
  const backgroundColor = theme === 'dark' ? '#000' : '#fff';

  if (!isVisible) return null;

  return (
    <View style={[styles.popup, {backgroundColor: backgroundColor}]}>
      <TouchableOpacity>
        <View style={styles.buttons}>
          <Icon name={'circle-info'} size={20} color={colorMode} />
          <Text style={{color: colorMode, fontSize: 15}}>View Details</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity>
        <View style={styles.buttons}>
          <Icon name={'file-lines'} size={20} color={colorMode} />
          <Text style={{color: colorMode, fontSize: 15}}>
            Terms and Conditions
          </Text>
        </View>
      </TouchableOpacity>
      {isChatStarted && (
        <>
          <TouchableOpacity>
            <View style={styles.buttons}>
              <Icon name={'share-from-square'} size={20} color={colorMode} />
              <Text style={{color: colorMode, fontSize: 15}}>Share</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.buttons}>
              <Icon name={'pen'} size={20} color={colorMode} />
              <Text style={{color: colorMode, fontSize: 15}}>Rename</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.buttons}>
              <Icon name={'trash-can'} size={20} color={colorMode} />
              <Text style={{color: colorMode, fontSize: 15}}>Delete</Text>
            </View>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default MenuContainer;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: 100,
    height: '100%',
    width: '100%',
    // backgroundColor: '#00000066',
  },
  popup: {
    position: 'absolute',
    zIndex: 1000,
    // justifyContent: 'space-between',
    alignSelf: 'flex-end',
    top: 50,
    right: 5,
    elevation: 100,
    shadowOffset: {
      width: 1,
      height: 1,
    },

    padding: 25,
    borderRadius: 15,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingVertical: 10,
  },
});
