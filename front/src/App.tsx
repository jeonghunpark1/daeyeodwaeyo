import React from 'react';
import './App.css';
import Header from './components/Header';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from './pages/Login';
import Main from './pages/Main';
import Index from './pages/Index';

const App:React.FC = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          {/* <Route path="/" element={<Index />}></Route> */}
          <Route path="/Login" element={<Login />}></Route>
          <Route path="/Main" element={<Main />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
