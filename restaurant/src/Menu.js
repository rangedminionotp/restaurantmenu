import React, { useState } from "react";
import './Menu.css';
import AddToCartDialog from './AddToCartDialog'; // Import the dialog component
import SharedContext from "./utility/context";
function Menu() {
    const { menuData, setIsDialogOpen, setSelectedItem} = React.useContext(SharedContext);
  
    if (!menuData || !menuData.categories) {
        return <div className="menu">Loading...</div>;
    }

    const categories = menuData.categories;

    const handleAdd = (item) => {
        setSelectedItem(item); // Set the selected item
        setIsDialogOpen(true); // Open the dialog 
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false); // Close the dialog
        setSelectedItem(null); // Reset the selected item
    };

    return (
        <div id='Menu'>
            <div id='order'>
                <div id='MenuTitle'>Menu</div>
                {Object.keys(categories).map((sectionName) => {
                    const section = categories[sectionName];
                    return (
                        <div key={sectionName} className='menu-section'>
                            <h2 className='section-title'>{section.description}</h2>
                            <div className='menu-items-container'>
                                {Object.keys(section.items).map((itemID) => {
                                    const item = section.items[itemID];
                                    item.itemID = itemID;
                                    item.categorieID = sectionName; 
                                    return (
                                        <div key={itemID} className='menu-item'>
                                             <img className='item-img'
                                                 src='https://www.thesprucepets.com/thmb/AyzHgPQM_X8OKhXEd8XTVIa-UT0=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-145577979-d97e955b5d8043fd96747447451f78b7.jpg'/>
                                            <div className="item-details">
                                                <h3 className='item-name'>{item.name}</h3>
                                                <p className='item-description'>{item.description}</p>
                                                <p className='item-price'>${Number(item.price).toFixed(2)}</p> 
                                            <button
                                                className='add-to-cart-button'
                                                onClick={() => handleAdd(item)} // Open the dialog
                                            >
                                                Add to Cart
                                            </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            <AddToCartDialog 
                onClose={handleCloseDialog} 
            />
        </div>
    );
}

export default Menu;