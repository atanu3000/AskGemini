import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useAppwrite} from '../appwrite/AppwriteContext';

//Navigation
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../routes/AuthStack';
import Loading from '../Components/Loading';
import {useTheme} from '../Context/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {sc} from '../assets/Styles/Dimensions';

type SignupScreenProps = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

const Signup = ({navigation}: SignupScreenProps) => {
  const {theme} = useTheme();
  const ThemeColor = theme === 'dark' ? '#222831' : '#fff';
  const FontColor = theme === 'dark' ? '#ddd' : '#333';
  const barStyle = theme === 'dark' ? 'light-content' : 'dark-content';
  const {appwrite, setIsLogedin} = useAppwrite();

  const [error, setError] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  // const [password, setPassword] = useState<string>('');
  // const [repeatPassword, setRepeatPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [isPasswordHide, setIsPasswordHide] = useState<boolean>(true);

  const handleSignup = () => {
    if (name.length < 1 || email.length < 1 || phone.length < 1) {
      setError('All fields are required');
    } else {
      setIsLoading(true);
      const user = {
        email,
        phone,
        name,
      };

      appwrite
        .CreatAccount(user)
        .then(_ => {
          // setIsLogedin(true);
          setIsLoading(false);
          navigation.navigate('Login', {userEmail: email});
        })
        .catch(err => {
          console.log(err);
          setError(err.message);
        });
    }
  };

  if (isLoading) return <Loading />;

  return (
    <LinearGradient
      colors={['#ffffff00', '#a7c2fc' + `${theme === 'dark' ? '44' : '88'}`]}
      style={[styles.container, {backgroundColor: ThemeColor}]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <StatusBar backgroundColor={ThemeColor} barStyle={barStyle} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headContainer}>
            <View style={{width: '50%'}}>
              <Text
                style={{
                  fontSize: sc(30) > 40 ? 60 : sc(30),
                  fontWeight: '500',
                  color: FontColor,
                }}>
                Sign up
              </Text>
              <Text style={{fontSize: sc(14) > 20 ? 23 : 16, color: FontColor}}>
                Create a new account
              </Text>
            </View>
            <LottieView
              source={require('../assets/signin-animation.json')}
              style={{
                height: sc(190),
                width: sc(190),
                maxHeight: 320,
                maxWidth: 320,
              }}
              autoPlay
              loop
            />
          </View>

          {/* Name */}
          <View style={[styles.inputBar, {backgroundColor: ThemeColor}]}>
            <Icon name={'user'} size={20} color={FontColor} />
            <TextInput
              value={name}
              onChangeText={text => {
                setError('');
                setName(text);
              }}
              placeholderTextColor={'#AEAEAE'}
              placeholder="Name"
              style={styles.input}
            />
          </View>

          {/* Email */}
          <View style={[styles.inputBar, {backgroundColor: ThemeColor}]}>
            <Icon name={'envelope'} size={20} color={FontColor} />
            <TextInput
              value={email}
              keyboardType="email-address"
              onChangeText={text => {
                setError('');
                setEmail(text);
              }}
              placeholderTextColor={'#AEAEAE'}
              placeholder="Email"
              style={styles.input}
            />
          </View>

          {/* Phone no. */}
          <View style={[styles.inputBar, {backgroundColor: ThemeColor}]}>
            <Icon name={'mobile-screen'} size={20} color={FontColor} />
            <TextInput
              value={phone}
              keyboardType="numeric"
              onChangeText={text => {
                setError('');
                setPhone(text);
              }}
              placeholderTextColor={'#AEAEAE'}
              placeholder="Phone Number"
              style={styles.input}
            />
          </View>

          {/* Validation error */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Signup button */}
          <Pressable
            onPress={handleSignup}
            style={[styles.btn, {marginTop: error ? 15 : 30}]}>
            <Text style={styles.btnText}>Sign Up</Text>
          </Pressable>

          {/* Login navigation */}
          <Pressable
            onPress={() => navigation.navigate('Login', {})}
            style={styles.loginContainer}>
            <Text style={[styles.haveAccountLabel, {color: FontColor}]}>
              Already have an account?{'  '}
              <Text style={styles.loginLabel}>Login</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  headContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    maxWidth: 520,
    alignSelf: 'center',
    paddingHorizontal: 5,
    position: 'relative',
    bottom: -20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: sc(13) > 18 ? 20 : 14,
  },
  inputBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: sc(50),
    maxHeight: 75,
    alignSelf: 'center',
    borderRadius: 10,
    width: '80%',
    maxWidth: 520,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 1,
  },
  errorText: {
    color: 'red',
    alignSelf: 'center',
    marginTop: 10,
    fontSize: sc(13) > 18 ? 20 : 14,
  },
  btn: {
    backgroundColor: '#4287f5',
    padding: 10,
    height: sc(50),
    maxHeight: 75,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    width: '80%',
    maxWidth: 520,
    marginTop: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 3,
  },
  btnText: {
    color: '#fff',
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  loginContainer: {
    marginTop: 40,

    paddingBottom: 30,
  },
  haveAccountLabel: {
    color: '#484848',
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: sc(13) > 18 ? 20 : 15,
  },
  loginLabel: {
    color: '#1d9bf0',
  },
});

export default Signup;
