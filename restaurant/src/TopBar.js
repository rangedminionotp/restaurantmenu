import React from "react";
import './TopBar.css' 
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
function TopBar() {

    return (
        <div id="topbar">
            <nav>
                <ul>
                    <li><a href="/#about">About</a></li>
                    <li><a href="/#hours">Hours</a></li>
                    <li><a href="/#order">Order</a></li>
                </ul>
                <a href="#" class="shopping-icon"><ShoppingCartIcon/></a>
            </nav>
        </div>
    );
}

export default TopBar;
