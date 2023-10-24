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

import { v4 as uuidv4 } from 'uuid';


function AddToCartDialog({ onClose}) {
    const { isDialogOpen, selectedItem, menuData, selectedOptions, setSelectedOptions, cartState, setCartState } = React.useContext(SharedContext); 
    const [isAgreeDisabled, setIsAgreeDisabled] = useState(true);
    const [cost, setCost] = useState(0); 
    const [quantity, setQuantity] = useState(1);  
    const [userPreferences, setUserPreferences] = useState('');
    
    useEffect(() => {
        if (selectedItem && menuData && menuData.options) {
            // Calculate the cost based on the selected options and quantity
            let newCost = selectedItem.price; 
             
            for (const key of Object.keys(selectedOptions)) {
                const selectedValue = selectedOptions[key];
                const additionalCost = menuData.options[key].values[selectedValue]; 
                newCost = parseFloat(additionalCost) + parseFloat(newCost); 
            }
    
            // Set the new cost taking into account the quantity
            setCost((newCost * quantity).toFixed(2));
    
            // Check if all required choices are checked
            setIsAgreeDisabled(!areAllRequiredChoicesChecked());
        }
    }, [selectedOptions, selectedItem, menuData, quantity]);

    // Function to reset all state variables
    const resetState = () => { 
        setIsAgreeDisabled(true);
        setCost(0); 
        setQuantity(1);
        setUserPreferences('')
        setSelectedOptions({})
    };

    const handleOptionChange = (optionKey, value) => {
        // Update the selected options with the new value 
        setSelectedOptions({
            ...selectedOptions,
            [optionKey]: value,
        });
    }
    
    const increaseQuantity = () => {
        setQuantity(quantity+1)
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
        const itemToEditIndex = currentCartItems.findIndex((cartItem) => cartItem.options === item.options && cartItem.instructions === item.instructions);

        if (itemToEditIndex !== -1) { 
            currentCartItems[itemToEditIndex] = {
                ...currentCartItems[itemToEditIndex],
                quantity: currentCartItems[itemToEditIndex].quantity + quantity,
                instructions: userPreferences,
                totalPrice: cost,
                options: selectedOptions,
                price: cost / quantity, 
            };
            const updatedCartItemsJSON = JSON.stringify(currentCartItems);
            localStorage.setItem('cart', updatedCartItemsJSON); 
        }
        else {
        const newCartItem = {
            'categorieID': item.categorieID,
            'itemID': item.itemID,
            'quantity': quantity,
            'instructions': userPreferences,
            'totalPrice': cost,
            'options': selectedOptions,
            'price': cost/quantity,
            'name': selectedItem.name,
            'ogPrice': item.price,
            'cartID': uuidv4(),
            'img': 'https://www.thesprucepets.com/thmb/AyzHgPQM_X8OKhXEd8XTVIa-UT0=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-145577979-d97e955b5d8043fd96747447451f78b7.jpg'
        };
        currentCartItems.push(newCartItem);
     
        const updatedCartItemsJSON = JSON.stringify(currentCartItems); 
        localStorage.setItem('cart', updatedCartItemsJSON); 
        
        }
        resetState();
        onClose();
    }

    const handleEditCart = (item) => { 
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
                            src='https://www.thesprucepets.com/thmb/AyzHgPQM_X8OKhXEd8XTVIa-UT0=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-145577979-d97e955b5d8043fd96747447451f78b7.jpg'/>
                        <p className='item-description'>{selectedItem.description}</p>
                        <p className='item-price'>${cost}</p>
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
                <IconButton disabled={quantity == 1}>
                        <RemoveCircleOutlineIcon onClick={decreaseQuantity}/>
                    </IconButton> 
                    
                    {quantity}
                    <IconButton>
                        <AddCircleOutlineIcon onClick={increaseQuantity} /> 
                    </IconButton>
                    <button onClick={() => handleCancel()} autoFocus>
                        Cancel
                    </button>
                    <button className='add-to-cart-btn' 
                    onClick={() => cartState == 'add' ? handleAddCart(selectedItem) : handleEditCart(selectedItem)}
                    disabled={isAgreeDisabled}>
                        Add To Cart - ${cost}
                    </button>
                </DialogActions>
            </Dialog>
        );
    }
    return null;  
}

export default AddToCartDialog;