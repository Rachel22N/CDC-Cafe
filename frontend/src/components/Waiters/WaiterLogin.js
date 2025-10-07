// import './Login.css';
import '../Managers/ManagerLogin.css';
import React from 'react';
import{ ThemeProvider } from '@mui/material/styles';
import ColorTheme from '../Theme';
import { useNavigate } from 'react-router-dom';
import logo from './logo.png';
import LoginButton from '../Managers/LoginButton';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginConfirmButton from '../Managers/LoginConfirmButton';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';

function WaiterLogin() {
  let navigate = useNavigate();
  const theme = useTheme();

  const handleLoginClick = () => {
    navigate('/loginpage');
  };
  const handleLogoClick = (event) => {
    event.stopPropagation();
    navigate('/');
  };

  const [isError, setIsError] = React.useState(false);
  const handleLoginConfirmClick = () => {
    // Send a POST request to the backend login port
    fetch('http://localhost:5000/waiterloginpage', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        username: document.getElementById('waiter-email').value,
        password: document.getElementById('waiter-password').value,
        role : 'Waiter'
    }),
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => {throw err});
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      sessionStorage.setItem('isAuthenticated', JSON.stringify(true));
      sessionStorage.setItem('role', 'Waiter');
      navigate('/waiterpage');
    })
    .catch((error) => {
      setIsError(true);
      document.getElementById('password-error-text').innerHTML = 'Invalid username or password'
      console.error('Error:', error);
    });
  }
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) =>!show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  } 
  return (
    <ThemeProvider theme={ColorTheme}>
      <div className='background-login'>
        <div className="Login-page">
          <img src={logo} className="Login-logo" alt="logo" onClick={handleLogoClick}/>
          <LoginButton id="login-button" variant="contained" onClick={handleLoginClick}>
            Login
          </LoginButton>
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
          // border: 'solid 3px #cecccc',
          flexDirection: 'column',
          [theme.breakpoints.down('sm')]: {
            width: '380px', // small screen
            height: '500px',
          },
        }}
        >
        <div className='Login-body-manager'>
          <h1>Hello! Dear staff!</h1>
          <Stack spacing={2} direction={'column'}>
            <FormControl variant="outlined" error={isError}>
            <InputLabel htmlFor="outlined-adornment-password"
            sx={{color: '#000', '&.Mui-focused': { color: '#000' }}}
            >Email</InputLabel>
            <OutlinedInput
            required
            id='waiter-email'
            label='required'
            />
            </FormControl>
            <FormControl variant="outlined" error={isError}>
              <InputLabel htmlFor="outlined-adornment-password"
              sx={{color: '#000', '&.Mui-focused': { color: '#000' }}}
              >Password</InputLabel>
              <OutlinedInput
                id="waiter-password"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                aria-describedby='password-error-text'
              />
              <FormHelperText id="password-error-text"></FormHelperText>
            </FormControl>
            <LoginConfirmButton sx={{ mt:4 }} onClick={handleLoginConfirmClick}>
              Log in
            </LoginConfirmButton>
            <Divider component='li' variant='middle' style={{ listStyleType: 'none' }}/>
            <div className='manager-hint'>
              <h4>
                If you don't have an account, 
              </h4>
              <h4>
                please contact the boss
              </h4>
            </div>
          </Stack>
        </div>

        </Box>
      </div>
    </ThemeProvider>
  );
}

export default WaiterLogin;
