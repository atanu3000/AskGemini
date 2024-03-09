import { TextStyle, useColorScheme } from "react-native";
import { useTheme } from "./Context/ThemeContext";

const getMarkdownStyle = (): {[key: string]: TextStyle} => {
  const {theme} = useTheme();
  const colorScheme = theme;
  
  return {
    strong: {
      fontWeight: 'bold',
    },
    em: {
      fontStyle: 'italic',
    },
    link: {
      color: colorScheme === 'dark' ? 'skyblue' : 'blue', 
    },
    body: {
      color: colorScheme === 'dark' ? '#fff' : '#000', 
      fontSize: 15,
      lineHeight: 20,
    },
    code_block: {
      color: '#fff',
      backgroundColor: '#000',
      padding: 10,
      borderRadius: 7,
      marginVertical: 10,
      borderColor: '#000',
    },
    code_inline: {
      color: '#000',
      backgroundColor: colorScheme === 'dark' ? '#aaa' : '#ccc',
    },
  };
};

export default getMarkdownStyle;
