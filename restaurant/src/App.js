import React, { useEffect, useState } from "react";
import SharedContext from "./utility/context";
import Info from "./Info";
import Menu from "./Menu"; 
import TopBar from "./TopBar";
function App() {
  const [menuData, setMenuData] = useState([]);

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
    <SharedContext.Provider value = {{menuData, setMenuData}}>
    <div className="App">
      <TopBar />
      <Info />
      <Menu /> 
    </div>
    </SharedContext.Provider>
  );
}

export default App;
 