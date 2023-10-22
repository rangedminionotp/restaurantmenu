import React  from "react";
import SharedContext from './utility/context';
import CartItemContext from "./utility/CartItemContext";


function CartItems() {
    const { cartItems, setCartItems } = React.useContext(CartItemContext);
    const { menuData } = React.useContext(SharedContext);

    if (!menuData || !menuData.categories) {
        return <div className="menu">Loading...</div>;
    }

    const categories = menuData.categories;
    const options = menuData.options;
    const tax = menuData.tax;
    
    const addRemoveItem = (item, count) => {
        const updatedCart = [...cartItems];
        const index = updatedCart.findIndex(cartItem => (
            cartItem.categorieID === item.categorieID && cartItem.itemID === item.itemID
        ));
    
        if (index !== -1) {
            updatedCart[index].quantity += count;
            if (updatedCart[index].quantity <= 0) {
                updatedCart.splice(index, 1);
            }
    
            // Update the local storage
            localStorage.setItem('cart', JSON.stringify(updatedCart));
    
            // Update the state with the new cart items
            setCartItems(updatedCart);
        }
    }

    return (
        <div className='cart-container'>
        {cartItems.map((itemData, index) => {
            var item = categories[itemData.categorieID].items[itemData.itemID]
            var totalItemPrice = item.price * itemData.quantity
            var itemOptionsList = [];

            for (const option in itemData.options) {
                for(const selection of itemData.options[option]) {
                    var name = options[option].name
                    var price = options[option].values[selection]
                    totalItemPrice += price

                    var priceStr = `$${price}`;
                    if (price == 0) priceStr = "" // don't show $0

                    itemOptionsList.push(`${name}: ${selection} ${priceStr}`);
                }
            }

            return (
                <div className='cart-item' key={index}>
                    <div className='cart-item-details'>
                        <div className='cart-item-name'>{item.name}</div>
                        <div className='cart-item-options'>
                        {itemOptionsList.map((option) => (
                            <div key={option}>{option}</div>
                        ))}
                        </div>
                    </div>
                    <div className='cart-item-actions'>
                        <button onClick={() => console.log(itemData)}>Edit</button>
                        <button onClick={() => addRemoveItem(itemData, -1)}>-</button>
                        <button onClick={() => addRemoveItem(itemData, 1)}>+</button>
                        <span>x{itemData.quantity}</span>
                    </div>
                    <div className='cart-item-price'>${totalItemPrice}</div>
                </div>
            )
        })}
        </div>
    )

}

export default CartItems;