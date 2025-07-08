// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/signup';
import Confirm from './pages/confirm';
import Dashboard from './pages/dashboard';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to /login */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/dashboard" element={<Dashboard />} />
       


      </Routes>
    </Router>
  );
}

export default App;
