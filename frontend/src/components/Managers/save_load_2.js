import React, { useState, useEffect } from 'react';
import './ManagerPage.css';
// import React from 'react';
import ColorTheme from '../Theme';
import { useNavigate } from 'react-router-dom';
import logo from './logo.png';
import LoginButton from './LoginButton';
import { CardMedia, Grid, ThemeProvider, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, Box, Button, Card, CardContent, } from '@mui/material';
import AddButton1 from '../Buttons/AddButton1';
import { grey, pink } from '@mui/material/colors';
import EditButton1 from '../Buttons/EditButton1';
import add_png from '../Buttons/addbutton.png';
import DeleteButton1 from '../Buttons/DeleteButton1';
import delete_png from '../Buttons/deletebutton.png';
// import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function ManagerPage() {
const [categories, setCategories] = useState([]); 
const [menus, setMenus] = useState([]); 
const theme = useTheme();
//dragdrop 
const onDragEnd = (result) => {
  if (!result.destination) return;

  const items = Array.from(menus);
  const [reorderedItem] = items.splice(result.source.index, 1);
  items.splice(result.destination.index, 0, reorderedItem);

  setMenus(items);
};



useEffect(() => {
  fetch('http://localhost:5000/api/menucategories')
    .then(response => response.json())


    .then(data => {
      setCategories(data); 
    })
    .catch(error => console.error('There was a problem with the fetch operation:', error));
}, []);


  useEffect(() => {
    fetch('http://localhost:5000/api/menu')
      .then(response => response.json())
      .then(data => {
        setMenus(data);
        console.log(data);
        // console.log(typeof(data[0].MenuItemID.toString()));
      })
      .catch(error => console.error('There was a problem with the fetch operation:', error));
  }, []);


  let navigate = useNavigate();
  const handleLoginClick = () => {
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
    <ThemeProvider theme={ColorTheme}>
      <div className='background-login'>
        <div className='background-content'>

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
              onClick={handleLoginClick}
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
            <Box sx={{ overflow: 'auto', paddingY: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', }}>
                <AddButton1 
                sx={{
                  [theme.breakpoints.down('sm')]: {
                    // small screen
                    width: '84px',
                    marginTop: '10px',
                    marginBottom: '-20px',
                  },
                }}
                id='add-button1' onClick={handleAddCateButton}>
                    Edit category
                </AddButton1>
                </Box>

                {/* new list */}
                <List sx={{ paddingY: '30px', width: '100%' }}>
                {categories.map((category) => (
                    <ListItem key={category.CategoryID} button sx={{ '&:hover': { cursor: 'pointer', backgroundColor: grey[50] } }}>
                    <ListItemText primary={category.Name} sx={{ my: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                    </ListItem>
                ))}
                </List>

            </Box>
        </Drawer>

        {/* // drag */}
        <DragDropContext onDragEnd={onDragEnd}>
          {console.log('Rendering Droppable with id: droppable')}
          <Droppable droppableId="droppable">
            {(provided) => (
              <Box
                {...provided.droppableProps}
                ref={provided.innerRef}
                component="main"
                sx={{
                  display: 'flex',
                  flexGrow: 1,
                  p: 3,
                  [theme.breakpoints.up('sm')]: {
                      marginLeft: '220px', 
                      // big screen
                    },
                    [theme.breakpoints.down('sm')]: {
                      marginLeft: '90px', 
                      // small screen
                    },
                  marginTop: '70px', 
                  maxHeight:'calc(100vh - 80px)',
      
                }}
              >
              
                <Grid container spacing={0} 
                sx={{  
                  [theme.breakpoints.up('sm')]: {
                      gap: '30px',
                      marginTop: 2, 
                  },
                  [theme.breakpoints.down('sm')]: {
                      gap: '10px',
                      marginTop: 0, 
                  },
                  }}
                >
                  <Card sx={{ width: '300px', 
                    cursor: 'pointer',
                    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)', 
                    transition: 'all 0.3s ease', 
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    height: '300px',
                    [theme.breakpoints.up('sm')]: {
                      width: 300, // big screen
                      height: 300,

                    },
                    [theme.breakpoints.down('sm')]: {
                      width: 280, // small screen
                      height: 220,
                    },
                    }}>
                    <Button sx={{ width: '200px', 
                    '&:hover': {
                      backgroundColor: grey[200],
                      color: pink[400],
                    },
                  //   height: '200px'
                  [theme.breakpoints.up('sm')]: {
                      width: 300, // big screen
                      height: 300,

                    },
                    [theme.breakpoints.down('sm')]: {
                      width: 260, // small screen
                      height: 220,
                    },
                    }}>
                    <CardMedia
                      component="img"
                      height="100%"
                      image={add_png}
                      alt="Add Button Image"
                      onClick={handleAddDishButton}
                      sx = {{
                          margin: 'auto'
                      }}
                    />
                    </Button>
                  </Card>
                  {menus.map((menu, index) => (
                    // {console.log()}
                    <Draggable key={menu.MenuItemID.toString()} draggableId={menu.MenuItemID.toString()} index={index}>
                      {(provided) => (
                        <Grid
                          item
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          // style of the Grid remains unchanged
                          sx={{ /* ... */ }}
                        >
                          {/* Card content remains the same */}
                          <Card key={menu.MenuItemID} 
                          sx={{ 
                            position: 'relative', height: '300px', width: '300px', cursor: 'pointer', boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)', transition: 'all 0.3s ease', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.5)', '&:hover': { backgroundColor: grey[100] },  
                            [theme.breakpoints.up('sm')]: {
                                width: 300, // big screen
                                height: 300,

                              },
                              [theme.breakpoints.down('sm')]: {
                                width: 280, // small screen
                                height: 220,
                              },
                            }}>

                            <CardContent>
                            <Grid container spacing={0}>
                              <Grid item xs={12} sm={12}>

                                {/* test */}
                              <Typography variant="h5" component="div"
                                  sx={{
                                    backgroundColor:'lightblue',
                                    width: '30px',
                                    borderRadius: '6px',
                                  }}
                                  >
                                  {menu.MenuItemID}
                                </Typography>
                                {/* test */}

                                <Typography variant="h5" component="div"
                                  sx={{
                                    // big screen
                                    fontSize: '1.5rem',
                                    [theme.breakpoints.down('sm')]: {
                                      // small screen
                                      fontSize: '1.1rem',
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
                              {/* <Grid container spacing={2}> */}
                              <Grid item xs={5} sm={5}>
                                <CardMedia
                                  component="img"
                                  sx={{ width: '100px', height: '100px', marginY: '5px', backgroundColor:'pink',
                                  [theme.breakpoints.down('sm')]: {
                                    // small screen
                                    width: '70px', 
                                    height: '70px',
                                  },
                                }} 
                                  image={menu.ImagePath}
                                  //image={logo}
                                  alt={menu.Title}
                                />
                              </Grid>
                              <Grid item xs={7} sm={7}>
                                <Typography variant="h7" component="div"
                                  sx={{
                                    // marginY: '5px', 
                                  // big screen
                                  fontSize: '1.5rem',
                                  [theme.breakpoints.down('sm')]: {
                                    // small screen
                                    fontSize: '1.1rem',
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
                                  },
                                  display: '-webkit-box', // Using web-kit's box model for multiline text omission
                                  overflow: 'hidden',
                                  WebkitLineClamp: 3, // Limit display to two lines
                                  WebkitBoxOrient: 'vertical', // Set the orientation of the box to vertical
                                  textOverflow: 'ellipsis', // Text overflow display ellipsis
                                  whiteSpace: 'normal', // Normal line feed
                                  }}
                                >
                                  {menu.Ingredients}
                                </Typography>
                                </Grid>
                              <Grid item xs={12} sm={12}>
                                <Typography color="text.secondary"
                                  sx={{
                                      // big screen
                                      fontSize: '1.1rem',
                                      [theme.breakpoints.down('sm')]: {
                                        // small screen
                                        fontSize: '0.7rem',
                                      },
                                      display: '-webkit-box', // Using web-kit's box model for multiline text omission
                                      overflow: 'hidden',
                                      WebkitLineClamp: 3, // Limit display to two lines
                                      WebkitBoxOrient: 'vertical', // Set the orientation of the box to vertical
                                      textOverflow: 'ellipsis', // Text overflow display ellipsis
                                      whiteSpace: 'normal', // Normal line feed
                                      }}
                                >
                                  {menu.Description}
                                </Typography>
                              </Grid>
                            </Grid>
                            </CardContent>
                            <EditButton1 onClick={() => handleEditDishButton(menu.MenuItemID)}>Edit</EditButton1>
                            <DeleteButton1 onClick={() => handleDeleteDishButton(menu.MenuItemID)}>
                              <CardMedia component="img" sx={{ position: 'absolute', width: '100%', height: '70%', objectFit: 'contain' }} image={delete_png} alt="Delete Button Image"/>
                            </DeleteButton1>


                          </Card>
                        </Grid>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
                </Grid>
                
              </Box>
             )}
           </Droppable>
         </DragDropContext>
        {/* // drag */}




        </div>
      </div>

    </ThemeProvider>
  );
}

export default ManagerPage;