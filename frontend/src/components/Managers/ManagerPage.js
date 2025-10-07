import React, { useState, useEffect, useCallback, useRef } from 'react';
import './ManagerPage.css';
import ColorTheme from '../Theme';
import { useNavigate } from 'react-router-dom';
import logo from './logo.png';
import LoginButton from './LoginButton';
import { CardMedia, Grid, ThemeProvider, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, Box, Button, Card, CardContent, } from '@mui/material';
import AddButton1 from '../Buttons/AddButton1';
import AddButton6 from '../Buttons/AddButton6';
import { grey, pink,blue } from '@mui/material/colors';
import EditButton1 from '../Buttons/EditButton1';
// import add_png from '../Buttons/addbutton.png';
import DeleteButton1 from '../Buttons/DeleteButton1';
import delete_png from '../Buttons/deletebutton.png';
import { useTheme } from '@mui/material/styles';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import AddButton7 from '../Buttons/AddButton7';
// import PerfectScrollbar from 'perfect-scrollbar';
// import 'perfect-scrollbar/css/perfect-scrollbar.css';
export function getMinDisplayOrder(data) {
  let minDisplayOrder = 10000;

  if (data.length == 0) return 0;

  data.forEach(item => {
    let displayOrder = item['DisplayOrder'];
    if (displayOrder < minDisplayOrder) {
      minDisplayOrder = displayOrder;
    }
  });
  return minDisplayOrder;
}

function ManagerPage() {
  const [categories, setCategories] = useState([]); 
  const [menus, setMenus] = useState([]); 
  const [displayOrder, setDisplayOrder] = useState([]); 
  const theme = useTheme();
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const handleCategoryClick = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/menucategories');
      const data = await response.json();
      setCategories(data);
      // console.log(data);
      localStorage.setItem('min_menucategory_display_order', getMinDisplayOrder(data));
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }, []);

  const fetchMenus = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/menu');
      const data = await response.json();
      setMenus(data);
      console.log(data);
      localStorage.setItem('min_menuitem_display_order', getMinDisplayOrder(data));
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }, []);

  const updateMenuOrder = useCallback(async (updatedItems) => {
// async function updateMenuOrder(updatedItems) {
    try {
      const response = await fetch('http://localhost:5000/api/menuitems', {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItems),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update menu order.');

      }
      console.log(updatedItems);
  
      console.log('Menu order updated successfully.');
    } catch (error) {
      console.error('Error updating menu order:', error);
    }
  // }
  }, []);

  
  useEffect(() => {
    fetchCategories();
    fetchMenus();
  }, [fetchCategories, fetchMenus]);

  const onDragEnd = useCallback((result) => {
    console.log("Drag end result:", result);
    if (!result.destination) return;
  
    const items = Array.from(menus);
    // console.log("Before reorder:", items.map(item => item.MenuItemID));
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
  
    console.log("After reorder:", items.map(item => item.DisplayOrder));
    // console.log("After reorder:", items.map(item => item.MenuItemID));
    // setMenus(items);

    const updatedItems = items.map((item, index) => ({
      ...item,
      DisplayOrder: index ,
    }));
    setMenus(updatedItems);
    console.log("After reorder:", updatedItems);
    updateMenuOrder(updatedItems);
  }, [menus]);
  
  
  let navigate = useNavigate();
  const handleLogoutClick = () => {
    sessionStorage.setItem('isAuthenticated', JSON.stringify(false));
    sessionStorage.setItem('role', 'Customer');
    navigate('/loginpage');
  };
  const handleLogoClick = (event) => {
    event.stopPropagation();
    navigate('/');
  };
  const drawerWidth = 200;
  const smalldrawerWidth = 100;

  const handleDeleteDishButton = async (menuItemId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/deletemenuitems/${menuItemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedMenus = menus.filter(menu => menu.MenuItemID !== menuItemId);
        setMenus(updatedMenus);
      } else {
        console.error('Failed to delete the menu item.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleEditDishButton = (menuItemId) => {
    navigate(`/editdishespage/${menuItemId}`);
    // navigate('/editdishespage');
  };
  const handleAddCateButton = () => {
    navigate('/addcatepage');
  };
  const handleAddDishButton = () => {
    navigate('/adddishespage');
  };

  
  return (
    <ThemeProvider theme={ColorTheme} >
      <div className='background-login' style={{overflow: 'hidden',}}>
        <div className='background-content' style={{overflow: 'hidden',}}>

        <AppBar position="fixed" sx={{ backgroundColor: '#fce4ec', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Box
              component="img"
              sx={{
                position: 'absolute',
                cursor: 'pointer',
                height: '60px', 
                width: '60px',
                top: '10px',
                left: '15px',
              }}
              src={logo}
              alt="logo"
              onClick={handleLogoClick}
            />
            <LoginButton
              id="login-button"
              variant="contained"
              onClick={handleLogoutClick}
            >
              Log out
            </LoginButton>
          </Toolbar>
        </AppBar>
        
        
        <Drawer
            variant="permanent"
            sx={{
                // backgroundColor: 'rgba(255, 255, 255, 0.7)',
                // backdropFilter: 'blur(10px)',
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', 
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(10px)', 
                boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .2)', 
                transition: 'all 0.3s ease', 
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                height: '100vh',
                // height:'calc(100vh - 80px)',
                [theme.breakpoints.up('sm')]: {
                    width: drawerWidth, //  big screen
                  },
                  [theme.breakpoints.down('sm')]: {
                    width: smalldrawerWidth, //  small screen
                  },
            },
            }}
            >
            <Toolbar /> 
            <Box sx={{ 
              overflow: 'auto', 
            paddingY: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', }}>
                <AddButton1 
                sx={{
                  [theme.breakpoints.down('sm')]: {
                    // small screen
                    width: '84px',
                    marginTop: '10px',
                    // marginBottom: '-20px',
                  },
                }}
                id='add-button1' onClick={handleAddCateButton}>
                    Edit category
                </AddButton1>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '20px',
                    marginBottom: '-20px',
                  }}>
                <AddButton7 
                sx={{
                  [theme.breakpoints.down('sm')]: {
                    // small screen
                    width: '84px',
                    // marginTop: '10px',
                    // marginBottom: '20px',
                   
                  },
                }}
                id='add-button1' onClick={() => setSelectedCategoryId('')}>
                    Show All Dishes
                </AddButton7>
                </Box>
                {/* new list */}
                <List sx={{ paddingY: '30px', width: '100%' }}>
                  {categories.map((category) => (
                      <ListItem button
                      onClick={() => handleCategoryClick(category.CategoryID)}
                      key={category.CategoryID} sx={{ '&:hover': { cursor: 'pointer', backgroundColor: grey[50] } }}>
                      <ListItemText primary={category.Name} sx={{ my: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                      </ListItem>
                  ))}
                </List>

            </Box>
        </Drawer>


        <Box
          component="main"
          sx={{
            display: 'flex',
            flexGrow: 1,
            p: 3,
            [theme.breakpoints.up('sm')]: { marginLeft: '200px' },
            [theme.breakpoints.down('sm')]: { marginLeft: '90px' },
            marginTop: '70px',
            maxHeight: 'calc(100vh - 80px)',
            // overflow: 'auto',
            overflow: 'hidden',
          }}
          
          // ref={scrollRef}
        >
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="unique-droppable-id">
              {(provided) => (
              <Grid container spacing={0} 
              xs={12}
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="custom-scrollbar"
              sx={{ 
              overflow: 'auto',
              display: 'flex', justifyContent: 'center',
                [theme.breakpoints.up('sm')]: { marginTop: 2 }, [theme.breakpoints.down('sm')]: { gap: '15px', marginLeft: '5px' } }}>
                <Card sx={{ 
                  cursor: 'pointer',
                  boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)', 
                  transition: 'all 0.3s ease', 
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  [theme.breakpoints.up('sm')]: {
                    width: 900, // big screen
                    height: 100,
                    // marginY: '20px'

                  },
                  [theme.breakpoints.down('sm')]: {
                    width: 280, // small screen
                    height: 70,
                  },
                  }}>
                  <AddButton6 onClick={handleAddDishButton} sx={{ 
                  [theme.breakpoints.up('sm')]: {
                      width: 900, // big screen
                      height: 100,
                    },
                    [theme.breakpoints.down('sm')]: {
                      width: 280, // small screen
                      height: 70,
                      fontSize: '25px',
                    },
                    }}>
                      Add Dishes
                  </AddButton6>
                </Card>
                {menus.filter(menu => selectedCategoryId === '' || menu.CategoryID === selectedCategoryId).map((menu, index) => (
                // {menus.map((menu, index) => (
                  <Draggable key={menu.MenuItemID} draggableId={menu.MenuItemID.toString()} index={index}>
                    {(provided) => (
                      <Grid
                        item 
                        xs={12}
                        ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                        sx={{display: 'flex', justifyContent: 'center', alignItems: 'center',
                        // paddingY:'10px'
                        [theme.breakpoints.up('sm')]: {
                          paddingY:'10px'
                        },
                        [theme.breakpoints.down('sm')]: {
                          paddingY:'0px'
                        },
                        }}
                      >
                        <Card  
                        sx={{ 
                          position: 'relative', 
                          cursor: 'pointer', boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)', transition: 'all 0.3s ease', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.5)', '&:hover': { backgroundColor: grey[100] },  
                          [theme.breakpoints.up('sm')]: {
                              width: 900, // big screen
                              height: 180,
                            },
                            [theme.breakpoints.down('sm')]: {
                              width: 280, // small screen
                              height: 190,
                              padding:'0'
                            },
                          }}>
                          <CardContent>
                            <Grid container spacing={0}>
                              <Grid item xs={12} sm={12}>
                                <Typography variant="h5" component="div"
                                    sx={{
                                      // big screen
                                      fontSize: '1.5rem',
                                      [theme.breakpoints.up('sm')]: {
                                        // big screen
                                        display: 'none',
                                      },
                                      [theme.breakpoints.down('sm')]: {
                                        // small screen
                                        fontSize: '1.1rem',
                                        fontWeight:'600',
                                      },
                                      display: '-webkit-box',
                                      overflow: 'hidden',
                                      WebkitLineClamp: 1, 
                                      WebkitBoxOrient: 'vertical',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'normal', 

                                    }}
                                    >
                                    {menu.Title}
                                  </Typography>
                              </Grid>
                              <Grid item xs={6.5} sm={2.5}>
                                <CardMedia
                                  component="img"
                                  sx={{ width: '140px', height: '140px', marginY: '5px', 
                                  [theme.breakpoints.down('sm')]: {
                                    // small screen
                                    width: '100px', 
                                    height: '100px',
                                    
                                  },
                                }}
                                  image={menu.ImagePath ? `${process.env.PUBLIC_URL}${menu.ImagePath}`: `${process.env.PUBLIC_URL}/logo.png`}
                                  alt={menu.Title}
                                />
                              </Grid>
                              <Grid item xs={5.5} sm={8} 
                              >
                              <Typography variant="h5" component="div"
                                  sx={{
                                    // big screen
                                    fontWeight:'600',
                                    fontSize: '1.5rem',
                                    [theme.breakpoints.down('sm')]: {
                                      // small screen
                                      fontSize: '1.1rem',
                                      fontWeight:'600',
                                      display: 'none',
                                    },
                                    display: '-webkit-box',
                                    overflow: 'hidden',
                                    WebkitLineClamp: 1, 
                                    WebkitBoxOrient: 'vertical',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'normal', 

                                  }}
                                  >
                                  {menu.Title}
                                </Typography>
                                <Typography variant="h7" component="div"
                                  sx={{
                                  // big screen
                                  fontSize: '1.5rem',
                                  fontWeight:'600',
                                  [theme.breakpoints.down('sm')]: {
                                    // small screen
                                    fontSize: '1.1rem',
                                    fontWeight:'600',
                                  },
                                  }}
                                >
                                  A${menu.Price}
                                </Typography>

                                <Typography color="text.secondary"
                                  sx={{
                                  // big screen
                                  fontSize: '1.1rem',
                                  [theme.breakpoints.down('sm')]: {
                                    // small screen
                                    fontSize: '0.7rem',
                                    WebkitLineClamp: 2,
                                  },
                                  display: '-webkit-box', 
                                  overflow: 'hidden',
                                  WebkitLineClamp: 1,
                                  WebkitBoxOrient: 'vertical',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'normal', 
                                  }}
                                >
                                  {menu.Ingredients}
                                </Typography>
                                <Typography color="text.secondary"
                                  sx={{
                                      // big screen
                                      fontSize: '1.1rem',
                                      [theme.breakpoints.down('sm')]: {
                                        // small screen
                                        fontSize: '0.7rem',
                                        WebkitLineClamp: 3,

                                      },
                                      display: '-webkit-box',
                                      overflow: 'hidden',
                                      WebkitLineClamp: 2, 
                                      WebkitBoxOrient: 'vertical', 
                                      textOverflow: 'ellipsis', 
                                      whiteSpace: 'normal', 
                                      }}
                                >
                                  {menu.Description}
                                </Typography>
                                </Grid>
                            </Grid>
                          </CardContent>
                          <EditButton1 sx={{[theme.breakpoints.down('sm')]: {
                                        top:'155px',
                                        right: '90px',
                                        height: '30px',

                                      },}} onClick={() => handleEditDishButton(menu.MenuItemID)}>Edit</EditButton1>
                          <DeleteButton1 sx={{[theme.breakpoints.down('sm')]: {
                                        top:'155px',
                                        height: '30px',
                                      },}}  onClick={() => handleDeleteDishButton(menu.MenuItemID)}>
                            <CardMedia component="img" sx={{ position: 'absolute', width: '100%', height: '70%', objectFit: 'contain' }} image={delete_png} alt="Delete Button Image"/>
                          </DeleteButton1>


                        </Card>
                      </Grid>
                      
                    
                      )} 
                  </Draggable>
                ))}
                {provided.placeholder}

              </Grid>
              )}
            </Droppable>
          </DragDropContext>
        </Box>


        {/* // drag */}




        </div>
      </div>

    </ThemeProvider>
  );
}

export default ManagerPage;