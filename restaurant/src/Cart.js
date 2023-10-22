import React from "react";
import TopBar from "./TopBar";
import SharedContext from './utility/context';
import './Cart.css';

function Cart(){
    const { menuData } = React.useContext(SharedContext);

    if (!menuData || !menuData.categories) {
        return <div className="menu">Loading...</div>;
    }

    const categories = menuData.categories;
    const options = menuData.options;

    var cartItems = localStorage.getItem('cart');
    if (!cartItems) cartItems = "[]";
    cartItems = JSON.parse(cartItems);

    return (
        <div id='cart'>
            <TopBar />

            {
                cartItems.map((itemData, index) => {
                    var item = categories[itemData.categorieID].items[itemData.itemID]
                    var totalItemPrice = item.price
                    var itemOptions = itemData.options
                    var itemOptionsList = [];

                    for (const option in itemOptions) {
                        for(const selection of itemOptions[option]) {
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
    <button onClick={() => console.log("-1")}>-</button>
    <span>{itemData.count}</span>
    <button onClick={() => console.log("+1")}>+</button>
    <button onClick={() => console.log(itemData)}>Edit</button>
    <button onClick={() => console.log(itemData)}>Delete</button>
  </div>
  <div className='cart-item-price'>${totalItemPrice}</div>
</div>
                    )
                })
            }

        </div>
    )
}

export default Cart;