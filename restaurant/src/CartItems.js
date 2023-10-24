import React, { useState } from "react";
import SharedContext from './utility/context';
import CartItemContext from "./utility/CartItemContext";
import { IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddToCartDialog from './AddToCartDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteItemDialog from "./DeleteItemDialog";
function CartItems() {
    const { cartItems, setCartItems } = React.useContext(CartItemContext);
    const { menuData, setIsDialogOpen, setSelectedItem, setSelectedOptions, setCartState } = React.useContext(SharedContext); 
    
    React.useEffect(() => {
        const storedCartItems = localStorage.getItem('cart');
        const currentCartItems = storedCartItems ? JSON.parse(storedCartItems) : [];
     
        updateCart(currentCartItems);
    }, []);

    const showAddToCartDialog = (item) => { 
        setSelectedItem(item);
        setIsDialogOpen(true);
        setSelectedOptions(item.options)
        setCartState('edit')
    };

    const handleClose = () => {
        setIsDialogOpen(false);
        setSelectedItem(null);   
    }

    if (!menuData || !menuData.categories) {
        return <div className="menu">Loading...</div>;
    }

    const increaseQuantity = (itemData) => {
        const updatedCartItems = cartItems.map((item) => {
            if (
                item.cartID === itemData.cartID
            ) {
                item.quantity += 1;
                item.totalPrice = (item.quantity * item.price).toFixed(2);
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
                    item.totalPrice = (item.quantity * item.price).toFixed(2);
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
                                {itemData.quantity !== 1 ? <RemoveCircleOutlineIcon onClick={() => decreaseQuantity(itemData)}/> : <DeleteIcon />}
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