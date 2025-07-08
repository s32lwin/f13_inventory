// src/pages/confirm.jsx
import React, { useState, useEffect } from 'react';
import { CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';
import { poolData } from '../awsConfig';
import { useNavigate, useLocation } from 'react-router-dom';

const userPool = new CognitoUserPool(poolData);

function Confirm() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Pre-fill email from previous page (if available)
  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleConfirm = (e) => {
    e.preventDefault();

    const user = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    user.confirmRegistration(code, true, (err, result) => {
      if (err) {
        alert(err.message || JSON.stringify(err));
        return;
      }
      alert('Account confirmed successfully!');
      navigate('/login');
    });
  };

  return (
    <div className="auth-container">
      <h2>Confirm Account</h2>
      <form className="auth-form" onSubmit={handleConfirm}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Verification Code"
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button type="submit">Confirm</button>
      </form>
    </div>
  );
}

export default Confirm;
