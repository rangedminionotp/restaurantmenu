import React, { useState } from 'react';
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

function AddToCartDialog({ onClose }) {
    const { isDialogOpen, selectedItem, options } = React.useContext(SharedContext);
    const [selectedSpice, setSelectedSpice] = useState('');

    if (selectedItem) { 
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
                        {options.values &&
                            Object.keys(options.values).map((spiceLevel) => (
                                <FormControlLabel
                                    key={spiceLevel}
                                    value={spiceLevel}
                                    control={<Radio />}
                                    label={spiceLevel}
                                />
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
}

export default AddToCartDialog;