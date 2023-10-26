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
  const [isDialogOpen, setIsDialogOpen] = useState(false);  
  const [selectedItem, setSelectedItem] = useState(null);  
  const [selectedOptions, setSelectedOptions] = useState({}); 
  // Keep track if user is adding or editing
  const [cartState, setCartState] = useState('add'); 
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);  
  const [cartItems, setCartItems] = React.useState([]);
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
    <SharedContext.Provider value = {{menuData, setMenuData, isDialogOpen, setIsDialogOpen, selectedItem, setSelectedItem, selectedOptions, setSelectedOptions, cartState, setCartState, deleteDialogOpen, setDeleteDialogOpen, cartItems, setCartItems}}>
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
 