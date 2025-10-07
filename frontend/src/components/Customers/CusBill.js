import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import ColorTheme from '../Theme';
import './CusBill.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Dialog, DialogContent, DialogTitle, IconButton,  DialogContentText, DialogActions } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AppleIcon from '@mui/icons-material/Apple';
import { pink } from '@mui/material/colors';
import { Card } from '@mui/material';
import DeleteButton4 from '../Buttons/DeleteButton4';
import Header from './Header';
// import delete_png from '../Buttons/deletebutton.png';

function CusBill() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tableNumber = '', numberOfPeople = '' } = location.state || {};
  const [billItems, setBillItems] = useState([]);
  const[alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    if (tableNumber) {
      fetch('http://localhost:5000/get_bill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order_id: tableNumber }),
      })
      .then(response => response.json())
      .then(data => {
        console.log('bill items: ', data.bill);
        setBillItems(data.bill);
      })
      .catch(error => {
        console.error('Error fetching cart items:', error);
      });
    }
  }, [tableNumber]);

  //cancel button click here
  const handleCancelDish = (id) => {
    fetch('http://localhost:5000/cancel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ BillDetailID: id }),
    })
    .then(response => {
      if (response.ok) {
        console.log('Cancel success');
        setBillItems(currentItems => currentItems.filter(item => item.BillDetailID !== id));
      } else {
        throw new Error('Failed to cancel the item.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      // alert('This order has been cooked.');
      setAlertMessage('This order has been cooked.');
      setAlertOpen(true);
    });
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  }

  const handleContinueOrder = () => {
    navigate('/mainmenu', { state: { tableNumber, numberOfPeople } });
  };

  const [open, setOpen] = useState(false);

  const totalPrice = billItems.reduce((acc, item) => acc + (parseFloat(item.Price) * item.Quantity), 0).toFixed(2);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePayment = (payMethod) => {
    // http://localhost:5000/payment
    fetch('http://localhost:5000/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ order_id: tableNumber }),
    })
    .then(response => {
      console.log(response);
      if (response.ok) {
        navigate('/');
      } else {
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
            <Card sx={{
              fontSize:'20px',
              marginTop:'20px',
              paddingBottom:'20px',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(10px)', 
              boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .2)', 
              transition: 'all 0.3s ease', 
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              }}>
              <h2>Bill</h2>
              <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%',
                }}>
              {billItems.map((item) => (
                <div style={{
                  margin:'10px', 
                  width:'350px',
                  display:'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',}}
                  key={item.BillDetailID}>
                  <div>
                    {item.Title}: ${item.Price} x {item.Quantity}
                  </div>
                  <div>
                    <DeleteButton4 variant="contained" 
                    onClick={() => handleCancelDish(item.BillDetailID)}
                    > 
                    Cancel
                    </DeleteButton4>
                  </div>
                </div>
              ))}
              <div style={{width:'100%'}}>
                <hr />
              </div>
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
              </div>
            </Card>
          </div>
          
          <Dialog
            open={alertOpen}
            onClose={handleCloseAlert}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Notification"}</DialogTitle>
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