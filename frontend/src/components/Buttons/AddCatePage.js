import React, { useState, useEffect, useCallback } from 'react';
// import React from 'react';
import ColorTheme from '../Theme';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.png';
import LoginButton from '../Managers/LoginButton';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputLabel, Select, MenuItem, FormControl, CardMedia, Grid, ThemeProvider, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Button, Card, CardContent, Icon, TextField, Checkbox, } from '@mui/material';
// import AddButton1 from './Buttons/AddButton1';
import { grey, pink } from '@mui/material/colors';
import AddButton3 from './AddButton3';
import BackButton1 from './BackButton1';
// import EditButton1 from './Buttons/EditButton1';
import add_png from './addbutton.png';
import AddButton4 from './AddButton4';
import DeleteButton2 from './DeleteButton2';
// import DeleteButton1 from './Buttons/DeleteButton1';
import delete_png from './deletebutton.png';
// import React, { useState } from 'react';
// import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './AddCatePage.css';
import { getMinDisplayOrder } from '../Managers/ManagerPage.js';

function AddDishesPage () {
  let navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  const onDragEnd = useCallback((result) => {
    if (!result.destination) {
      return;
    }

    const cates = Array.from(categories);
    const [reorderedItem] = cates.splice(result.source.index, 1);
    cates.splice(result.destination.index, 0, reorderedItem);

    const updatedCates = cates.map((item, index) => ({
      ...item,
      DisplayOrder: index ,
    }));
    setCategories(updatedCates);
    console.log("After reorder:", updatedCates);
    updateCategoryOrder(updatedCates);

  }, [categories]);

  const updateCategoryOrder = useCallback(async (updatedCates) => {
        try {
          const response = await fetch('http://localhost:5000/api/menucategories', {
            method: 'PUT', 
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedCates),
          });
      
          if (!response.ok) {
            throw new Error('Failed to update menu order.');
    
          }
          console.log(updatedCates);
          console.log('Menu order updated successfully.');
        } catch (error) {
          console.error('Error updating menu order:', error);
        }
      // }
      }, []);

  const handleError = (error) => {
    setIsErrorOpen(true);
  };
  const handleErrorClose = () => {
    setIsErrorOpen(false);
  };

  // useEffect(() => {
  //   fetch('http://localhost:5000/api/menucategories')
  //     .then(response => response.json())
  //     .then(data => {
  //       setCategories(data); // store acquired data
  //       console.log(data);
  //       localStorage.setItem('min_menucategory_display_order', getMinDisplayOrder(data));
  //     })
  //     .catch(error => console.error('There was a problem with the fetch operation:', error));
  // }, []);

  const fetchCategories = () => {
    fetch('http://localhost:5000/api/menucategories')
    .then(response => response.json())
    .then(data => {
        setCategories(data); // update category
        console.log(data);
        localStorage.setItem('min_menucategory_display_order', getMinDisplayOrder(data));
    })
    .catch(error => console.error('There was a problem with the fetch operation:', error));
};

  useEffect(() => {
      fetchCategories();
  }, []);

  const handleLoginClick = () => {
    navigate('/loginpage');
  };
  const handleBack = () => {
    navigate('/managerpage');
  };
  const handleLogoClick = (event) => {
    event.stopPropagation();
    navigate('/');
  };

  //open windows if add category
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = () => {
    setCategoryName(document.getElementById('name').value);
  }
  
  const [categoryName, setCategoryName] = useState('');

  const handleCloseConfirm = () => {
    const apiUrl = 'http://localhost:5000/api/add_category';

    setCategoryName(document.getElementById('name').value);
    const displayOrder = parseInt(localStorage.getItem('min_menucategory_display_order'), 10) - 1;

    if (categoryName.trim()) {
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                categoryName: categoryName,
                displayOrder: displayOrder,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            fetchCategories();
            console.log(data);
            setOpen(false);
            setCategoryName('');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to add the category');
        });
    } else {
        alert('Please enter a category name.');
    }
};

  // update categoryName
  const handleCategoryNameChange = (event) => {
    setCategoryName(event.target.value);
  };

  const handleDeleteCategory = (categoryId) => {
    fetch(`http://localhost:5000/api/delete_category/${categoryId}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (response.ok) {
        // Remove the category on the UI after successful deletion
        // May need to update status or recapture category listings
        console.log("Deletion succeeded");
        setCategories(prev => prev.filter(category => category.CategoryID !== categoryId));
      } else {
        // Handle error if deletion fails
        console.error('Failed to delete the category');
        handleError(new Error('Failed to delete the category'));

      }
    })
    .catch(error => {
      handleError(error);
    });
  };
  

  return (
    <ThemeProvider theme={ColorTheme}>
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
              onClick={handleLoginClick}
            >
              Log out
            </LoginButton>
          </Toolbar>
        </AppBar>
        <Box component="main"
            sx={{
              display: 'flex',overflow: 'hidden',
              flexGrow: 1,
              p: 3,
              marginLeft: '20px', 
              marginTop: '80px', 
            }}>
          <Grid container spacing={2} sx={{ gap: '10px', marginTop: 2, overflow: 'hidden',
              justifyContent: 'center',
              // display:'positive',
            }}> 

                <Typography variant="h4" component="div" align="center" sx={{ marginTop: '20px' }}>
                  Category
                </Typography>
                <Grid item xs={12} sx={{overflow: 'hidden',display: 'flex', justifyContent: 'center', }}>
                  <Box 
                  sx={{marginBottom:'5px'}}
                  >
                  <AddButton4 variant="contained" onClick={handleClickOpen}>Add category</AddButton4>
                  </Box>
                  <Dialog open={open} onClose={handleClose} onChange={handleInputChange}>
                  <DialogTitle>Add a New Category</DialogTitle>
                  <DialogContent>
                      <DialogContentText>
                      Please enter the name of the new category you wish to add.
                      </DialogContentText>
                      <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Category Name"
                      type="text"
                      fullWidth
                      variant="standard"
                      />
                  </DialogContent>
                  <DialogActions>
                      <Button onClick={handleClose}>Cancel</Button>
                      <Button onClick={handleCloseConfirm}>Confirm</Button>
                  </DialogActions>
                  </Dialog>

                  <Dialog open={isErrorOpen}>
                  <DialogTitle>Failed to delete the category</DialogTitle>
                  <DialogContent>
                      <DialogContentText>
                      There are already dishes under this category. Please delete the dishes first and then delete the category.
                      </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                      <Button onClick={handleErrorClose}>Confirm</Button>
                  </DialogActions>
                  </Dialog>
                  
                </Grid>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="droppable-categories">
                    {(provided) => (
                      <Grid container spacing={0} 
                      xs={12} className="custom-scrollbar"
                        sx={{ display: 'flex', flexGrow: 1, p: 3, marginLeft: '30px', alignItems: 'center', 
                          // overflow: 'hidden',
                          overflow: 'auto',
                          maxHeight: '400px',paddingBottom:'10px',
                        }}
                        {...provided.droppableProps}
                        ref={provided.innerRef}>

                          {categories.map((category, index) => (
                            <Draggable key={category.CategoryID} draggableId={category.CategoryID.toString()} index={index}
                              sx={{ 
                              display: 'flex', 
                              flexDirection: 'column',
                              justifyContent: 'space-around',
                              alignItems: 'center', 
                              marginTop: '0px',
                              overflow: 'hidden',

                              }}>
                            {(provided) => (

                              <Grid item xs={12}ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                
                                sx={{ display: 'flex', alignItems: 'center', gap: '15px' , margin:'10px',
                                  overflow: 'hidden',justifyContent: 'center',
                                }}>
                                <Grid sx={{overflow: 'hidden',display:'flex',alignItems: 'center', justifyContent: 'center', size:'small', height:'40px', width: '200px',
                                boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)',  borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.5)', backgroundColor: grey[50]  }}>
                                  <Typography variant="h5" component="div" align="center">{category.Name}</Typography>
                                </Grid>
                                <DeleteButton2 variant="contained" onClick={() => handleDeleteCategory(category.CategoryID)}>
                                  <CardMedia component="img" sx={{ position: 'absolute', width: '100%', height: '70%', objectFit: 'contain' }} image={delete_png} />
                                </DeleteButton2>
                              </Grid>
                              )}
                            </Draggable>
                    ))}
                    {provided.placeholder}
                      </Grid>
                    )}
                  </Droppable>
                </DragDropContext>
          </Grid>
          <Box sx={{
              position: 'fixed',
              left: '10px',
              top: '90px', 
              zIndex: 1200, 
            }}>
            <BackButton1 onClick={handleBack}>Back</BackButton1>
          </Box>
        </Box>
        </div>

      </div>
    </ThemeProvider>
  );
}

export default AddDishesPage;
