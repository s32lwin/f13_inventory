import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/signup';
import Confirm from './pages/confirm';
import Dashboard from './pages/dashboard';
import AddItem from './pages/additem';
import './App.css';

import { AuthContext } from './context/authcontext';

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading session...</div>; // 👈 Optional loading UI

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/confirm" element={<Confirm />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/add-item"
          element={user ? <AddItem /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
