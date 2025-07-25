import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SpaceFarmingGame from "./components/SpaceColonyGame";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SpaceFarmingGame />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;