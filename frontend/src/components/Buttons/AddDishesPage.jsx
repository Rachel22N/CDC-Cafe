import React, { useState, useEffect } from 'react';
import ColorTheme from '../Theme';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.png';
import LoginButton from '../Managers/LoginButton';
import {  InputLabel, Select, MenuItem, FormControl, CardMedia, Grid, ThemeProvider, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Button, Card, CardContent, Icon, TextField, Checkbox, } from '@mui/material';
import { grey, pink } from '@mui/material/colors';
import AddButton3 from './AddButton3';
import BackButton1 from './BackButton1';
import add_png from './addbutton.png';
import AddButton5 from './AddButton5';
import DeleteButton3 from './DeleteButton3';
import { useTheme } from '@mui/material/styles';
// const IMAGESAVEPATH = '../Images/';
const IMAGESAVEPATH = '/';

function AddDishesPage () {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [category, setCategory] = useState('');
  const [categoryID, setCategoryID] = useState('');
  const [price, setPrice] = useState(0.00);
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const theme = useTheme();
  const [isPriceValid, setIsPriceValid] = useState(true);

  let navigate = useNavigate();
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

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  }
  // const handlePriceChange = (event) => {
  //   setPrice(parseFloat(parseFloat(event.target.value).toFixed(2)));
  // }
  const handlePriceChange = (event) => {
    const newValue = parseFloat(event.target.value);
    if (newValue < 0) {
        setIsPriceValid(false);
       
    } else {
        setIsPriceValid(true);
        setPrice(parseFloat(newValue.toFixed(2)));
    }
};

  const handleIngredientsChange = (event) => {
    setIngredients(event.target.value);
  }
  const handleCategoryChange = (event) => {
    event.target.key = categories.find(item => item.Name === event.target.value).CategoryID;
    setCategory(event.target.value);
    setCategoryID(event.target.key);
  }
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  }


  const [categories, setCategories] = useState([]);

  // add pictures
  //const [selectedImage, setSelectedImage] = React.useState(null);
  const fileInputRef = React.useRef(null);
  const handleAddPicture = () => {
    fileInputRef.current.click();
  }
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(IMAGESAVEPATH + file.name);
      // const reader = new FileReader();
      // reader.onloadend = () => {
      //   setSelectedImage(reader.result);
      };
      console.log('1111111');
      console.log(IMAGESAVEPATH + file.name);
  }
  const handleDeletePicture = () => {
    setSelectedImage(null);
  };

  const handleConfirm = async(e) => {
    e.preventDefault();
    if (!price) {
      alert('Price cannot be negative. Please enter a valid price.');
      return;
    }
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('ingredients', ingredients);
    formData.append('price', price);
    formData.append('categoryID', categoryID);
    // formData.append('categoryName', category);
    formData.append('isActive', 1);
    // formData.append('ImagePath', selectedImage);
    // console.log(selectedImage);
    if (selectedImage) {
      // formData.append('image', selectedImage);
      formData.append('image', selectedImage);
    }
    formData.append('DisplayOrder', parseInt(localStorage.getItem('min_menuitem_display_order'), 10) - 1);
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }


    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}: ${value}`);
    // }

    try {
      const response = await fetch('http://localhost:5000/api/submitmenuitems', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Menu item uploaded successfully');
        navigate('/managerpage');
      } else {
        console.error('Upload failed');
      }
    } catch (error) {
      console.error('Error:', error);
  }
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/menucategories')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('There was a problem with the fetch operation:', error));
  }, []);


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
            }}> 
            <Card sx={{ width: '400px',
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
                  fullWidth margin="normal"
                  onChange={handleTitleChange}
                  inputProps={{
                    style: {
                      color: grey[700],
                    },
                  }}
                />
                <TextField
                  label="Price"
                  variant="outlined"
                  fullWidth margin="normal"
                  onChange={handlePriceChange}
                  error={!isPriceValid}
                  helperText={!isPriceValid ? "Price cannot be negative." : ""} 
                />
                <TextField
                  label="Ingredients"
                  variant="outlined"
                  fullWidth margin="normal"
                  onChange={handleIngredientsChange}
                />

                <FormControl fullWidth margin="normal">
                  <InputLabel>Category</InputLabel>
                  <Select value={category} label="Category" onChange={handleCategoryChange}>
                    {categories.map((cat) => (
                      <MenuItem key={cat.CategoryID} value={cat.Name}>{cat.Name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField label="Description" variant="outlined" fullWidth margin="normal" onChange={handleDescriptionChange}
                  InputProps={{
                  style: {
                    height: 200,
                    alignItems: 'flex-start',
                  }}}
                />
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
              height: '600px' }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  Add Picture
                </Typography>
              </CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                {!selectedImage && (
                  <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Card sx={{ width: '300px', cursor: 'pointer', boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)', transition: 'all 0.3s ease', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.5)', height: '300px' }}>
                      <Button onClick={handleAddPicture} sx={{ width: '100%', height: '100%' }}>
                        <CardMedia
                          component="img"
                          height="100%"
                          
                          image={add_png}
                          alt="Add Button Image"
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
                    onLoad={() => URL.revokeObjectURL(selectedImage)}
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
