import React, { useState } from "react";
import SharedContext from './utility/context';
import CartItemContext from "./utility/CartItemContext";
import { IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddToCartDialog from './AddToCartDialog';

function CartItems() {
    const { cartItems, setCartItems } = React.useContext(CartItemContext);
    const { menuData } = React.useContext(SharedContext);
    const [isAddToCartDialogOpen, setAddToCartDialogOpen] = useState(false);

    const showAddToCartDialog = () => {
        setAddToCartDialogOpen(true);
    };

    if (!menuData || !menuData.categories) {
        return <div className="menu">Loading...</div>;
    }

    const increaseQuantity = (itemData) => {
        const updatedCartItems = cartItems.map((item) => {
            if (
                item.itemID === itemData.itemID 
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
                item.itemID === itemData.itemID && item.instructions === itemData.instructions
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
                        <div className="cart-item-quantity">
                            <div className="cart-item-img">
                                <img className="cart-item-image" src={itemData.img} alt={itemData.name} />
                            </div>
                            <IconButton onClick={() => decreaseQuantity(itemData)} disabled={itemData.quantity === 1}>
                                <RemoveCircleOutlineIcon />
                            </IconButton>
                            <div className="cart-item-quantity-number">quantity: {itemData.quantity}</div>
                            <IconButton onClick={() => increaseQuantity(itemData)}>
                                <AddCircleOutlineIcon />
                            </IconButton>
                        </div> 
                        <div className="cart-item-preferences">Preferences: {itemData.instructions}</div>
                    </div>
                );
            })}
            <IconButton onClick={showAddToCartDialog}>
                Add Item
            </IconButton>
            <AddToCartDialog
                open={isAddToCartDialogOpen}
                onClose={() => setAddToCartDialogOpen(false)}
            />
        </div>
    );
}

export default CartItems;