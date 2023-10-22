import React from "react";
import TopBar from "./TopBar";
import SharedContext from './utility/context';
import './Admin.css';

function Admin(){
    const { menuData } = React.useContext(SharedContext);

    if (!menuData || !menuData.categories) {
        return <div className="menu">Loading...</div>;
    }

    const categories = menuData.categories;
    const options = menuData.options;

    return (
        <div id='cart'>
            <TopBar />
            admin page here..

            if not logged in or invalid token, show login form
            else, show admin page to edit stuff
            
        </div>
    )
}

export default Admin;