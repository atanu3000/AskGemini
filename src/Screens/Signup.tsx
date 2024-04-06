import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
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

type SignupScreenProps = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

const Signup = ({navigation}: SignupScreenProps) => {
  const {theme} = useTheme();
  const ThemeColor = theme === 'dark' ? '#212121' : '#fff';
  const FontColor = theme === 'dark' ? '#ddd' : '#333';
  const barStyle = theme === 'dark' ? 'light-content' : 'dark-content';
  const {appwrite, setIsLogedin} = useAppwrite();

  const [error, setError] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [repeatPassword, setRepeatPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPasswordHide, setIsPasswordHide] = useState<boolean>(true);

  const handleSignup = () => {
    if (
      name.length < 1 ||
      email.length < 1 ||
      password.length < 1 ||
      repeatPassword.length < 1
    ) {
      setError('All fields are required');
    } else if (password.length < 8) {
      setError('Passwords length must be 8 characters');
    } else if (password !== repeatPassword) {
      setError('Passwords must be same');
    } else {
      setIsLoading(true);
      const user = {
        email,
        password,
        name,
      };

      appwrite
        .CreatAccount(user)
        .then(_ => {
          setIsLogedin(true);
          setIsLoading(false);
          ToastAndroid.show('Signup success', ToastAndroid.SHORT);
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
      colors={['#ffffff00', '#a7c2fc77']}
      style={[styles.container, {backgroundColor: ThemeColor}]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <StatusBar backgroundColor={ThemeColor} barStyle={barStyle} />
        <View style={styles.formContainer}>
          <View style={styles.headContainer}>
            <View style={{width: '50%'}}>
              <Text style={{fontSize: 36, fontWeight: '500', color: FontColor}}>
                Sign up
              </Text>
              <Text style={{fontSize: 16, color: FontColor}}>
                Create a new account
              </Text>
            </View>
            <LottieView
              source={require('../assets/signin-animation.json')}
              style={{height: 220, width: 220}}
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

          {/* Password */}
          <View style={[styles.inputBar, {backgroundColor: ThemeColor}]}>
            <Icon name={'lock'} size={20} color={FontColor} />
            <TextInput
              value={password}
              onChangeText={text => {
                setError('');
                setPassword(text);
              }}
              placeholderTextColor={'#AEAEAE'}
              placeholder="Password"
              secureTextEntry={isPasswordHide}
              style={styles.input}
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

          {/* Repeat password */}
          <View style={[styles.inputBar, {backgroundColor: ThemeColor}]}>
            <Icon name={'lock'} size={20} color={FontColor} />
            <TextInput
              secureTextEntry={isPasswordHide}
              value={repeatPassword}
              onChangeText={text => {
                setError('');
                setRepeatPassword(text);
              }}
              placeholderTextColor={'#AEAEAE'}
              placeholder="Repeat Password"
              style={styles.input}
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

          {/* Signup button */}
          <Pressable
            onPress={handleSignup}
            style={[styles.btn, {marginTop: error ? 15 : 30}]}>
            <Text style={styles.btnText}>Sign Up</Text>
          </Pressable>

          {/* Login navigation */}
          <Pressable
            onPress={() => navigation.navigate('Login')}
            style={styles.loginContainer}>
            <Text style={styles.haveAccountLabel}>
              Already have an account?{'  '}
              <Text style={styles.loginLabel}>Login</Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    height: '100%',
  },
  headContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    alignSelf: 'center',
    paddingHorizontal: 5,
    position: 'relative',
    bottom: -20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
  },
  inputBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 60,
    alignSelf: 'center',
    borderRadius: 10,
    width: '80%',
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
  },
  btn: {
    backgroundColor: '#4287f5',
    padding: 10,
    height: 60,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    width: '80%',
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
    marginTop: 60,
  },
  haveAccountLabel: {
    color: '#484848',
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },
  loginLabel: {
    color: '#1d9bf0',
  },
});

export default Signup;
