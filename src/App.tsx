import React from 'react';
import ChatProvider from './Context/ChatProvider';
import MainContainer from './MainContainer';

export default function App() {

return(
  <ChatProvider>
    <MainContainer />
  </ChatProvider>
)

}
