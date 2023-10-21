import './Menu.css'
import SharedContext from './utility/context';
import React from 'react';
function Menu(){
    const {menuData, setMenuData} = React.useContext(SharedContext);
    console.log(menuData)
    return (
        <div id='Menu'>
            <div className="menuItem">
                <div>Combo meal special</div>
                <div>One side one entree</div>
                <div>Price</div>
                <div className='menuItemPic'>pic</div> 
                {menuData.map(item => <div>{item.name}</div>)}
            </div>
        </div>
    )
}

export default Menu; 
