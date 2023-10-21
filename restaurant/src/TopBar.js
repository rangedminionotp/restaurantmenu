import React from "react";
import './TopBar.css'
import cart from "./images/shopping-bag.png";

function TopBar() {

    return (
        <div id="topbar">
            <nav>
                <ul>
                    <li><a href="#">Home</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
                <a href="#" class="shopping-icon"><img src={cart} alt="Shopping Bag" /></a>
            </nav>
        </div>
    );
}

export default TopBar;
