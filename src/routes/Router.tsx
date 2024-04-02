import React, {useEffect, useState} from 'react';
import {useAppwrite} from '../appwrite/AppwriteContext';
import {NavigationContainer} from '@react-navigation/native';

//Routes
import {AppStack} from './AppStack';
import {AuthStack} from './AuthStack';

import Loading from '../Components/Loading';

export const Router = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {appwrite, isLogedin, setIsLogedin} = useAppwrite();
  console.log('loggedin :: ' + isLogedin);
  console.log('loading :: ' + isLoading);

  useEffect(() => {
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
      });
  }, [appwrite, setIsLogedin]);

  if (isLoading) {
    console.log(isLoading);
    return <Loading />;
  }

  return (
    <NavigationContainer>
      {isLogedin ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
