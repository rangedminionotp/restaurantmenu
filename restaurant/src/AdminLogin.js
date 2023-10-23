import React, { useState } from "react";
import './AdminLogin.css';

function Admin() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Define the data to be sent as the request body
        const data = {
            username,
            password
        };

        try {
            const response = await fetch('http://localhost:3001/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                console.log('Login successful');

                // save the token in local storage
                const data = await response.text();
                const token = JSON.parse(data).token;

                if (!token) {
                    console.error('Login failed');
                    return;
                }
                
                localStorage.setItem('token', token);

                // reload page
                window.location.reload();

            } else {
                // Handle an error response (e.g., show an error message)
                console.error('Login failed');
            }
        } catch (error) {
            // Handle any network or request error
            console.error('Error:', error);
        }
    };

    return (
        <div className="login-body">
            
        <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Username:</label>
                <input type="text" id="username" name="username" placeholder="Enter your username" onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="form-group">
                <label>Password:</label>
                <input type="password" id="password" name="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button className="login-button" type="submit">Login</button>
        </form>
    </div>

        </div>
    )
}

export default Admin;