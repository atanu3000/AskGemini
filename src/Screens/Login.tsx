import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Platform,
  StatusBar,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';

// Navigation
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../routes/AuthStack';
import {useAppwrite} from '../appwrite/AppwriteContext';
import Loading from '../Components/Loading';
import {useTheme} from '../Context/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome6';
import LottieView from 'lottie-react-native';
import { sc } from '../assets/Styles/Dimensions';

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const Login = ({navigation}: LoginScreenProps) => {
  const {theme} = useTheme();
  const ThemeColor = theme === 'dark' ? '#222831' : '#fff';
  const FontColor = theme === 'dark' ? '#ddd' : '#333';
  const barStyle = theme === 'dark' ? 'light-content' : 'dark-content';
  const {appwrite} = useAppwrite();

  const [error, setError] = useState<string>('');

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPasswordHide, setIsPasswordHide] = useState<boolean>(true);

  const handleLogin = () => {
    if (email.length < 1 || password.length < 1) {
      setError('All fields are required');
    } else {
      setIsLoading(true);
      const user = {
        email,
        password,
      };

      appwrite
        .LoginAccount(user)
        .then(response => {
          if (response) {
            setIsLoading(false);
            navigation.reset({
              index: 0,
              routes: [{ name: 'Welcome' }],
            });
          }
        })
        .catch(e => {
          console.log(e);
          setIsLoading(false);
          setError('Incorrect email or password');
        })
    }
  };

  if (isLoading) return <Loading />;

  return (
    <LinearGradient
      colors={['#ffffff00', '#a7c2fc'+`${theme === 'dark' ? '44' : '88'}`]}
      style={[styles.container, {backgroundColor: ThemeColor}]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <StatusBar backgroundColor={ThemeColor} barStyle={barStyle} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headContainer}>
            <View style={{width: '50%'}}>
              <Text style={{fontSize: sc(30) > 40 ? 60 : sc(30), fontWeight: '500', color: FontColor}}>
                Sign in
              </Text>
              <Text style={{fontSize: sc(14) > 20 ? 23 : 16, color: FontColor}}>
                Access to your account
              </Text>
            </View>
            <LottieView
              source={require('../assets/signin-animation.json')}
              style={{height: sc(190), width: sc(190), maxHeight: 320, maxWidth: 320}}
              autoPlay
              loop
            />
          </View>

          {/* Email */}
          <View style={[styles.inputBar, {backgroundColor: ThemeColor}]}>
            <Icon name={'envelope'} size={20} color={FontColor} />
            <TextInput
              keyboardType="email-address"
              value={email}
              onChangeText={text => setEmail(text)}
              placeholderTextColor={'#AEAEAE'}
              placeholder="Email"
              style={[styles.input, {color: FontColor}]}
            />
          </View>

          {/* Password */}
          <View style={[styles.inputBar, {backgroundColor: ThemeColor}]}>
            <Icon name={'lock'} size={20} color={FontColor} />
            <TextInput
              value={password}
              onChangeText={text => setPassword(text)}
              placeholderTextColor={'#AEAEAE'}
              placeholder="Password"
              style={[styles.input, {color: FontColor}]}
              secureTextEntry={isPasswordHide}
            />
            <TouchableWithoutFeedback
              onPress={() => setIsPasswordHide(!isPasswordHide)}>
              <Icon
                name={isPasswordHide ? 'eye' : 'eye-slash'}
                size={20}
                color={FontColor}
              />
            </TouchableWithoutFeedback>
          </View>

          {/* Validation error */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Login button */}
          <Pressable
            onPress={handleLogin}
            style={[styles.btn, {marginTop: error ? 15 : 30}]}>
            <Text style={styles.btnText}>Sign in</Text>
          </Pressable>

          {/* Sign up navigation */}
          <Pressable
            onPress={() => navigation.navigate('Signup')}
            style={styles.signUpContainer}>
            <Text style={[styles.noAccountLabel, {color: FontColor}]}>
              Don't have an account?{'  '}
              <Text style={styles.signUpLabel}>Create an account</Text>
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
  signUpContainer: {
    marginTop: 40,
    
    paddingBottom: 30,
  },
  noAccountLabel: {
    color: '#484848',
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: sc(13) > 18 ? 20 : 15,
  },
  signUpLabel: {
    color: '#1d9bf0',
  },
});

export default Login;
