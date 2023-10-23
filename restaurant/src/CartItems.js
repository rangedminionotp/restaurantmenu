import React from "react";
import SharedContext from './utility/context';
import CartItemContext from "./utility/CartItemContext";
import { Divider, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

function CartItems() {
    const { cartItems, setCartItems } = React.useContext(CartItemContext);
    const { menuData } = React.useContext(SharedContext);

    if (!menuData || !menuData.categories) {
        return <div className="menu">Loading...</div>;
    }

    const increaseQuantity = (itemData) => {
        const updatedCartItems = cartItems.map((item) => {
            if (item.categorieID === itemData.categorieID && item.itemID === itemData.itemID) {
                item.quantity += 1;
            }
            return item;
        });
        updateCart(updatedCartItems);
    };

    const decreaseQuantity = (itemData) => {
        const updatedCartItems = cartItems.map((item) => {
            if (item.categorieID === itemData.categorieID && item.itemID === itemData.itemID) {
                if (item.quantity > 1) {
                    item.quantity -= 1;
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
                            <IconButton onClick={() => decreaseQuantity(itemData)} disabled={itemData.quantity === 1}>
                                <RemoveCircleOutlineIcon />
                            </IconButton>
                            <div className="cart-item-quantity-number">quantity: {itemData.quantity}</div>
                            <IconButton onClick={() => increaseQuantity(itemData)}>
                                <AddCircleOutlineIcon />
                            </IconButton>
                        </div>
                        <div className="cart-item-options">Spice level: {itemData.options.SPICES}</div>
                        <div className="cart-item-options">Meat Choice: {itemData.options.MEAT}</div>
                        <div className="cart-item-img"><img src={itemData.img} alt={itemData.name} /></div>
                    </div>
                );
            })}
        </div>
    );
}

export default CartItems;