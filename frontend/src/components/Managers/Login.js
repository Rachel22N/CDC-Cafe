import './Login.css';
import React from 'react';
import{ ThemeProvider } from '@mui/material/styles';
import ColorTheme from '../Theme';
import logo from './logo.png';
// import LoginButton from './LoginButton';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import Button from '@mui/material/Button';
import { pink } from '@mui/material/colors';
import { grey } from '@mui/material/colors';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

function Login() {
  let navigate = useNavigate();
  const theme = useTheme();

//   const handleLoginClick = () => {
//     navigate('/loginpage');
//   };
  const handleLogoClick = (event) => {
    event.stopPropagation();
    navigate('/');
  };
  const handleManLoginClick = () => {
    navigate('/managerloginpage');
  }
  const handleKitLoginClick = () => {
    navigate('/kitchenloginpage');
  }
  const handleWaitLoginClick = () => {
    navigate('/waiterloginpage');
  }
  const SelectButton = styled(Button)({
    // borderColor: pink[300], 
    width: '250px',
    // height:'40px',
    backgroundColor: grey[700], 
    '&:hover': {
      backgroundColor: pink[100], 
    },
    fontColor: 'white',
    fontWeight: 'bolder',
    fontFamily: 'Arial',
    borderRadius: '1%',

  });
  
  return (
    <ThemeProvider theme={ColorTheme}>
      <div className='background-login'>
        <div className="Login-page">
          <img src={logo} className="Login-logo" alt="logo" onClick={handleLogoClick}/>
          {/* <LoginButton id="login-button" variant="contained" onClick={handleLoginClick}>
            Login
          </LoginButton> */}
        </div>
      <Box
      sx={{
        height: '450px',
        width: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '40px auto 0 auto',
        borderRadius: '1%',
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)',
        [theme.breakpoints.down('sm')]: {
          width: '380px', // small screen
          height: '500px',
        },
        // border: 'solid 3px #cecccc',
      }}
      >
        <div className='Login-body'>
          <h1>Hello! Dear CDCer~</h1>
          {/* <h1>Welcome to CDC!</h1> */}
          <h3>Please select your title</h3>
          <div className='Select-button'>
          <SelectButton variant="outlined" onClick={handleManLoginClick} 
            sx={{ mt: 2, mb: 2, 
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)',
            }}>
            Manager
            </SelectButton>
          <SelectButton variant="outlined" onClick={handleKitLoginClick} sx={{ mt: 2, mb: 2 }}>Kitchen Staff</SelectButton>
          <SelectButton variant="outlined" onClick={handleWaitLoginClick} sx={{ mt: 2, mb: 2 }}>Wait Staff</SelectButton>
          </div>
        </div>
      </Box>
      </div>
    </ThemeProvider>
  );
}

export default Login;

