// import React, { useState } from 'react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Box, Button, Card, CardContent, Grid, ListItem, ListItemText, Toolbar, Typography, ThemeProvider, Icon } from '@mui/material';
import { grey, pink } from '@mui/material/colors';
import ColorTheme from '../Theme';
import logo from './logo.png';
import LoginButton from '../Managers/LoginButton';
import bgc from './bgc.png';

function WaiterPage() {
  let navigate = useNavigate();

  const [serviceCalls, setServiceCalls] = useState([]);
  const [orders, setOrders] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseCalls = await fetch('http://localhost:5000/api/waitercalls');
        const dataCalls = await responseCalls.json();
        if (responseCalls.ok) {
          setServiceCalls(dataCalls);
        } else {
          console.error('Failed to fetch service calls.');
        }
      } catch (error) {
        console.error('Error fetching service calls:', error);
      }

      try {
        const responseOrders = await fetch('http://localhost:5000/waiter_view');
        const dataOrders = await responseOrders.json();
        if (responseOrders.ok) {
          setOrders(dataOrders.waiter);
        } else {
          console.error('Failed to fetch orders.');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleServiceCall = async (callId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/waitercalls/${callId}`, {
        method: 'PUT',
      });

      if (response.ok) {
        setServiceCalls(prev => prev.filter(call => call.WaiterCallID !== callId));
        // console.log(serviceCalls);
        return;
      } else {
        console.error('Marking a Service Call as Processed Failed.');
      }
    } catch (error) {
      console.error('error occurs:', error);
    }
  };

  const toggleOrderCompletion = (kitchenComId) => {
    // const order = orders[index];
    const order = orders.find(order => order.KitchenComID === kitchenComId);
    if (!order) {
      console.error('Order not found');
      return;
    }
    fetch('http://localhost:5000/waiter_comp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        KitchenComID: kitchenComId,
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(() => {
      setOrders((prevOrders) => prevOrders.filter((o) => o.KitchenComID !== kitchenComId));
    })
    .catch(error => {
      console.error('Error completing order:', error);
    });
  };
  

  const handleLogoutClick = () => {
    sessionStorage.setItem('isAuthenticated', JSON.stringify(false));
    sessionStorage.setItem('role', 'Customer');
    navigate('/loginpage');
  };

  return (
    <ThemeProvider theme={ColorTheme}>
      <div style={{ 
        backgroundImage: `url(${bgc})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        minHeight: '100vh'
      }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Box
              component="img"
              sx={{
                height: '60px',
                width: '60px',
                cursor: 'pointer',
              }}
              src={logo}
              alt="logo"
              onClick={handleLogoutClick} 
            />
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Waiter Page
            </Typography>
            <LoginButton
              variant="contained"
              onClick={handleLogoutClick}
            >
              Log out
            </LoginButton>
          </Toolbar>
        </AppBar>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            marginTop: '20px',
          }}
        >
          <Toolbar />
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              {serviceCalls.map(call => (
                <ListItem 
                  key={call.WaiterCallID}
                >
                  <ListItemText primary={`Table ${call.TableID}`} />
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleServiceCall(call.TableID)}
                  >
                    Done
                  </Button>
                </ListItem>
              ))}
            </Grid>

            <Grid item xs={12} md={8}>
              {Array.isArray(orders) && orders.map((order) => (
                <Card sx={{ minHeight: 100, mb: 2 }} key={order.KitchenComID}>
                  <CardContent
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="h5" component="div">
                      {`Table ${order.TableID}: ${order.Title} x${order.Quantity}`}
                    </Typography>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<Icon>check_circle_outline</Icon>}
                      sx={{ backgroundColor: pink[200] }}
                      onClick={() => toggleOrderCompletion(order.KitchenComID)}
                    >
                      Mark as Done
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Grid>
          </Grid>
        </Box>
      </div>
    </ThemeProvider>
    
  );
}

export default WaiterPage;
