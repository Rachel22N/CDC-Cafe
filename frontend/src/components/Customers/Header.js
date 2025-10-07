import React, { useEffect, useState } from 'react';
import { AppBar, ThemeProvider, Toolbar, Typography, Box, Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useLocation, useNavigate } from 'react-router-dom';
import { pink } from '@mui/material/colors';
import logo from './logo.png';
import ColorTheme from '../Theme';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tableNumber = '', numberOfPeople = '' } = location.state || {};
  const [cartItemCount, setCartItemCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const { pathname } = location;
  const[alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const quantities = JSON.parse(localStorage.getItem('quantities') || '{}');
    const itemCount = Object.values(quantities).reduce((sum, current) => sum + current, 0);
    console.log('Quantities:', quantities);
    console.log('Item Count:', itemCount);
    setCartItemCount(itemCount);
  }, [lastUpdate]);
  

  const handleLogoClick = (event) => {
    event.stopPropagation();
    navigate('/');
  };

  const handleCartClick = () => {
    navigate('/cartpage', { state: { tableNumber, numberOfPeople } });
  };

  const handleBillClick = () => {
    navigate('/cusbill', { state: { tableNumber, numberOfPeople } });
  };
  
  const handleCallWaiter = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/waitercalls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tableId: tableNumber })
      });

      if (response.ok) {
        setAlertMessage('The waiter has been called. Please wait a second.');
        setAlertOpen(true);
      } else {
        console.error('An error occurred while requesting the service.');
      }
    } catch (error) {
      console.error('Error occurred:', error);
    }
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  }

  return (
    <ThemeProvider theme={ColorTheme}>
      <AppBar position="fixed" sx={{ backgroundColor: '#fce4ec', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Box
                component="img"
                sx={{
                  cursor: 'pointer',
                  height: '60px', 
                  width: '60px',
                }}
                src={logo}
                alt="logo"
                onClick={handleLogoClick}
              />
            </Grid>
            <Grid item>
              <Typography variant="h6" noWrap>
                Table {tableNumber} <PeopleAltIcon /> {numberOfPeople}
              </Typography>
            </Grid>
            <Grid item>
              <IconButton onClick={handleCallWaiter} color="inherit">
                <Typography>Call Waiter</Typography>
              </IconButton>
            </Grid>
            <Grid item>
              {pathname !== '/cusbill' && (
                <IconButton id="cart-button" onClick={handleCartClick} color="inherit">
                <ShoppingCartIcon />
                {cartItemCount > 0 && `(${cartItemCount})`}
              </IconButton>
              )} 
              <IconButton id="bill-button" onClick={handleBillClick} color="inherit">
                <ReceiptIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Dialog
        open={alertOpen}
        onClose={handleCloseAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Dear Customer"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" >
            {alertMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlert} sx={{ color: pink[200] }} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default Header;
