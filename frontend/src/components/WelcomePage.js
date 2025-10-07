import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import Button from '@mui/material/Button';
// import { styled } from '@mui/system';
import LoginButton from './Managers/LoginButton';
import logo from "./logo.png";
import './WelcomePage.css';
import{ ThemeProvider } from '@mui/material/styles';
import ColorTheme from './Theme';

// const LoginButton = styled(Button)({
//   position: 'absolute',
//   top: '20px',
//   right: '20px',
//   width: '60px',
//   height: '60px',
//   borderRadius: '50%',
//   cursor: 'pointer',
//   fontWeight: '700',
//   fontFamily: 'Arial',
// });

function WelcomePage() {
  let navigate = useNavigate();

  useEffect(() => {
    const handlePageClick = (event) => {
      if (event.target.id !== 'login-button') {
        navigate('/tablenumber');
      }
    };

    document.addEventListener('click', handlePageClick);

    return () => {
      document.removeEventListener('click', handlePageClick);
    };
  }, [navigate]);

  const handleLoginClick = () => {
    navigate('/loginpage');
  };

  return (
    <ThemeProvider theme={ColorTheme}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
            <h1>Welcome to CDC!</h1>
            <h5>Please tap the screen to start ordering</h5>
          <LoginButton id="login-button" variant="contained" onClick={handleLoginClick}>
            Login
            </LoginButton>
        </header>
      </div>
    </ThemeProvider>
  );
}

export default WelcomePage;
