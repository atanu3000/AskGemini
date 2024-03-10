import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { useTheme } from '../Context/ThemeContext';


interface ThemeDialogProps {
  visible: boolean;
  onClose: () => void;
}

const ThemeDialog: React.FC<ThemeDialogProps> = ({ visible, onClose }) => {
  const { mode, setMode,  theme} = useTheme();
  const backgroundColor = theme === 'dark' ? '#000' : '#fff';
  const fontColor = theme === 'dark' ? '#fff' : '#000';

  const handleThemeChange = (selectedTheme: string) => {
    setMode(selectedTheme);
    onClose();
  };

  if (!visible) return null;

  return (
    <View style={[styles.popup, {backgroundColor: backgroundColor}]}>
      <Text style={{ fontSize: 18, marginBottom: 10 , color: fontColor}}>Select Theme</Text>
      <RadioButton.Group onValueChange={handleThemeChange} value={mode}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5}}>
          <RadioButton.Android value="default" />
          <TouchableOpacity onPress={() => handleThemeChange('default')}>
            <Text style={{color: fontColor}}>System (Default)</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5}}>
          <RadioButton.Android value="light" />
          <TouchableOpacity onPress={() => handleThemeChange('light')}>
            <Text style={{color: fontColor}}>Light Mode</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5}}>
          <RadioButton.Android value="dark" />
          <TouchableOpacity onPress={() => handleThemeChange('dark')}>
            <Text style={{color: fontColor}}>Dark Mode</Text>
          </TouchableOpacity>
        </View>
      </RadioButton.Group>
    </View>
  );
};

const styles = StyleSheet.create({
  popup: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: '40%',
    height: 190,
    width: '75%',
    elevation: 100,
    shadowOffset: {
        width: 1,
        height: 1,
      },
    
    padding: 25,
    borderRadius: 15,
    zIndex: 9999,
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