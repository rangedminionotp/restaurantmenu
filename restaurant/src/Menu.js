import React from "react";
import './Menu.css'
import SharedContext from './utility/context';

import './Menu.css';

function Menu() {
    const { menuData } = React.useContext(SharedContext);

    if (!menuData || !menuData.categories) {
        return <div className="menu">Loading...</div>;
    }

    const categories = menuData.categories;

    return (
        <div id='Menu'>
            <section id="order"></section>
            <div id='MenuTitle'>Menu</div>
            {Object.keys(categories).map((sectionName) => {
                const section = categories[sectionName];
                return (
                    <div key={sectionName} className='menu-section'>
                        <h2 className='section-title'>{section.description}</h2>
                        <div className='menu-items-container'>
                            {Object.keys(section.items).map((itemID) => {
                                const item = section.items[itemID];
                                return (
                                    <div key={itemID} className='menu-item'>
                                        <img className='item-img'
                                             src='https://www.thesprucepets.com/thmb/AyzHgPQM_X8OKhXEd8XTVIa-UT0=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-145577979-d97e955b5d8043fd96747447451f78b7.jpg'/>
                                        <div className="item-details">
                                            <h3 className='item-name'>{item.name}</h3>
                                            <p className='item-description'>Description: {item.description}</p>
                                            <p className='item-price'>Price: ${item.price.toFixed(2)}</p>
                                            <button className='add-to-cart-button'>Add to Cart</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Menu;