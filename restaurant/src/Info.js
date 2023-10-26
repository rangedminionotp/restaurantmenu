import React from "react";
import './info.css';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import { IconButton } from "@mui/material";

import AccessTimeIcon from '@mui/icons-material/AccessTime';

function Info() {
    return (
        <div id='info'>
            <div id="about">
                <div id='restName'>Datang Kitchen</div>
                <div className='restInfo'>
                    <div>Chinese Cuisine</div>
                    <div>Dine-In · Take-Out · Delivery</div>
                    <div><IconButton><a href='https://www.google.com/maps/place/35041+Fremont+Blvd,+Fremont,+CA+94536/@37.5721707,-122.0277051,15z/data=!4m6!3m5!1s0x808fbfcead8ff347:0x5f93360ba866c1a1!8m2!3d37.5703212!4d-122.0319537!16s%2Fg%2F11bw4c94s4?entry=ttu'><LocationOnIcon/></a></IconButton>35041 Fremont Blvd, Fremont, CA 94536</div>
                    <div><IconButton><a href="tel:5015651717"><PhoneIcon /></a></IconButton>Phone: (501)565-1717</div>
                </div>
            </div>

            <div id="hours">
                <div className="restHours">
                    <div id='hourTitle'>
                        <div><AccessTimeIcon /></div>
                        Business Hours </div>
                    <div>Monday: Closed</div>
                    <div>Tuesday-Saturday: 11am-8pm</div>
                    <div>Sunday: 12-8pm</div>
                </div>
            </div>
        </div>
    )
}

export default Info;