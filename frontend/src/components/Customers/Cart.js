import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import ColorTheme from '../Theme';
import './Cart.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, Typography } from '@mui/material';
import Header from './Header';

function Cart() {
  const navigate = useNavigate();
  const [quantities, setQuantities] = useState(JSON.parse(localStorage.getItem('quantities') || '{}'));
  const [billItems, setBillItems] = useState([]);
  const location = useLocation();
  const { tableNumber = '', numberOfPeople = '' } = location.state || {};

  useEffect(() => {
    localStorage.setItem('quantities', JSON.stringify(quantities));
  }, [quantities]);

  useEffect(() => {
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
        setBillItems(data.cart);
        const newQuantities = {};
        data.cart.forEach(item => {
          newQuantities[item.MenuItemID] = item.Quantity;
        });
        setQuantities(newQuantities);
      })
      .catch(error => {
        console.error('Error fetching cart items:', error);
      });
    }
  }, [tableNumber]);

  const updateQuantity = (menuId, change) => {
    const currentQuantity = quantities[menuId] || 0;
    const newQuantity = currentQuantity + change;
    if (newQuantity >= 0) {
      setQuantities(prevQuantities => ({
        ...prevQuantities,
        [menuId]: newQuantity
      }));
  
      setBillItems(prevBillItems => {
        return prevBillItems.map(item => {
          if (item.MenuItemID === menuId) {
            return { ...item, Quantity: newQuantity };
          }
          return item;
        }).filter(item => item.Quantity > 0);
      });
  
      const data = {
        item_id: menuId,
        quantity: newQuantity,
        order_id: tableNumber,
      };
  
      const url = newQuantity > 0 ? 'http://localhost:5000/add_to_cart' : 'http://localhost:5000/remove_from_cart';
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Update response: ', data);
      })
      .catch(error => {
        console.error('There is a problem with the update operation: ', error);
      });
    }
  };

  const totalPrice = billItems.reduce((total, item) => {
    return total + (item.Quantity * item.Price);
  }, 0);

  const handleContinueOrder = () => {
    navigate(-1);
  };

  const handlePlaceOrder = () => {
    const data = { order_id: tableNumber };

    fetch('http://localhost:5000/kitchen_add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(KitchenResponse => {
      console.log('send to kitchen');
      return fetch('http://localhost:5000/add_bill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(newResponse => {
      console.log(newResponse);
      navigate('/cusbill', { state: { tableNumber, numberOfPeople } });
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  return (
        <ThemeProvider theme={ColorTheme}>
          <div className="background">
            <Header/>
            <div className="content-container">
              <div className="text-container">
                <h2>Cart Title</h2>
                {billItems.length > 0 ? (
                  billItems.map(item => (
                    <Card key={item.MenuItemID} className="cart-item">
                      <CardContent className='item-details'>
                        <div className='item-info'>
                          <Typography variant="h5">{item.Title}</Typography>
                        </div>
                        <div className='item-price'>
                          <Typography>${item.Price}/each</Typography>
                        </div>
                       <div className='item-quantity'>
                        <button onClick={() => updateQuantity(item.MenuItemID, -1)} className='button'>-</button>
                        <Typography className="quantity">{item.Quantity}</Typography>
                        <button onClick={() => updateQuantity(item.MenuItemID, 1)} className='button'>+</button>
                       </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p>Your cart is empty.</p>
                )}
                <div className="cart-actions">
                  <Typography variant="h6" className="total-price">
                    Total Price: ${totalPrice.toFixed(2)}
                  </Typography>
                  <hr />
                  <Button variant="contained" onClick={handleContinueOrder} className='continue-button'>
                    Continue to Order
                  </Button>
                  <Button variant="contained" onClick={handlePlaceOrder} className='placeorder-button'>
                    Place Order
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ThemeProvider>
      );
    }

export default Cart;