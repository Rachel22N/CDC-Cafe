import { createTheme, ThemeProvider } from '@mui/material/styles';
import { pink,grey,blue } from '@mui/material/colors';

const ColorTheme = createTheme({
  palette: {
    primary: {
      main: pink[50],
    },
    text: {
      primary: '#000',
      secondary: 'rgba(0, 0, 0, 0.7)',
    },
  },
  typography: {
    // fontFamily: 'fantasy',
    // fontFamily: 'Courier New',
    fontFamily: 'inherit',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
  components: {
    MuiInputLabel: {
        styleOverrides: {
          root: {
            // 默认状态下的颜色
            color: grey[700],
            '&.Mui-focused': {
              // 获得焦点时的颜色
              color: pink[300],
            },
          },
        },
      },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: grey[700], // 鼠标悬浮时的颜色
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: pink[300], // 获得焦点时的颜色
          },
        },
      },
    },
  },

});

export default ColorTheme;