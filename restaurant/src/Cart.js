import React from "react";
import TopBar from "./TopBar";
import SharedContext from './utility/context';
import './Cart.css';
import CartItems from "./CartItems"; 
function Cart() {
    const { menuData , cartItems, setCartItems} = React.useContext(SharedContext);

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
     
    const tax = menuData.tax;
    
    const submitOrder = () => {
       
        // Send the order to the server
        fetch('http://localhost:3001/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cartItems)
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
            // Clear the cart
            setCartItems([]);
            localStorage.setItem('cart', '[]');
        }).catch((error) => {
            console.log(error);
        });
        
    }

    const getSubtotal = () => {
        var subtotal = 0;
        for (const itemData of cartItems) {  
            if (itemData) { 
                var totalItemPrice = itemData.totalPrice;  
                subtotal += parseFloat(totalItemPrice);
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
        <div id='cart'>
            <TopBar />  
            <CartItems /> 
            <div className="order-summary">
                <div>Subtotal: ${getSubtotal().toFixed(2)}</div>
                <div>Tax: ${getTax().toFixed(2)}</div>
                <div>Total: ${getTotal().toFixed(2)}</div>
                <h3>Please pay in person</h3>
            </div>

            <div className="order-details">
                <input type="text" placeholder="Name" />
                <input type="tel" placeholder="Phone Number" />
                <button onClick={submitOrder}>Send Order</button>
            </div> 
        </div> 
    )
}

export default Cart;