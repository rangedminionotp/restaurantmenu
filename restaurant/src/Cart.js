import React from "react";
import TopBar from "./TopBar";
import SharedContext from './utility/context';
import './Cart.css';
import CartItems from "./CartItems";
import CartItemContext from "./utility/CartItemContext";

function Cart() {
    const [cartItems, setCartItems] = React.useState([]);
    const { menuData } = React.useContext(SharedContext);

    React.useEffect(() => {
        // Fetch the cart items from localStorage
        var storedCartItems = localStorage.getItem('cart');
        if (!storedCartItems) storedCartItems = "[]";
        const parsedCartItems = JSON.parse(storedCartItems);
        setCartItems(parsedCartItems);
    }, []);

    if (!menuData || !menuData.categories) {
        return <div className="menu">Loading...</div>;
    }

    const categories = menuData.categories;
    const options = menuData.options;
    const tax = menuData.tax;
    
    const submitOrder = () => {
       
    }

    const getSubtotal = () => {
    var subtotal = 0;
    for (const itemData of cartItems) {
        const category = categories[itemData.categorieID];
        const item = category ? category.items[itemData.itemID] : null;

        if (item) {
            var totalItemPrice = item.price * itemData.quantity;

            for (const option in itemData.options) {
                if (options && options[option]) {
                    for (const selection of itemData.options[option]) {
                        const optionValues = options[option].values;
                        if (optionValues && optionValues[selection]) {
                            var price = optionValues[selection];
                            totalItemPrice += price;
                        }
                    }
                }
            }

            subtotal += totalItemPrice;
        }
    }

    return subtotal;
}

    const getTax = () => {
      return getSubtotal() * tax;
    }

    const getTotal = () => {
        return getTax() + getSubtotal();
    }

    return (
        <CartItemContext.Provider value={{ cartItems, setCartItems }}>
        <div id='cart'>
            <TopBar /> 
            <div className="order-summary">
                <div>Subtotal: ${getSubtotal()}</div>
                <div>Tax: ${getTax()}</div>
                <div>Total: ${getTotal()}</div>
                <h3>Please play in person</h3>
            </div>

            <div className="order-details">
                <input type="text" placeholder="Name" />
                <input type="tel" placeholder="Phone Number" />
                <button onClick={submitOrder}>Send Order</button>
            </div>

        </div>
        </CartItemContext.Provider>
    )
}

export default Cart;