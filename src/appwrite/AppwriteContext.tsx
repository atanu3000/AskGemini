import React, {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react';

import Appwrite from './service';

type AppwriteContextType = {
  appwrite: Appwrite;
  isLogedin: boolean;
  setIsLogedin: (isLogedin: boolean) => void;
};

const AppwriteContext = createContext<AppwriteContextType>({
  appwrite: new Appwrite(),
  isLogedin: false,
  setIsLogedin: () => {},
});

//Custome Context of AppwriteContext
export const useAppwrite = () => {
  return useContext(AppwriteContext);
};

export const AppwriteProvider: FC<PropsWithChildren> = ({children}) => {
  const [isLogedin, setIsLogedin] = useState(false);
  const defaultValue = {
    appwrite: new Appwrite(),
    isLogedin,
    setIsLogedin,
  };
  return (
    <AppwriteContext.Provider value={defaultValue}>
      {children}
    </AppwriteContext.Provider>
  );
};

// export default AppwriteContext;
