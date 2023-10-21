import React from "react";
import './TopBar.css' 
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
function TopBar() {

    return (
        <div id="topbar">
            <nav>
                <ul>
                    <li><a href="#">Home</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
                <a href="#" class="shopping-icon"><ShoppingCartIcon/></a>
            </nav>
        </div>
    );
}

export default TopBar;
