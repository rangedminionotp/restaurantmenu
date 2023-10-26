import React, { useState, useEffect } from 'react';
import SharedContext from './utility/context';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import './AddToCartDialog.css';
import { Divider, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import DeleteIcon from '@mui/icons-material/Delete';

import DeleteItemDialog from './DeleteItemDialog';
import { v4 as uuidv4 } from 'uuid';

function handleDeleteItem(selectedItem, resetState, onClose) {
  if (selectedItem) {
    // Get the cart items from localStorage
    const storedCartItems = localStorage.getItem('cart');
    const currentCartItems = storedCartItems ? JSON.parse(storedCartItems) : [];

    // Find the index of the item to delete based on the cartID
    const itemToDeleteIndex = currentCartItems.findIndex(
      (cartItem) => cartItem.cartID === selectedItem.cartID
    );

    if (itemToDeleteIndex !== -1) {
      // Remove the item from the array
      currentCartItems.splice(itemToDeleteIndex, 1);

      // Store the updated items back in localStorage
      const updatedCartItemsJSON = JSON.stringify(currentCartItems);
      localStorage.setItem('cart', updatedCartItemsJSON);

      // Reset the state and close the dialog
      resetState();
      onClose();
    }
  }
}

function AddToCartDialog({ onClose }) {
  const { isDialogOpen, selectedItem, menuData, selectedOptions, setSelectedOptions, cartState, setCartState, setDeleteDialogOpen, setCartItems} = React.useContext(SharedContext);
  const [isAgreeDisabled, setIsAgreeDisabled] = useState(true);
  const [cost, setCost] = useState(0);
  const [quantity, setQuantity] = useState(selectedItem ? selectedItem.quantity : 1);
  const [userPreferences, setUserPreferences] = useState('');  

  const handleClickOpen = () => {
    setDeleteDialogOpen(true);
  };

  const handleClose = () => {
    setDeleteDialogOpen(false);
  };
  useEffect(() => { 
    if (selectedItem && menuData && menuData.options) {
      let newCost = selectedItem.price; 
      for (const key of Object.keys(selectedOptions)) {
        const selectedValue = selectedOptions[key];
        const additionalCost = menuData.options[key].values[selectedValue];
        newCost = parseFloat(additionalCost) + parseFloat(newCost);
      }
  
      // Adjusted: Set the new cost taking into account the quantity
      newCost = (newCost * quantity).toFixed(2);
      setCost(newCost);
  
      // Check if all required choices are checked
      setIsAgreeDisabled(!areAllRequiredChoicesChecked());
    }
  }, [selectedItem, selectedOptions, menuData, quantity]);

  // Function to reset all state variables
  const resetState = () => {
    setIsAgreeDisabled(true);
    setCost(0);
    setQuantity(1);
    setUserPreferences('');
    setSelectedOptions({});
  };

  const handleOptionChange = (optionKey, value) => {
    // Update the selected options with the new value
    setSelectedOptions({
      ...selectedOptions,
      [optionKey]: value,
    });
  };

  const increaseQuantity = () => {  
    setQuantity(quantity + 1); 
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {  
      setQuantity(quantity - 1);  
    }
  };

  const areAllRequiredChoicesChecked = () => {
    for (const optionKey in menuData.options) {
      const option = menuData.options[optionKey];
      if (option.required && !selectedOptions[optionKey]) {
        return false; // A required choice is not checked
      }
    }
    return true; // All required choices are checked
  };

  const handleUserPreferencesChange = (e) => {
    setUserPreferences(e.target.value);
  };

  // Function to handle the "Cancel" button
  const handleCancel = () => {
    resetState();
    onClose();
  };

  const handleAddCart = (item) => {
    const storedCartItems = localStorage.getItem('cart');
    const currentCartItems = storedCartItems ? JSON.parse(storedCartItems) : [];

    // Check if there is a similar item in the cart with the same options and instructions
    const existingCartItemIndex = currentCartItems.findIndex((cartItem) => (
      cartItem.itemID === item.itemID &&
      JSON.stringify(cartItem.options) === JSON.stringify(selectedOptions) &&
      cartItem.instructions === userPreferences
    ));

    if (existingCartItemIndex !== -1) {
      // If an existing item is found, update its quantity
      currentCartItems[existingCartItemIndex].quantity += quantity;
      currentCartItems[existingCartItemIndex].totalPrice = (currentCartItems[existingCartItemIndex].quantity * currentCartItems[existingCartItemIndex].price).toFixed(2);
    } else {
      // If no existing item is found, add a new one
      const newCartItem = {
        'categorieID': item.categorieID,
        'itemID': item.itemID,
        'quantity': quantity,
        'instructions': userPreferences,
        'totalPrice': cost,
        'options': selectedOptions,
        'singlePrice': cost / quantity,
        'name': selectedItem.name,
        'price': item.price,
        'cartID': uuidv4(),
        'img': 'https://www.thesprucepets.com/thmb/AyzHgPQM_X8OKhXEd8XTVIa-UT0=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-145577979-d97e955b5d8043fd96747447451f78b7.jpg',
      };
      currentCartItems.push(newCartItem);
    }

    const updatedCartItemsJSON = JSON.stringify(currentCartItems);
    localStorage.setItem('cart', updatedCartItemsJSON);
    resetState();
    onClose();
  };

  const handleEditCart = (item) => {
    setCartState('add');
    const storedCartItems = localStorage.getItem('cart');
    const currentCartItems = storedCartItems ? JSON.parse(storedCartItems) : [];

    // Find the item to edit by some identifier, such as 'itemID' or 'name'
    const itemToEditIndex = currentCartItems.findIndex((cartItem) => cartItem.cartID === item.cartID);

    if (itemToEditIndex !== -1) {
      // Edit the item in the array
      currentCartItems[itemToEditIndex] = {
        ...currentCartItems[itemToEditIndex],
        quantity: quantity,
        instructions: userPreferences,
        totalPrice: cost,
        options: selectedOptions,
        price: cost / quantity,
      };

      // Store the updated items back in localStorage
      const updatedCartItemsJSON = JSON.stringify(currentCartItems);
      localStorage.setItem('cart', updatedCartItemsJSON);
    }
    setQuantity(quantity);
    setCartItems(currentCartItems);
    resetState();
    onClose();
  };
 
  if (selectedItem && menuData && menuData.options) {
    return (
      <Dialog
        open={isDialogOpen}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        id="add-to-cart-dialogue"
        sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      >
        <DialogTitle id="alert-dialog-title">
          {selectedItem.name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <img className='item-img'
              src='https://www.thesprucepets.com/thmb/AyzHgPQM_X8OKhXEd8XTVIa-UT0=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-145577979-d97e955b5d8043fd96747447451f78b7.jpg' />
            <p className='item-description'>{selectedItem.description}</p>
            <p className='item-price'>${cartState === 'add' ? cost : selectedItem.totalPrice}</p>
          </DialogContentText>
          <Divider />
          {Object.keys(menuData.options).map((optionKey) => (
            <div key={optionKey}>
              <div className='radio-group-label'>{menuData.options[optionKey].description} {menuData.options[optionKey].required && '(Required)'}</div>
              <RadioGroup
                value={selectedOptions[optionKey]} // Set the selected value
                onChange={(e) => handleOptionChange(optionKey, e.target.value)} // Call handleOptionChange on change
              >
                {Object.keys(menuData.options[optionKey].values).map((value, index) => (
                  <div className='radio-button' key={index}>
                    <FormControlLabel
                      value={value}
                      control={<Radio />}
                      label={
                        menuData.options[optionKey].values[value] > 0
                          ? `${value} +$${Number(menuData.options[optionKey].values[value])}`
                          : value
                      }
                    />
                    <Divider />
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
          <div className='user-preferences'>Preferences (Optional)</div>
          <TextareaAutosize
            aria-label="Add Special Instructions"
            minRows={10}
            value={userPreferences}
            onChange={handleUserPreferencesChange}
            placeholder="Enter special instructions here..."
            className="user-preferences-textarea"
          />
        </DialogContent>
        <DialogActions className='dialog-actions'>
          {cartState === 'edit' ? ( // Only show DeleteIcon when in 'edit' mode
            <IconButton>
              <DeleteIcon onClick={handleClickOpen} />
            </IconButton>
          ) : (
            <IconButton disabled={quantity === 1}>
              <RemoveCircleOutlineIcon onClick={decreaseQuantity} />
            </IconButton>
          )}
           {cartState === 'add' ? quantity : selectedItem.quantity}
          <IconButton>
            <AddCircleOutlineIcon onClick={increaseQuantity} />
          </IconButton>
          <button onClick={() => handleCancel()} autoFocus>
            Cancel
          </button>
          <button
            className='add-to-cart-btn'
            onClick={() => {
              if (cartState === 'add') {
                handleAddCart(selectedItem);
              } else if (cartState === 'edit') {
                handleEditCart(selectedItem);
              }
            }}
            disabled={isAgreeDisabled}
          >
          {cartState === 'add' ? `Add To Cart - $${cost}` : `Update Cart - $${selectedItem.totalPrice}`}
        </button>
        </DialogActions>
        <DeleteItemDialog handleClose={handleClose} handleDelete={() => handleDeleteItem(selectedItem, resetState, onClose)} />
      </Dialog>
    );
  }
  return null;
}

export default AddToCartDialog;

export { handleDeleteItem };