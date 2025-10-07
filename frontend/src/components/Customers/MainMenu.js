import React, { useEffect, useState } from "react";
import { ThemeProvider, Box, Drawer, List, ListItem, ListItemText, Toolbar, Grid, Card, CardContent, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, useMediaQuery, Fab, CardMedia } from "@mui/material";
// import './MenuDrawer.css'
import { grey, pink } from "@mui/material/colors";
import { useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import AddButton7 from "../Buttons/AddButton7";
import './MainMenu.css'
import Header from './Header';
import ColorTheme from '../Theme';
import bgc from './bgc.png';


function MainMenu() {
  const [categories, setCategories] = useState([]);
  const [menus, setMenus] = useState([]);
  const [quantities, setQuantities] = useState({});
  const location = useLocation();
  const { tableNumber = '', numberOfPeople = '' } = location.state || {};
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setQuantities({});
    fetch('http://localhost:5000/api/menucategories')
      .then(response => response.json())  
      .then(data => setCategories(data))
      .catch(error => console.error('There was a problem with the fetch operation:', error));
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/api/menu')
      .then(response => response.json())
      .then(data => {
        setMenus(data);
        
      })
      .catch(error => console.error('There was a problem with the fetch operation:', error));
  
    if (tableNumber) {
      fetch('http://localhost:5000/get_cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order_id: tableNumber }),
      })
      .then(response => response.json())
      .then(data => {
        const cartQuantities = {};
        data.cart.forEach(item => {
          cartQuantities[item.MenuItemID] = item.Quantity;
        });
        setQuantities(prevQuantities => ({
          ...prevQuantities,
          ...cartQuantities
        }));
      })
      .catch(error => console.error('Error fetching cart items:', error));
    }
  }, [tableNumber]);

  useEffect(() => {
    const saveQuantities = localStorage.getItem('quantities');
    if (saveQuantities) {
      setQuantities(JSON.parse(saveQuantities));
    }    
  }, []);

  useEffect(() => {
    localStorage.setItem('quantities', JSON.stringify(quantities));
  }, [quantities]);

  const updateCart = (menuId, newQuantity) => {
    const data = {
      item_id: menuId,
      quantity: newQuantity,
      order_id: tableNumber,
    };

    if (newQuantity === 0) {
      fetch('http://localhost:5000/remove_from_cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then(response => response.json())
      .then(data => console.log('Delete response: ', data))
      .catch(error => console.error('Delete operation Error: ', error));
    } else {
      fetch('http://localhost:5000/add_to_cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then(response => response.json())
      .then(data => console.log('Update response: ', data))
      .catch(error => console.error('There is a problem with the update operation: ', error));
    }
  };

  const increaseQuantity = (event, menuId) => {
    event.stopPropagation();
    const newQuantity = (quantities[menuId] || 0) + 1;
    const newQuantities = {
      ...quantities,
      [menuId]: newQuantity
    };
    setQuantities(newQuantities);
    localStorage.setItem('quantities', JSON.stringify(newQuantities));
    updateCart(menuId, newQuantity);
  };

  const decreaseQuantity = (event, menuId) => {
    event.stopPropagation();
    const newQuantity = Math.max((quantities[menuId] || 0) - 1, 0);
    const newQuantities = {
      ...quantities,
      [menuId]: newQuantity
    };
    setQuantities(newQuantities);
    localStorage.setItem('quantities', JSON.stringify(newQuantities));
    updateCart(menuId, newQuantity);
  };

  const handleCardClick = (menu) => {
    setSelectedMenu(menu);
    setIsDialogOpen(true);
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  }
  return (
    <ThemeProvider theme={ColorTheme}>
        <div style={{ 
        backgroundImage: `url(${bgc})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        minHeight: '100vh'
      }}>
        <Header />
        <div>
          <Box sx={{ display: "flex" }}>
            <Drawer
              variant={isMobile ? "temporary" : "permanent"}
              open={isMobile ? isDrawerOpen : true}
              onClose={() => setIsDrawerOpen(false)}
              sx={{
                width: 200,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                  width: 200,
                  boxSizing: "border-box",
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .2)",
                  transition: "all 0.3s ease",
                  borderRadius: "10px",
                  border: "1px solid rgba(255, 255, 255, 0.5)",
                },
              }}
            >
              <Toolbar />
              <Box sx={{ overflow: "auto", paddingY: "30px" }}>
                <List sx={{ paddingY: "30px", width: "100%" }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', 
                        marginTop: '-20px', marginBottom: '5px',
                      }}>
                    <AddButton7 
                    sx={{
                      [theme.breakpoints.down('sm')]: {
                        width: '84px',
                      },
                    }}
                    id='add-button1' 
                    onClick={() => setSelectedCategory('')}>
                        Show All Dishes
                    </AddButton7>
                    </Box>
                  {categories.map((category) => (
                    <ListItem
                      key={category.CategoryID}
                      button
                      onClick={() => setSelectedCategory(category.CategoryID)} 
                      sx={{
                        "&:hover": {
                          cursor: "pointer",
                          backgroundColor: grey[50],
                        },
                      }}
                    >
                      <ListItemText
                        primary={category.Name}
                        sx={{
                          my: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Drawer>
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                marginLeft: isMobile ? 0 : "20px",
                marginTop: "70px",
                overflowY: "auto",
              }}
            >
              <Grid container spacing={2} sx={{ gap: "30px", marginTop: 2 }}>
              {Array.isArray(menus) && menus.filter(menu => selectedCategory === '' || menu.CategoryID === selectedCategory).map((menu) => (
                  <Grid item xs={12} key={menu.MenuItemID}>
                    <Card
                      onClick={() => handleCardClick(menu)}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .1)",
                        transition: "all 0.3s ease",
                        borderRadius: "10px",
                        border: "1px solid rgba(255, 255, 255, 0.5)",
                        "&:hover": { backgroundColor: grey[100] },
                        height: '220px',
                        overflow: 'hidden',
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, maxWidth: 'calc(100% - 190px)' }}>
                        <CardContent sx={{ flexGrow: 1, width: '100%' }} className="card-content">
                          <Typography variant="h5" component="div" className="truncate">
                            {menu.Title}
                          </Typography>
                          <Typography className="truncate">
                            {menu.Description}
                          </Typography>
                          <Typography color="text.secondary" className="truncate">
                            {menu.Ingredients}
                          </Typography>
                          <Typography variant="body2" className="truncate">${menu.Price}</Typography>
                          <Box sx={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
                            <button onClick={(event) => decreaseQuantity(event, menu.MenuItemID)} className="button">
                              -
                            </button>
                            <span>{quantities[menu.MenuItemID] || 0}</span>
                            <button onClick={(event) => increaseQuantity(event, menu.MenuItemID)} className="button">
                              +
                            </button>
                          </Box>
                        </CardContent>
                      </Box>
                      <CardMedia
                        component="img"
                        sx={{
                          width: 190,
                          height: 190,
                          objectFit: 'cover',
                          marginLeft: 'auto',
                          marginRight: '6px',
                          borderRadius: '5px',
                        }}
                        // image={menu.ImagePath}
                        image={menu.ImagePath ? `${process.env.PUBLIC_URL}${menu.ImagePath}`: `${process.env.PUBLIC_URL}/logo.png`}

                        alt={menu.Title}
                      />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
            {isMobile && (
            <Fab
              color="primary"
              aria-label="open drawer"
              onClick={() => setIsDrawerOpen(true)}
              sx={{
                position: 'fixed',
                bottom: 16,
                left: 16,
              }}
            >
              <MenuIcon />
            </Fab>
          )}
          </Box>
          <Dialog
            open={isDialogOpen}
            onClose={handleCloseDialog}
            PaperProps={{
              style: {
                maxWidth: '500px',
                width: "50%",
                maxHeight: '70vh',
                height: "auto",
                overflowY: "auto",
              },
            }}
          >
            <DialogTitle className="dialog-title">{selectedMenu?.Title}</DialogTitle>
            <DialogContent
              dividers={true}
              className="dialog-content"
            >
              <Typography sx={{fontSize:'20px'}} className="dialog-price">Price: ${selectedMenu?.Price}</Typography>
              <img
                // src={selectedMenu?.ImagePath}
                src={selectedMenu?.ImagePath ? `${process.env.PUBLIC_URL}${selectedMenu.ImagePath}` : `${process.env.PUBLIC_URL}/logo.png`}

                alt={selectedMenu?.Title}
                className="dialog-image"
              />
              <Typography variant="subtitle1">{selectedMenu?.Ingredients}</Typography>
              <Typography className="dialog-description">{selectedMenu?.Description}</Typography>
            </DialogContent>
            <DialogActions className="dialog-actions">
              <Button className="dialog-close-button" onClick={handleCloseDialog} sx={{color:pink[700]}}>Close</Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default MainMenu;
