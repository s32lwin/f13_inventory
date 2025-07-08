// src/components/Header.jsx
import React, { useEffect, useState } from 'react';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { poolData } from '../awsConfig';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const userPool = new CognitoUserPool(poolData);

function Header() {
  const [username, setUsername] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = userPool.getCurrentUser();

    if (user) {
      user.getSession((err, session) => {
        if (err || !session.isValid()) return;

        user.getUserAttributes((err, attributes) => {
          if (!err && attributes) {
            const nameAttr = attributes.find(attr => attr.getName() === 'email' || attr.getName() === 'name');
            setUsername(nameAttr?.getValue());
          }
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
    <div className="header">
      <h2>Inventory App</h2>
      <div className="user-dropdown" onClick={() => setDropdownOpen(!dropdownOpen)}>
        {username}
        {dropdownOpen && (
          <div className="dropdown-menu">
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
