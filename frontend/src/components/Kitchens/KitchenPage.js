import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Box, Button, Card, CardContent, Grid, Toolbar, Typography, ThemeProvider } from '@mui/material';
import { pink, grey } from '@mui/material/colors';
import ColorTheme from '../Theme';
import logo from './logo.png';
import LoginButton from '../Managers/LoginButton';
import bgc from './bgc.png'

function KitchenPage() {
  let navigate = useNavigate();
  const [tasks, setTasks] = useState({});

  useEffect(() => {
    const fetchTasks = () => {
      fetch('http://localhost:5000/kitchen_view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const allOrders = data.kitchen.map(item => ({
          KitchenDetailID: item.KitchenDetailID,
          menuItemId: item.MenuItemID,
          quantity: item.Quantity,
          title: item.Title,
          tableId: item.TableID,
          status: item.ItemStatus,
        }));
        setTasks(allOrders);
      })
      .catch(error => {
        console.error('Error fetching kitchen show tasks: ', error);
      });
    };

    fetchTasks();
    const interval = setInterval(fetchTasks, 1000);

    return () => clearInterval(interval);
  }, []);


  const toggleTaskCompletion = (kitchenDetailId) => {
    console.log('btn click success');
    const taskIndex = tasks.findIndex(task => task.KitchenDetailID === kitchenDetailId);
    console.log(taskIndex);
    if (taskIndex === -1) {
      console.error('Task not found!');
      return;
    }
    const task = tasks[taskIndex];
    console.log(task);
    if (task.status === 'preparing') {
      fetch(`http://localhost:5000/kitchen_view/${task.KitchenDetailID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'cooking',
        }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        const updatedTasks = [...tasks];
        updatedTasks[taskIndex] = {...task, status: 'cooking'};
        setTasks(updatedTasks);
      })
      .catch(error => {
        console.error('Error updating task status:', error);
      });
    } else if (task.status === 'cooking') {
      fetch('http://localhost:5000/menu_completed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          KitchenDetailID: task.KitchenDetailID,
          orderId: task.tableId,
          menuItemId: task.menuItemId,
          quantity: task.quantity,
        }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        setTasks((prevTasks) => prevTasks.filter((t) => t.KitchenDetailID !== kitchenDetailId));
      })
      .catch(error => {
        console.error('Error deleting item:', error);
      });
    }
  };
  

  const handleLogoutClick = () => {
    sessionStorage.setItem('isAuthenticated', JSON.stringify(false));
    sessionStorage.setItem('role', 'Customer');
    navigate('/loginpage');
  };

  return (
    <ThemeProvider theme={ColorTheme}>
      <div  style={{ 
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
              Kitchen Orders
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
            marginTop: '70px',
          }}
        >
          <Grid container spacing={3}>
            {Array.isArray(tasks) && tasks.map((task) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={task.KitchenDetailID}>
                <Card sx={{ minWidth: 100, margin: 'auto', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <CardContent
                    sx={{
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      '&:last-child': { 
                        paddingBottom: '16px',
                      },
                    }}
                  >
                    <Box sx={{ textAlign: 'center', marginBottom: 1 }}>
                      <Typography variant="h5" component="div">
                        {task.title}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 1 }}>
                      <Typography variant="subtitle1" component="div">
                        Qty: {task.quantity}
                      </Typography>
                    </Box>
                    <Box sx={{ marginBottom: 1 }}>
                      <Typography variant="caption" component="div">
                        Table {task.tableId}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      color="success"
                      size='small'
                      onClick={() => toggleTaskCompletion(task.KitchenDetailID)}
                      sx={{ backgroundColor: task.status === 'cooking' ? pink[200] : pink[100] }}
                    >
                      {task.status === 'cooking' ? 'Done' : 'Start'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default KitchenPage;
