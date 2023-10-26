import React from "react";
import './TopBar.css';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { IconButton } from "@mui/material";

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
                <IconButton onClick={redirectCart}> 
                        <ShoppingCartIcon /> 
                </IconButton>
            </nav>
        </div>
    );
}

export default TopBar;