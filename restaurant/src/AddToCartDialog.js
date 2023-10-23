import React, { useState, useEffect } from 'react';
import SharedContext from './utility/context';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import './AddToCartDialog.css';
import { Divider } from '@mui/material';

function AddToCartDialog({ onClose }) {
    const { isDialogOpen, selectedItem, menuData } = React.useContext(SharedContext);
    const [selectedSpice, setSelectedSpice] = useState('');
    const [selectedMeat, setSelectedMeat] = useState('');
    const [isAgreeDisabled, setIsAgreeDisabled] = useState(true);
    const [cost, setCost] = useState(0);
    const [spiceCost, setSpiceCost] = useState(0);
    const [meatCost, setMeatCost] = useState(0);
    const [quantity, setQuantity] = useState(1);  

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

    const recalculateTotalCost = (spice, meat) => { 
        const newTotalCost = (parseFloat(selectedItem.price) + parseFloat(spice) + parseFloat(meat)) * quantity;
        setCost(newTotalCost.toFixed(2));
    }; 

    const checkAgreeButtonState = (spice, meat) => { 
        if (menuData && menuData.options && menuData.options.SPICE && menuData.options.MEAT) {
            setIsAgreeDisabled(!(spice && meat));
        }
    };

    // Function to handle the "Cancel" button
    const handleCancel = () => {
        resetState();
        onClose();
    };

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
                    <RadioGroup
                        value={selectedSpice}
                        onChange={handleSelectedSpiceChange}
                    >   
                        <div>{menuData.options.SPICE.description} (Required) {menuData.options.SPICE.required && '(Required)'}</div>
                        {Object.keys(spiceOptions).map((spiceLevel) => (
                            <div>
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
                        <div>{menuData.options.MEAT.description} (Required) {menuData.options.MEAT.required && '(Required)'}</div>
                        {Object.keys(meatOptions).map((meatType) => (
                            <div key={meatType}>
                                <FormControlLabel
                                    value={meatType}
                                    control={<Radio />}
                                    label={meatOptions[meatType] > 0 ? `${meatType} +$${meatOptions[meatType].toFixed(2)}` : meatType}
                                />
                                <Divider />
                            </div>
                        ))}
                    </RadioGroup>
                </DialogContent> 
                <DialogActions> 
                    <button onClick={() => handleCancel()} autoFocus>
                        Cancel
                    </button>
                    <button onClick={() => handleCancel()} disabled={isAgreeDisabled}>
                        Add To Cart - ${cost}
                    </button>
                </DialogActions>
            </Dialog>
        );
    }
    return null;  
}

export default AddToCartDialog;