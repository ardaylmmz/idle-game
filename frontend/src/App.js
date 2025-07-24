import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SpaceColonyGame from "./components/SpaceColonyGame";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SpaceColonyGame />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;