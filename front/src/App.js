import React from 'react';
import './App.css';
import Header from './components/Header';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from './pages/Login';
import Main from './pages/Main';
import SignUp from './pages/SignUp';
import Footer from './components/Footer';

export default function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          {/* <Route path="/" element={<Index />}></Route> */}
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/main" element={<Main />}></Route>
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
