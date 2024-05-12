import { TextStyle, useColorScheme } from "react-native";
import { useTheme } from "./Context/ThemeContext";
import { sc } from "./assets/Styles/Dimensions";

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
      fontSize: sc(13) > 19 ? 19 : sc(13),
      lineHeight: sc(18) > 27 ? 27 : sc(18),
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
