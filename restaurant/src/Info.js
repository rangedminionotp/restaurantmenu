import React from "react";
import './info.css';

function Info() {
    return (
        <div id='info'>
            <div id="about">
                <div id='restName'>Datang Kitchen</div>
                <div className='restInfo'>
                    <div>Chinese Cuisine</div>
                    <div>Dine-In · Take-Out · Delivery</div>
                    <div>35041 Fremont Blvd, Fremont, CA 94536</div>
                    <div><a href="tel:5015651717">Phone: (501)565-1717</a></div>
                </div>
            </div>

            <div id="hours">
                <div className="restHours">
                    <div id='hourTitle'>Business Hours</div>
                    <div>Monday: Closed</div>
                    <div>Tuesday-Saturday: 11am-8pm</div>
                    <div>Sunday: 12-8pm</div>
                </div>
            </div>
        </div>
    )
}

export default Info;