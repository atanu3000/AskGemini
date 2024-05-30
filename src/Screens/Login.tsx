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
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';

// Navigation
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../routes/AuthStack';
import {useAppwrite} from '../appwrite/AppwriteContext';
import Loading from '../Components/Loading';
import {useTheme} from '../Context/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome6';
import LottieView from 'lottie-react-native';
import {sc} from '../assets/Styles/Dimensions';

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const Login = ({navigation, route}: LoginScreenProps) => {
  const {userEmail} = route.params;
  const {theme} = useTheme();
  const ThemeColor = theme === 'dark' ? '#222831' : '#fff';
  const FontColor = theme === 'dark' ? '#ddd' : '#333';
  const barStyle = theme === 'dark' ? 'light-content' : 'dark-content';
  const {appwrite, setIsLogedin} = useAppwrite();

  const [error, setError] = useState<string>('');

  const [emailOrPhone, setEmailOrPhone] = useState<string>(userEmail as string);
  const [OTP, setOTP] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOTPsent, setIsOTPsent] = useState<boolean>(false);
  const [sessionToekn, setSessionToekn] = useState<string>('');
  const OTPinputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (OTPinputRef.current) {
      OTPinputRef.current.focus();
      console.log('Keyboard focused');
    }
  }, [isOTPsent]);

  const requestForOTP = () => {
    if (emailOrPhone.length < 1) {
      setError('Enter your email address');
    } else {
      setIsLoading(true);

      appwrite
        .LoginAccount(emailOrPhone)
        .then(response => {
          if (response) {
            setIsLoading(false);
            setSessionToekn(response.userId);
            console.log(response.userId);
          }
        })
        .catch(e => {
          console.log(e);
          setIsLoading(false);
          setError('User not found');
        })
        .finally(() => {
          setIsOTPsent(true);
          setError('');
        });
    }
  };

  const createSession = () => {
    if (OTP.length < 1) {
      setError('Enter OTP first');
    } else if (OTP.length !== 6) {
      setError('Enter your 6 digit OTP');
    } else {
      setIsLoading(true);
      appwrite
        .createSession(sessionToekn, OTP)
        .then(response => {
          if (response) {
            setIsLoading(false);
            // console.log(response);

            navigation.reset({
              index: 0,
              routes: [{name: 'Welcome'}],
            });
          }
        })
        .catch(error => {
          console.log(error);
          setIsLoading(false);
          setError('Invalid OTP entered');
        })
        .finally(() => {
          appwrite.GetCurrentUser().then(response => {
            if (response) {
              !response.name && appwrite.updateName(emailOrPhone.split('@')[0]);
            }
          });
        });
    }
  };

  // if (isLoading) return <Loading />;

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
                {isOTPsent ? 'Enter OTP' : 'Sign in'}
              </Text>
              <Text style={{fontSize: sc(14) > 20 ? 23 : 16, color: FontColor}}>
                Access to your account
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

          <View>
            {/* Email */}
            <View style={[styles.inputBar, {backgroundColor: ThemeColor}]}>
              <Icon name={'envelope'} size={20} color={FontColor} />
              <TextInput
                autoFocus={true}
                keyboardType="email-address"
                value={emailOrPhone}
                onChangeText={text => {
                  setEmailOrPhone(text);
                  setError('');
                }}
                placeholderTextColor={'#AEAEAE'}
                placeholder="Email"
                editable={!isOTPsent}
                style={[styles.input, {color: FontColor}]}
              />
            </View>

            <View
              style={[
                styles.inputBar,
                {backgroundColor: isOTPsent ? ThemeColor : '#bbb'},
              ]}>
              <Icon name={'key'} size={20} color={FontColor} />
              <TextInput
                // ref={OTPinputRef}
                keyboardType="number-pad"
                value={OTP}
                onChangeText={text => setOTP(text)}
                placeholderTextColor={'#AEAEAE'}
                placeholder="Ex.: 986745"
                editable={isOTPsent}
                style={[styles.input, {color: FontColor}]}
              />
            </View>

            {/* Validation error */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Login button */}
            {isOTPsent ? (
              <Pressable
                onPress={createSession}
                style={[styles.btn, {marginTop: error ? 15 : 30}]}>
                <Text style={styles.btnText}>
                  {isLoading ? 'Verifing...' : 'Verify OTP'}
                </Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={requestForOTP}
                style={[styles.btn, {marginTop: error ? 15 : 30}]}>
                <Text style={styles.btnText}>
                  {isLoading ? 'Requesting...' : 'Request for OTP'}
                </Text>
              </Pressable>
            )}

            {/* Sign up navigation */}
            {isOTPsent ? (
              <Pressable
                onPress={() => {
                  setIsOTPsent(false);
                  setError('');
                }}
                style={styles.signUpContainer}>
                <Text style={[styles.textStyle, {color: FontColor}]}>
                  Didn't get a code?{'  '}
                  <Text style={styles.signUpLabel}>resend</Text>
                </Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => navigation.navigate('Signup')}
                style={styles.signUpContainer}>
                <Text style={[styles.textStyle, {color: FontColor}]}>
                  Don't have an account?{'  '}
                  <Text style={styles.signUpLabel}>Create an account</Text>
                </Text>
              </Pressable>
            )}
          </View>
          {/* )} */}
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
  textStyle: {
    color: '#484848',
    alignSelf: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: sc(13) > 18 ? 20 : 15,
    // width: '80%',
  },
  signUpLabel: {
    color: '#1d9bf0',
  },
});

export default Login;
