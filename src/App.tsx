import React from 'react';
import ChatProvider from './Context/ChatProvider';
import MainContainer from './MainContainer';
import {ThemeProvider} from './Context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <ChatProvider>
        <MainContainer />
      </ChatProvider>
    </ThemeProvider>
  );
}
