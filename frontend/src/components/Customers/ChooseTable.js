import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ColorTheme from '../Theme';
import { ThemeProvider } from '@emotion/react';
import logo from './logo.png';
import './ChooseTable.css';

function ChooseTable() {
  const [tableNumber, setTableNumber] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);

  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const handleLogoClick = (event) => {
    event.stopPropagation();
    navigate('/');
  };

  const selectTable = (number) => {
    setTableNumber(number);
  };

  const increasePeople = () => {
    if (numberOfPeople < 8){
      setNumberOfPeople(numberOfPeople + 1);
    }
  };

  const decreasePeople = () => {
    if (numberOfPeople > 1) {
      setNumberOfPeople(numberOfPeople - 1);
    }
  };

  const goToMainMenu = () => {
    if (!tableNumber) {
      setOpenDialog(true);
      return;
    }

    const data = {
      tableNumber: tableNumber,
      numberOfPeople: numberOfPeople,
    };

    console.log(data);
    // navigate('/mainmenu', { state: { tableNumber, numberOfPeople } });

    fetch('http://localhost:5000/api/add_table', {
      method:'POST',
      headers:{
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      // body: data,
    })
    .then(response => response.json())
    .then(data =>{
      navigate('/mainmenu', { state: { tableNumber, numberOfPeople } });
      console.log(data);
  })
    .catch(error => {
      console.error('There is a problem with the fetch operation');
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <ThemeProvider theme={ColorTheme}>
      <div className='background-table'>
        <header>
          <img src={logo} alt="logo" style={{ height: '60px'}} onClick={handleLogoClick}/>
        </header>
        <div className='container'>
          <div className='TableNum'>
            <h1>Table Number</h1>
            <div className='TableBtn'>
              {Array.from({ length: 15 }, (_, i) => (
                <button
                  key={i + 1}
                  className={tableNumber === i + 1 ? 'button-selected' : 'button'}
                  onClick={() => selectTable(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
          <div className='PeopleNum'>
            <h1>Number Of People</h1>
            <div>
              <button onClick={decreasePeople} className='button'>-</button>
              <span>{numberOfPeople}</span>
              <button onClick={increasePeople} className='button'>+</button>
            </div>
          </div>
        </div>
        <div className='confirm-container'>
          <Button variant="contained" onClick={goToMainMenu} sx={{ marginTop: '20px' }} className='confirm'>
            Confirm
          </Button>
        </div>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{"Missing Selection"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please choose a table number before proceeding.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>OK</Button>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}

export default ChooseTable;
