// src/pages/signup.jsx
import React, { useState } from 'react';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { poolData } from '../awsConfig';
import { useNavigate, Link } from 'react-router-dom';

const userPool = new CognitoUserPool(poolData);

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    userPool.signUp(email, password, [], null, (err, result) => {
      if (err) {
        alert(err.message || JSON.stringify(err));
        return;
      }

      alert('Signup successful. Please check your email for a confirmation code.');
      navigate('/confirm'); // 👈 Redirect to confirmation page
    });
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form className="auth-form" onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign Up</button>
        <p>Already have an account? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  );
}

export default Signup;
