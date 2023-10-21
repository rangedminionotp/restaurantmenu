import React, { useEffect, useState } from "react";
import SharedContext from "./utility/context";
import Info from "./Info";
import Menu from "./Menu"; 
function App() {
  const [jsonData, setJsonData] = useState(null);

  useEffect(() => {
    // Fetch the JSON data from the server
    fetch("http://localhost:3001", { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        // Set the JSON data in the state variable
        setJsonData(data);
      })
      .catch((error) => {
        console.error("Error fetching JSON data:", error);
      });
  }, []);

  return (
    <SharedContext.Provider value = {{jsonData, setJsonData}}>
    <div className="App">
      <header className="App-header"> 
      </header>
      <Info />
      <Menu />
      {jsonData && (
        <div>{JSON.stringify(jsonData, null, 2)} </div>
      )}
    </div>
    </SharedContext.Provider>
  );
}

export default App;
 