import {
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {useTheme} from '../Context/ThemeContext';
import {useAppwrite} from '../appwrite/AppwriteContext';
import ThemeDialog from '../Components/ThemeDialog';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from '../routes/AppStack';

type SettingsScreenProps = NativeStackScreenProps<AppStackParamList, 'Settings'>;

const Settings = ({route}: SettingsScreenProps) => {
  const {name, email} = route.params;
  const {appwrite, setIsLogedin} = useAppwrite();
  const {theme, mode} = useTheme();
  const Background = theme === 'dark' ? '#222' : '#fff';
  const FontColor = theme === 'dark' ? '#ddd' : '#444';
  const barStyle = theme === 'dark' ? 'light-content' : 'dark-content';
  const [dialogVisible, setDialogVisible] = useState(false);

  const capitalizeFirstLetter = (str: string) => {
    return '(' + str.charAt(0).toUpperCase() + str.slice(1) + ')';
  };

  const handleLogout = () => {
    appwrite.LogoutUser().then(() => {
      setIsLogedin(false);
      ToastAndroid.show('Good bye ' + name?.split(' ')[0], ToastAndroid.SHORT);
    });
  };

  const toggleDialog = () => {
    setDialogVisible(prevState => !prevState);
  };

  return (
    <>
      <StatusBar backgroundColor={Background} barStyle={barStyle} />
      <ThemeDialog visible={dialogVisible} onClose={toggleDialog} />
      <ScrollView
        style={[styles.container, {backgroundColor: Background}]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.userContainer}>
          <Icon name={'circle-user'} solid size={32} color={FontColor} />
          <View>
            <Text style={[styles.name, {color: FontColor}]}>{name}</Text>
          </View>
        </View>
        <Text style={{color: FontColor, fontWeight: '500', marginBottom: 10}}>
          Accounts
        </Text>
        <View>
          <View style={styles.options}>
            <Icon name={'envelope'} size={18} color={FontColor} />
            <Text style={{color: FontColor, fontSize: 16}}>{email}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <View style={styles.options}>
            <Icon name={'message'} size={18} color={FontColor} />
            <Text style={{color: FontColor, fontSize: 16}}>
              Conversation Style
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={styles.options}>
            <Icon name={'database'} size={18} color={FontColor} />
            <Text style={{color: FontColor, fontSize: 16}}>Chat Controls</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleDialog}>
          <View style={styles.options}>
            <Icon name={'palette'} size={18} color={FontColor} />
            <Text style={{color: FontColor, fontSize: 16}}>Theme</Text>
            <Text style={{color: FontColor, paddingLeft: 0}}>
              {capitalizeFirstLetter(mode)}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openSettings()}>
          <View style={styles.options}>
            <Icon name={'lock'} size={18} color={FontColor} />
            <Text style={{color: FontColor, fontSize: 16}}>Permissions</Text>
          </View>
        </TouchableOpacity>
        <Text style={{color: FontColor, fontWeight: '500', marginVertical: 10}}>
          About
        </Text>
        <TouchableOpacity>
          <View style={styles.options}>
            <Icon name={'hand-holding-hand'} size={18} color={FontColor} />
            <Text style={{color: FontColor, fontSize: 16}}>Helps Center</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={styles.options}>
            <Icon name={'file-lines'} size={18} color={FontColor} />
            <Text style={{color: FontColor, fontSize: 16}}>Terms of Use</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={styles.options}>
            <Icon name={'user-lock'} size={18} color={FontColor} />
            <Text style={{color: FontColor, fontSize: 16}}>Privacy Policy</Text>
          </View>
        </TouchableOpacity>
        <View>
          <View style={styles.options}>
            <Icon name={'android'} size={18} color={FontColor} />
            <Text style={{color: FontColor, fontSize: 16}}>
              AskGemini for Andriod
            </Text>
            <Text style={{color: FontColor}}>1.0.0</Text>
          </View>
        </View>
        <TouchableOpacity style={{paddingBottom: 100}} onPress={handleLogout}>
          <View style={styles.options}>
            <Icon name={'right-from-bracket'} size={18} color={'red'} />
            <Text style={{color: 'red', fontSize: 16}}>Sign out</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    paddingHorizontal: 15,
    paddingBottom: 35,
  },
  userContainer: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
    marginVertical: 30,
  },
  options: {
    flexDirection: 'row',
    gap: 13,
    alignItems: 'center',
    marginVertical: 17,
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
  },
});
