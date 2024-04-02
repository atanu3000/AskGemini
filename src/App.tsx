import React from 'react';
import ChatProvider from './Context/ChatProvider';
import {ThemeProvider} from './Context/ThemeContext';
import {AppwriteProvider} from './appwrite/AppwriteContext';
import { Router } from './routes/Router';

export default function App() {
  return (
    <AppwriteProvider>
      <ThemeProvider>
        <ChatProvider>
          <Router />
        </ChatProvider>
      </ThemeProvider>
    </AppwriteProvider>
  );
}
