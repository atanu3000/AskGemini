import { TextStyle, useColorScheme } from "react-native";

const getMarkdownStyle = (): {[key: string]: TextStyle} => {
  const colorScheme = useColorScheme();
  
  return {
    // heading1: {
    //   color: colorScheme === 'dark' ? 'blue' : 'darkblue', // Adjust color based on color scheme
    // },
    // heading2: {
    //   color: colorScheme === 'dark' ? 'green' : 'darkgreen', // Adjust color based on color scheme
    // },
    // heading3: {
    //   color: colorScheme === 'dark' ? 'red' : 'darkred', // Adjust color based on color scheme
    // },
    strong: {
      fontWeight: 'bold',
    },
    em: {
      fontStyle: 'italic',
    },
    link: {
      color: colorScheme === 'dark' ? 'purple' : 'darkpurple', // Adjust color based on color scheme
    },
    body: {
      color: colorScheme === 'dark' ? '#fff' : '#000', // Adjust color based on color scheme
      fontSize: 15,
      lineHeight: 20,
    },
    code_block: {
      color: '#fff',
      backgroundColor: '#000',
      padding: 10,
      borderRadius: 5,
      marginVertical: 10,
      borderColor: '#000',
      
    },
    code_inline: {
      color: '#000',
      backgroundColor: colorScheme === 'dark' ? '#aaa' : '#ccc',
    }
  };
};

export default getMarkdownStyle;
