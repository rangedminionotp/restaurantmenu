import React, { useEffect, useState } from "react";
import SharedContext from "./utility/context";
import Cart from "./Cart";
import Admin from "./Admin";
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';

import Home from "./Home";
const AuthenticatedRoute = () => {
  return <Navigate to='/' replace />;
};

function App() {
  const [menuData, setMenuData] = useState([]); 
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Unconditionally set the state
  const [selectedItem, setSelectedItem] = useState(null); // Unconditionally set the state
  useEffect(() => {
    // Fetch the JSON data from the server
    fetch("http://localhost:3001", { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        // Set the JSON data in the state variable
        setMenuData(data);
      })
      .catch((error) => {
        console.error("Error fetching JSON data:", error);
      });
  }, []);

  return (
    <SharedContext.Provider value = {{menuData, setMenuData, isDialogOpen, setIsDialogOpen, selectedItem, setSelectedItem}}>
      <BrowserRouter> 
        <Routes>
          <Route path='/' exact element={
            <Home />
          }/>
          <Route path='/cart' exact element={
            <Cart />
          }/>
          <Route path='/admin' exact element={
            <Admin />
          }/>
          <Route path='*' element={
              <AuthenticatedRoute>
                <Home />
              </AuthenticatedRoute>
          } />
        </Routes> 
      </BrowserRouter>
    </SharedContext.Provider>
  );
}

export default App;
 