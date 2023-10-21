import React from "react";
import './Menu.css'
import SharedContext from './utility/context'; 

function Menu() {
    const { menuData, setMenuData } = React.useContext(SharedContext);

    // Check if menuData exists and has categories
    if (!menuData || !menuData[0] || !menuData[0].categories) {
        return <div>Loading...</div>;
    }

    // Extract categories from menuData
    const categories = menuData[0].categories;

    return (
        <div id='Menu'>
            <div className="menuItem">
                <div>Combo meal special</div>
                <div>One side one entree</div>
                <div>Price</div>
                <div className='menuItemPic'>pic</div> 
            </div>

            {/* Map through categories and their items */}
            {Object.keys(categories).map((sectionName) => {
                const section = categories[sectionName];
                return (
                    <div key={sectionName}>
                        <h2>{section.description}</h2>
                        {Object.keys(section.items).map((itemName) => {
                            const item = section.items[itemName];
                            return (
                                <div key={itemName}>
                                    <h3>{itemName}</h3>
                                    <p>Description: {item.description}</p>
                                    <p>Price: {item.price}</p>
                                    <p>Options:</p>
                                    <ul>
                                        {item.options["Spice level"].map((option, index) => (
                                            <li key={index}>{option.description}</li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}

export default Menu;
