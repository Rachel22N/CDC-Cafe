import React, { useState, useEffect } from 'react';
import ColorTheme from '../Theme';
import { useNavigate, useParams } from 'react-router-dom';
import logo from '../logo.png';
import LoginButton from '../Managers/LoginButton';
import {  InputLabel, Select, MenuItem, FormControl, CardMedia, Grid, ThemeProvider, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Button, Card, CardContent, Icon, TextField, Checkbox, } from '@mui/material';
// import AddButton1 from './Buttons/AddButton1';
import { grey, pink } from '@mui/material/colors';
import AddButton3 from './AddButton3';
import BackButton1 from './BackButton1';
// import EditButton1 from './Buttons/EditButton1';
import add_png from './addbutton.png';
// import DeleteButton1 from './Buttons/DeleteButton1';
// import delete_png from './Buttons/deletebutton.png';
import DeleteButton3 from './DeleteButton3';
import { useTheme } from '@mui/material/styles';

const IMAGESAVEPATH = '/';

function AddDishesPage () {
  const theme = useTheme();
  let navigate = useNavigate();
  const { menuItemId } = useParams();
  const [menus, setMenus] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedMenu, setSelectedMenu] = useState({
    Title: '',
    Description: '',
    Ingredients: '',
    Category: '',
    Price: '',
    ImagePath: ''
  });
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');

  const handleDeletePicture = () => {
    setSelectedImage(null); 
    setSelectedMenu(prevMenu => ({
      ...prevMenu,
      ImagePath: null 
    }));
  };
  
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
  const [category, setCategory] = React.useState('');

  const handleCategoryChange = (event) => {
    const newCategoryID = event.target.value;
    const updatedSelectedMenu = { ...selectedMenu, Category: newCategoryID };
    setSelectedMenu(updatedSelectedMenu); 
  }
  const fileInputRef = React.useRef(null);
  const handleAddPicture = () => {
    fileInputRef.current.click();
  }
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(IMAGESAVEPATH + file.name);
      };
      console.log('1111111');
      console.log(IMAGESAVEPATH + file.name);
  }
  useEffect(() => {
    fetch('http://localhost:5000/api/menu')
      .then(response => response.json())
      .then(data => {
        setMenus(data);
        const menuDetail = data.find(menu => menu.MenuItemID.toString() === menuItemId);
        console.log(menuDetail);
        if (menuDetail) {
          setSelectedMenu({
            Title: menuDetail.Title,
            Description: menuDetail.Description,
            Ingredients: menuDetail.Ingredients,
            Category: menuDetail.CategoryID,
            Price: menuDetail.Price,
            ImagePath: menuDetail.ImagePath
          });
        }
      })
    .catch(error => console.error('There was a problem with the fetch operation:', error));
  }, [menuItemId]);

  useEffect(() => {
    fetch('http://localhost:5000/api/menucategories')
      .then(response => response.json())
      .then(data => {
        setCategories(data);
        if (selectedMenu.Category) {
          const selectedCategory = categories.find(cat => cat.CategoryID === selectedMenu.Category);
          if (selectedCategory) {
            setCategoryName(selectedCategory.Name);
          }
        }
      })
    .catch(error => console.error('There was a problem with the fetch operation:', error));
  }, [selectedMenu]);

  const handleConfirm = async () => {
    const imagePath = selectedImage || selectedMenu.ImagePath;

    const updatedDish = {
      Title: selectedMenu.Title,
      Description: selectedMenu.Description,
      Ingredients: selectedMenu.Ingredients,
      CategoryID: selectedMenu.Category,  
      Price: selectedMenu.Price,
      IsActive: true,
      // ImagePath: selectedImage
      ImagePath: imagePath
    };
    console.log(updatedDish)

    try {
      const response = await fetch(`http://localhost:5000/api/menuitems/${menuItemId}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedDish)
      });

      if (response.ok) {
        navigate('/managerpage');
      } else {
        console.error('Failed to update the menu item.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (

    <ThemeProvider theme={ColorTheme}>
      <div className='background-login'>
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
              display: 'flex',
              flexGrow: 1,
              p: 3,
              marginLeft: '20px', 
              marginTop: '80px', 
            }}>
          <Grid container spacing={2} sx={{ gap: '40px', marginTop: 2, 
              justifyContent: 'center',
              // display:'positive',
            }}> 
            <Card sx={{ width: '400px',
              // cursor: 'pointer',
              boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)', 
              transition: 'all 0.3s ease', 
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              position: 'relative',
              '&:hover': {
                backgroundColor: grey[100],
              },
              height: '600px' }}>
              <CardContent>

                <TextField
                  label="Title"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={selectedMenu.Title}
                  onChange={(e) => setSelectedMenu({ ...selectedMenu, Title: e.target.value })}
                />

                <TextField label="Ingredients" variant="outlined" fullWidth margin="normal" 
                value={selectedMenu.Ingredients}
                onChange={(e) => setSelectedMenu({ ...selectedMenu, Ingredients: e.target.value })}/>


                <FormControl fullWidth margin="normal">
                  <InputLabel>Category</InputLabel>
                  <Select 
                    value={selectedMenu.Category} 
                    label="Category" 
                    onChange={handleCategoryChange}>
                    {categories.map((cat) => (
                      <MenuItem key={cat.CategoryID} value={cat.CategoryID}>{cat.Name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>


                <TextField label="Price" variant="outlined" fullWidth margin="normal"
                value={selectedMenu.Price}
                onChange={(e) => setSelectedMenu({ ...selectedMenu, Price: e.target.value })}/>
                <TextField label="Description" variant="outlined" fullWidth margin="normal" 
                InputProps={{
                  style: {
                    height: 200,
                    alignItems: 'flex-start',
                  }}}
                value={selectedMenu.Description}
                onChange={(e) => setSelectedMenu({ ...selectedMenu, Description: e.target.value })}/>
              </CardContent>
            </Card>
            <Card sx={{ width: '400px',
              boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)', 
              transition: 'all 0.3s ease', 
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              position: 'relative',
              '&:hover': {
                backgroundColor: grey[100],
              },
              height: '500px' }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  Add Picture
                </Typography>
              </CardContent>
              <Box sx={{display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',}}>
                  {!selectedImage && (
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Card sx={{ width: '300px', 
                      cursor: 'pointer',
                      boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)', 
                      transition: 'all 0.3s ease', 
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.5)',
                      height: '300px' }}>
                      <Button sx={{ width: '300px', 
                      '&:hover': {
                        backgroundColor: grey[200],
                        color: pink[400],
                      },
                      height: '300px' }}>
                      <CardMedia
                        component="img"
                        height="100%"
                        // image={add_png}
                        image={selectedMenu.ImagePath ? `${process.env.PUBLIC_URL}${selectedMenu.ImagePath}` : add_png}
                        alt="Add Button Image"
                        onClick={handleAddPicture}
                      />
                      </Button>
                    </Card>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    </Box>
                )}
                  {selectedImage && (
                  <img
                    // src={URL.createObjectURL(selectedImage)}
                    src={selectedImage}
                    alt="Preview"
                    style={{ width: '300px', maxHeight: '300px' }}
                  />
                )}
              </Box>
              <Box sx={{display: 'flex',}}>
                <DeleteButton3 sx={{ marginTop: '40px', marginLeft: '120px',
                [theme.breakpoints.down('sm')]: {
                  marginLeft: '80px',
                },
                }} onClick={handleDeletePicture}>
                Delete Picture
                </DeleteButton3>
              </Box>
            </Card>
          </Grid>
          <Box sx={{
              position: 'fixed',
              left: '10px',
              top: '90px', 
              zIndex: 1200, 
            }}>
            <BackButton1 onClick={handleBack}>Back</BackButton1>
          </Box>
          <Box sx={{
              position: 'fixed',
              right: '85px',
              bottom: '45px', 
              zIndex: 1200, 
            }}>
            <AddButton3 onClick={handleConfirm}>Confirm</AddButton3>
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default AddDishesPage;
