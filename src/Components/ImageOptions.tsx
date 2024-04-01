import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useTheme} from '../Context/ThemeContext';
import ImagePicker, { Image as ImageType } from 'react-native-image-crop-picker';

interface ImageOptionsProps {
  visible: boolean;
  setImage: React.Dispatch<React.SetStateAction<ImageType | undefined>>
  onClose: () => void;
}

const ImageOptions = ({visible, setImage, onClose}: ImageOptionsProps) => {
  const {theme} = useTheme();
  const backgroundColor = theme === 'dark' ? '#000' : '#fff';
  const fontColor = theme === 'dark' ? '#fff' : '#000';

  const selectImage = () => {
    ImagePicker.openPicker({
      waitAnimationEnd: false,
      cropping: true,
      mediaType: 'photo',
    })
      .then(image => {
        setImage(image);
      })
      .catch(error => {
        console.log('ImagePicker Error: ', error);
      })
      .finally(() => onClose())
  };

  const openCamera = async () => {
    ImagePicker.openCamera({
      cropping: true,
      mediaType: 'photo',
    })
      .then(image => {
        setImage(image);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => onClose())
  };

  if (!visible) return null;

  return (
    <>
      <StatusBar backgroundColor={theme === 'dark' ? '#111' : '#00000066'} />
      <View style={styles.container}>
        <View style={[styles.popup, {backgroundColor: backgroundColor}]}>
          <Text style={{fontSize: 18, color: fontColor}}>Select Image</Text>
          <View style={{gap: 0, marginBottom: 5}}>
            <TouchableOpacity style={{paddingVertical: 5}} onPress={openCamera}>
              <Text style={{color: fontColor}}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{paddingVertical: 5}} onPress={selectImage}>
              <Text style={{color: fontColor}}>Choose from Liabrary</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={onClose} style={{alignSelf: 'flex-end'}}>
            <Text style={{color: fontColor, fontWeight: '500'}}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default ImageOptions;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: 100,
    height: '100%',
    width: '100%',
    backgroundColor: '#00000066',
  },
  popup: {
    position: 'absolute',
    justifyContent: 'space-between',
    alignSelf: 'center',
    bottom: '40%',
    height: 195,
    width: '75%',
    elevation: 100,
    shadowOffset: {
      width: 1,
      height: 1,
    },

    padding: 25,
    borderRadius: 15,
  },
});
