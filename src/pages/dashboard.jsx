import React, { useEffect, useState } from 'react';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { poolData } from '../awsConfig';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Add styles here

const userPool = new CognitoUserPool(poolData);

function Dashboard() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = userPool.getCurrentUser();

    if (user) {
      user.getSession((err, session) => {
        if (err || !session.isValid()) {
          console.error("Session error:", err);
          return;
        }

        user.getUserAttributes((err, attributes) => {
          if (err) {
            console.error("Attribute fetch error:", err);
            return;
          }

          const emailAttr = attributes.find(attr => attr.getName() === 'email');
          setUsername(emailAttr?.getValue() || 'User');
        });
      });
    }
  }, []);

  const handleLogout = () => {
    const user = userPool.getCurrentUser();
    if (user) {
      user.signOut();
    }
    navigate('/login');
  };

  return (
    <div>
      {/* Top Bar */}
      <div className="dashboard-header">
        <div className="dashboard-title">Inventory Dashboard</div>
        <div className="dashboard-user">
          Welcome, {username}
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Dashboard Body */}
      <div className="dashboard-body">
        <h2>Stock Overview</h2>
        <p>Display stock levels, filters, alerts, etc. here.</p>

        <div className="dashboard-actions">
          <button>Add Stock</button>
          <button>Remove Stock</button>
          <button>View Sales History</button>
          <input type="text" placeholder="Search items..." />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
