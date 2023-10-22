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

    useEffect(() => {
        if (selectedItem) {
            setSelectedSpice('');
            setSelectedMeat('');
        }
    }, [selectedItem]);

    if (selectedItem && menuData) {
        const spiceOptions = menuData.options.SPICE.values;
        const meatOptions = menuData.options.MEAT.values;

        return (
            <Dialog
                open={isDialogOpen}
                onClose={onClose}
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
                        <p className='item-price'>${selectedItem.price.toFixed(2)}</p>
                    </DialogContentText>
                    <RadioGroup
                        value={selectedSpice}
                        onChange={(e) => setSelectedSpice(e.target.value)}
                    >   
                        {menuData.options.SPICE.description}
                        {Object.keys(spiceOptions).map((spiceLevel) => (
                            <div>
                            <FormControlLabel
                                key={spiceLevel}
                                value={spiceLevel}
                                control={<Radio />}
                                label={spiceLevel}
                            />
                            <Divider />
                            </div>
                        ))}
                        
                    </RadioGroup>

                    <RadioGroup
                        value={selectedMeat}
                        onChange={(e) => setSelectedMeat(e.target.value)}
                    >   
                        {menuData.options.MEAT.description}
                        {Object.keys(meatOptions).map((meatType) => (
                            <div>
                            <FormControlLabel
                                key={meatType}
                                value={meatType}
                                control={<Radio />}
                                label={meatType}
                            />
                            <Divider />
                            </div>
                        ))}
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Disagree</Button>
                    <Button onClick={onClose} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
    return null;  
}

export default AddToCartDialog;