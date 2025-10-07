import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import ColorTheme from '../Theme';
import logo from './logo.png';
import './CusBill.css';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Dialog, DialogContent, DialogTitle, IconButton, AppBar, Toolbar, Typography, Box, Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import AppleIcon from '@mui/icons-material/Apple';
import { pink } from '@mui/material/colors';
import { Card, CardMedia } from '@mui/material';
import DeleteButton2 from '../Buttons/DeleteButton2';
import delete_png from '../Buttons/deletebutton.png';

function Header() {
  const navigate = useNavigate();

  const location = useLocation();
  console.log(location);
  const { tableNumber = '', numberOfPeople = '' } = location.state || {};

  const handleCancelDish = () => {

  };
  
  const handleLogoClick = (event) => {
    event.stopPropagation();
    navigate('/');
  };

  const handleBillClick = () => {
    // navigate('/cusbill', { state: { tableNumber, numberOfPeople } });
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
        alert('The waiter has been called. Please wait.');
      } else {
        console.error('An error occurred while requesting the service.');
      }
    } catch (error) {
      console.error('Error occurred:', error);
    }
  };

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
              <IconButton id="bill-button" onClick={handleBillClick} color="inherit">
                <ReceiptIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

function CusBill() {

  const navigate = useNavigate();
  const location = useLocation();
  const { items } = location.state || {};

  const { tableNumber = '', numberOfPeople = '' } = location.state || {};

  console.log('items: ', items);

  const handleContinueOrder = () => {
    navigate('/mainmenu', { state: { tableNumber, numberOfPeople } });
  };

  const [open, setOpen] = useState(false);

  const totalPrice = items.bill.reduce((acc, item) => acc + (parseFloat(item.Price) * item.Quantity), 0).toFixed(2);

  // 弹窗打开关闭的函数
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePayment = (payMethod) => {
    // http://localhost:5000/payment
    // 发送 POST 请求到后端
    fetch('http://localhost:5000/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ order_id: tableNumber }), //后续要加上payMethod
    })
    .then(response => {
      console.log(response);
      if (response.ok) {
        // 请求成功后导航回主页面
        navigate('/');
      } else {
        // 处理错误情况
        console.error('Failed to clear order');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  return (
    <ThemeProvider theme={ColorTheme}>
      <div className="background">
        <Header />
        <div className="content-container">
          <div className="text-container">
            {/* <Card sx={{
              fontSize:'20px',
              marginTop:'20px',
              paddingBottom:'20px',}}> */}
              {/* <Grid> */}
              <h2>Bill Title</h2>
              
              {items.bill.map((item) => (
                  <div style={{margin:'10px'}}
                    key={`bill-item-${item.billDetailID}`}>
                    {item.Title}: ${item.Price} x {item.Quantity}
                  </div>
                  // {/* <div>
                  // <DeleteButton2 variant="contained" >
                  //   <CardMedia component="img" sx={{ position: 'absolute', width: '100%', height: '70%', objectFit: 'contain' }} image={delete_png} />
                  // </DeleteButton2>
                  // </div> */}
              ))}
              <hr />

              <div>
                Total Price: ${totalPrice}
              </div>
                
              <div className="cart-actions" style={{marginTop:'20px'}}>
                <Button variant="contained" onClick={handleContinueOrder} className='continue-button'>
                  Continue to Order
                </Button>
                <Button variant="contained" onClick={handleClickOpen} className='choose-payment-button'>
                  Choose Payment
                </Button>
              </div>
              {/* </Grid> */}
            {/* </Card> */}
          </div>


          <Dialog open={open} onClose={handleClose} className='close-button'>
            <DialogTitle>
              <IconButton className="closeButton" onClick={handleClose}>
                <CloseIcon />
              </IconButton>
              Choose your payment method
            </DialogTitle>
            <DialogContent>
              <Button className="paymentButton" variant="outlined" 
              sx={{color:pink[200]}}
              startIcon={<AppleIcon />} onClick={() => handlePayment('Apple Pay')}>
                Apple Pay
              </Button>
              <Button 
              sx={{color:pink[200]}}
              className="paymentButton" variant="outlined" onClick={() => handlePayment('Credit Card')}>
                Credit Card
              </Button>
              <div className="cashSection" onClick={() => handlePayment('Cash')}>
                <p>If you want to pay in cash, you need to wait for the waiter</p>
                <Button 
              sx={{color:pink[200]}}
              className="cashButton">Cash</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default CusBill;