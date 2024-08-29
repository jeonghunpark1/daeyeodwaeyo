import React from 'react';
import './App.css';
import Header from './components/Header';
import { Routes, Route, BrowserRouter } from "react-router-dom";

const App:React.FC = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
      </div>
    </BrowserRouter>
  );
}

export default App;
