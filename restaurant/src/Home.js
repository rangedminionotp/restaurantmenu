import React, { useEffect } from 'react';
import Info from "./Info";
import Menu from "./Menu"; 
import TopBar from "./TopBar";

function Home () {

    // scroll down if there is a hash in the URL
    useEffect(() => {
        const hash = window.location.hash;
        if (hash && hash !== '') {
        const targetElementId = hash.substring(1);
        const targetElement = document.querySelector(`#${targetElementId}`);
        if (targetElement) {
            targetElement.scrollIntoView();
        }
        }
    })

    return (
        <div id='Home'>
            <TopBar />
            <Info />
            <Menu /> 
        </div>
    )
}

export default Home;