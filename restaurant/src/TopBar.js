import React from "react";
import './TopBar.css' 
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {useNavigate} from 'react-router-dom';

function TopBar() {
    const redirect = useNavigate();
    const redirectCart = () => {
        redirect('/cart');
    }
    
    return (
        <div id="topbar">
            <nav>
                <ul>
                    <li><a href="/#about">About</a></li>
                    <li><a href="/#hours">Hours</a></li>
                    <li><a href="/#order">Order</a></li>
                </ul>
                <a href="#" onClick={redirectCart} className="shopping-icon"><ShoppingCartIcon/></a>
            </nav>
        </div>
    );
}

export default TopBar;
