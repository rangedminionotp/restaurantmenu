import React, { useState } from "react";
import SharedContext from './utility/context';
import CartItemContext from "./utility/CartItemContext";
import { IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddToCartDialog from './AddToCartDialog';
import DeleteIcon from '@mui/icons-material/Delete'; 
import { handleDeleteItem } from './AddToCartDialog'; // Import the handleDeleteItem function

function CartItems() { 
    const { menuData, setIsDialogOpen, setSelectedItem, setSelectedOptions, setCartState, cartItems, setCartItems, quantity, setQuantity } = React.useContext(SharedContext); 
    
    React.useEffect(() => {
        const storedCartItems = localStorage.getItem('cart');
        const currentCartItems = storedCartItems ? JSON.parse(storedCartItems) : [];
     
        updateCart(currentCartItems);
    }, []);

    const showAddToCartDialog = (item) => { 
        setSelectedItem(item);
        setQuantity(item.quantity);
        setIsDialogOpen(true);
        setSelectedOptions(item.options);
        setCartState('edit');
    };

    const handleClose = () => {
        setIsDialogOpen(false);
        setSelectedItem(null);   
    }
 

    const handleDelete = (itemData) => {
        // Use the imported handleDeleteItem function
        handleDeleteItem(itemData, () => {
            // Callback function to update your cart data if needed
            // For example, you may want to remove the item from your cartItems state
            const updatedCartItems = cartItems.filter(item => item.cartID !== itemData.cartID);
            updateCart(updatedCartItems);
        }, handleClose);
    };

    if (!menuData || !menuData.categories) {
        return <div className="menu">Loading...</div>;
    }

    const increaseQuantity = (itemData) => {
        const updatedCartItems = cartItems.map((item) => {
            if (
                item.cartID === itemData.cartID
            ) {
                item.quantity += 1;
                item.totalPrice = (item.quantity * item.singlePrice).toFixed(2);
            }
            return item;
        });
        updateCart(updatedCartItems);
    };

    const decreaseQuantity = (itemData) => {
        const updatedCartItems = cartItems.map((item) => { 
            if (
                item.cartID === itemData.cartID
            ) {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                    item.totalPrice = (item.quantity * item.singlePrice).toFixed(2);
                }
            }
            return item;
        });
        updateCart(updatedCartItems);
    };

    const updateCart = (updatedCartItems) => {
        localStorage.setItem('cart', JSON.stringify(updatedCartItems));
        setCartItems(updatedCartItems);
    };

    return (
        <div className='cart-container'>
            {cartItems.map((itemData, index) => {
                return (
                    <div className='cart-item' key={index}>
                        <div className="cart-item-name">{itemData.name}</div>
                        <div className="cart-item-price">price: ${itemData.totalPrice}</div>
                        
                            <div className="cart-item-img">
                                <img className="cart-item-image" src={itemData.img} alt={itemData.name} />
                            </div>
                            <div className="cart-item-quantity">
                            <IconButton>
                                {itemData.quantity !== 1 ? <RemoveCircleOutlineIcon onClick={() => decreaseQuantity(itemData)}/> : <DeleteIcon onClick={() => handleDelete(itemData)} />}
                            </IconButton>
                            <div className="cart-item-quantity-number">quantity: {itemData.quantity}</div>
                            <IconButton onClick={() => increaseQuantity(itemData)}>
                                <AddCircleOutlineIcon />
                            </IconButton>
                        </div>  
                        {Object.keys(itemData.options).map((optionKey) => (
                            <div>{menuData.options[optionKey].name}: {`${itemData.options[optionKey]}`}
                            
                            </div>
                        ))}
                        <button onClick={()=>showAddToCartDialog(itemData)} className='cart-item-options-editbtn'>Edit</button>
                        <button onClick={() => handleDelete(itemData)} className='cart-item-options-deletebtn'>Remove Item</button>
                        <div className="cart-item-preferences">Preferences: {itemData.instructions}</div>
                    </div>
                );
            })} 
            <AddToCartDialog 
                onClose={handleClose} 
            />
        </div>
    );
}

export default CartItems;