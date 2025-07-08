// src/pages/dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { poolData } from '../awsConfig';
import '../App.css';

const userPool = new CognitoUserPool(poolData);

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const user = userPool.getCurrentUser();
    if (user) {
      user.signOut();
    }
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome to the Dashboard!</h2>
      <p>You are successfully logged in.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
