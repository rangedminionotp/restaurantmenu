import React, { useState, useEffect } from "react";
import TopBar from "./TopBar";
import './Admin.css';
import AdminLogin from "./AdminLogin";
import AdminContent from "./AdminContent";

function Admin() {
    const token = localStorage.getItem('token');
    const [login, setLogin] = useState(false);

    useEffect(() => {
        async function checkToken() {
            try {
                const response = await fetch('http://localhost:3001/checkToken', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({token: token})
                });

                if (response.ok) {
                    const data = await response.text();
                    const success = JSON.parse(data).success;

                    if (!token) {
                        console.error('Login failed');
                        return;
                    }

                    setLogin(true); // Update login state when the token is valid
                } else {
                    // Handle an error response (e.g., show an error message)
                    console.error('Login failed');
                }
            } catch (error) {
                // Handle any network or request error
                console.error('Error:', error);
            }
        }

        // Call the async function to check the token
        checkToken();
    }, [token]);


    return (
        <div>
            <TopBar />
            <div>
                {login ? <AdminContent /> : <AdminLogin />}
            </div> 
        </div>
    )
}

export default Admin;