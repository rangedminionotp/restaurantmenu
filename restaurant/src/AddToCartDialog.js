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
function AddToCartDialog({ onClose }) {
    const { isDialogOpen, selectedItem, menuData } = React.useContext(SharedContext);
    const [selectedSpice, setSelectedSpice] = useState('');
    const [selectedMeat, setSelectedMeat] = useState('');
    const [isAgreeDisabled, setIsAgreeDisabled] = useState(true);
    const [cost, setCost] = useState(0);
    const [spiceCost, setSpiceCost] = useState(0);
    const [meatCost, setMeatCost] = useState(0);
    const [quantity, setQuantity] = useState(1);  
    const [userPreferences, setUserPreferences] = useState('');

    useEffect(() => {
        if (selectedItem) {
            setSelectedSpice('');
            setSelectedMeat('');
            setIsAgreeDisabled(true);
            setCost(selectedItem.price.toFixed(2));
        }
    }, [selectedItem]);

    // Function to reset all state variables
    const resetState = () => {
        setSelectedSpice('');
        setSelectedMeat('');
        setIsAgreeDisabled(true);
        setCost(0);
        setSpiceCost(0);
        setMeatCost(0);
        setQuantity(1);
        setUserPreferences('')
    };

    const handleSelectedSpiceChange = (e) => {
        setSelectedSpice(e.target.value);
        const spiceValue = menuData.options.SPICE.values[e.target.value];
        setSpiceCost(spiceValue);
        recalculateTotalCost(spiceValue, meatCost);
        checkAgreeButtonState(e.target.value, selectedMeat);
    };

    const handleSelectedMeatChange = (e) => {
        setSelectedMeat(e.target.value);
        const meatValue = menuData.options.MEAT.values[e.target.value];
        setMeatCost(meatValue);
        recalculateTotalCost(spiceCost, meatValue);
        checkAgreeButtonState(selectedSpice, e.target.value);
    };  

    const increaseQuantity = () => {
        const newQuantity = quantity + 1;
        const newTotalCost = (parseFloat(selectedItem.price) + parseFloat(spiceCost) + parseFloat(meatCost)) * newQuantity;
        setQuantity(newQuantity);
        setCost(newTotalCost.toFixed(2));
    };
    
    const decreaseQuantity = () => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            const newTotalCost = (parseFloat(selectedItem.price) + parseFloat(spiceCost) + parseFloat(meatCost)) * newQuantity;
            setQuantity(newQuantity);
            setCost(newTotalCost.toFixed(2));
        }
    };
    
    const recalculateTotalCost = (spice, meat) => {
        const newTotalCost = parseFloat((parseFloat(selectedItem.price) + parseFloat(spice) + parseFloat(meat))) * parseFloat(quantity); 
        setCost(newTotalCost.toFixed(2));
    };

    const checkAgreeButtonState = (spice, meat) => { 
        if (menuData && menuData.options && menuData.options.SPICE && menuData.options.MEAT) {
            setIsAgreeDisabled(!(spice && meat));
        }
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
        const newCartItem = {
            'categorieID': item.categorieID,
            'itemID': item.itemID,
            'quantity': quantity,
            'instructions': userPreferences,
            'totalPrice': cost,
            'options': {
                'SPICES': selectedSpice,
                'MEAT': selectedMeat
            },
            'price': cost/quantity,
            'name': selectedItem.name,
            'img': 'https://www.thesprucepets.com/thmb/AyzHgPQM_X8OKhXEd8XTVIa-UT0=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-145577979-d97e955b5d8043fd96747447451f78b7.jpg'
        };
        currentCartItems.push(newCartItem);
     
        const updatedCartItemsJSON = JSON.stringify(currentCartItems); 
        localStorage.setItem('cart', updatedCartItemsJSON);
    
        resetState();
        onClose();
    }

    if (selectedItem && menuData && menuData.options) {
        const spiceOptions = menuData.options.SPICE.values;
        const meatOptions = menuData.options.MEAT.values;

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
                    <RadioGroup
                        value={selectedSpice}
                        onChange={handleSelectedSpiceChange}
                        className='radio-group-options'
                    >   
                        <div className='radio-group-label'>{menuData.options.SPICE.description} {menuData.options.SPICE.required && '(Required)'}</div>
                        {Object.keys(spiceOptions).map((spiceLevel) => (
                            <div className='radio-button'>
                                <FormControlLabel
                                    key={spiceLevel}
                                    value={spiceLevel}
                                    control={<Radio />}
                                    label={spiceOptions[spiceLevel] > 0 ? `${spiceLevel} +$${spiceOptions[spiceLevel].toFixed(2)}` : spiceLevel}
                                />
                                <Divider />
                            </div>
                        ))}
                    </RadioGroup>

                    <RadioGroup
                        value={selectedMeat}
                        onChange={handleSelectedMeatChange}
                    >   
                        <div className='radio-group-label'>{menuData.options.MEAT.description} {menuData.options.MEAT.required && '(Required)'}</div>
                        {Object.keys(meatOptions).map((meatType) => (
                            <div className='radio-button' key={meatType}>
                                <FormControlLabel
                                    value={meatType}
                                    control={<Radio />}
                                    label={meatOptions[meatType] > 0 ? `${meatType} +$${meatOptions[meatType].toFixed(2)}` : meatType}
                                />
                                <Divider />
                            </div>
                        ))}
                    </RadioGroup>
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
                    <button className='add-to-cart-btn' onClick={() => handleAddCart(selectedItem)} disabled={isAgreeDisabled}>
                        Add To Cart - ${cost}
                    </button>
                </DialogActions>
            </Dialog>
        );
    }
    return null;  
}

export default AddToCartDialog;