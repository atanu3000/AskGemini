import React, {useEffect, useState} from 'react';
import {useAppwrite} from '../appwrite/AppwriteContext';
import {NavigationContainer} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';

//Routes
import {AppStack} from './AppStack';
import {AuthStack} from './AuthStack';

import Loading from '../Components/Loading';
import Offline from '../Screens/Offline';

export const Router = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {appwrite, isLogedin, setIsLogedin} = useAppwrite();
  const [isOnline, setIsOnline] = useState<boolean | null>(true);
  // console.log('loggedin :: ' + isLogedin);
  // console.log('loading :: ' + isLoading);

  // useEffect(() => {
    // const checkConnection = NetInfo.addEventListener(state => {
    //   setIsOnline(state.isConnected);
    // });

  //   return () => {
  //     checkConnection();
  //   };
  // }, []);
  // console.log(isOnline);

  useEffect(() => {
    NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
    });
    
    if (isOnline) {
      appwrite
      .GetCurrentUser()
      .then(user => {
        if (user) {
          setIsLogedin(true);
          setIsLoading(false);
        }
      })
      .catch(_ => {
        setIsLoading(false);
        setIsLogedin(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
    }
  }, [appwrite, setIsLogedin]);

  if (isLoading) return <Loading />;

  return (
    <NavigationContainer>
      {isOnline ? isLogedin ? <AppStack /> : <AuthStack /> : <Offline />}
    </NavigationContainer>
  );
};
