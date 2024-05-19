import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {useTheme} from '../Context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {sc} from '../assets/Styles/Dimensions';

interface ThemeDialogProps {
  visible: boolean;
  onClose: () => void;
}

const ThemeDialog: React.FC<ThemeDialogProps> = ({visible, onClose}) => {
  const {mode, setMode, theme} = useTheme();
  const backgroundColor = theme === 'dark' ? '#000' : '#fff';
  const fontColor = theme === 'dark' ? '#fff' : '#000';

  const handleThemeChange = (selectedTheme: string) => {
    setMode(selectedTheme);
    onClose();
    saveMode(selectedTheme);
  };

  const saveMode = async (themeMode: string) => {
    await AsyncStorage.setItem('askGemini_theme_mode', themeMode);
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={[styles.popup, {backgroundColor: backgroundColor}]}>
        <Text style={{fontSize: sc(16) > 26 ? 26 : sc(16), marginBottom: 10, color: fontColor}}>
          Select Theme
        </Text>
        <RadioButton.Group onValueChange={handleThemeChange} value={mode}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 5,marginVertical: sc(4) > 13 ? 13 : sc(4)}}>
            <RadioButton.Android value="default" />
            <TouchableOpacity onPress={() => handleThemeChange('default')}>
              <Text style={{color: fontColor, fontSize: sc(13) > 22 ? 22 : sc(13)}}>System (Default)</Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 5,marginVertical: sc(4) > 13 ? 13 : sc(4)}}>
            <RadioButton.Android value="light" />
            <TouchableOpacity onPress={() => handleThemeChange('light')}>
              <Text style={{color: fontColor, fontSize: sc(13) > 22 ? 22 : sc(13)}}>Light Mode</Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 5,marginVertical: sc(4) > 13 ? 13 : sc(4)}}>
            <RadioButton.Android value="dark" />
            <TouchableOpacity onPress={() => handleThemeChange('dark')}>
              <Text style={{color: fontColor, fontSize: sc(13) > 22 ? 22 : sc(13)}}>Dark Mode</Text>
            </TouchableOpacity>
          </View>
        </RadioButton.Group>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1000,
    height: '100%',
    width: '100%',
    backgroundColor: '#00000066',
  },
  popup: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: '40%',
    height: sc(200) > 280 ? 280 : sc(200),
    width: '75%',
    elevation: 40,
    shadowOffset: {
      width: 1,
      height: 1,
    },

    padding: 25,
    borderRadius: 15,
  },
  popupText: {
    fontSize: 16,
    marginBottom: 10,
  },
  option: {
    fontSize: 14,
    marginBottom: 5,
  },
});

export default ThemeDialog;
