import React, { useState, useContext } from 'react';
import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUser
} from 'amazon-cognito-identity-js';
import { poolData } from '../awsConfig';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authcontext'; // ✅ import AuthContext

const userPool = new CognitoUserPool(poolData);

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext); // ✅ get setUser from context

  const handleLogin = (e) => {
    e.preventDefault();

    const user = new CognitoUser({
      Username: email,
      Pool: userPool
    });

    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password
    });

    user.authenticateUser(authDetails, {
      onSuccess: (result) => {
        console.log('✅ Login success. Token:', result.getIdToken().getJwtToken());

        setUser(user); // ✅ Set user context — this keeps the user logged in
        navigate('/dashboard'); // ✅ Redirect after login
      },
      onFailure: (err) => {
        alert(err.message || JSON.stringify(err));
      }
    });
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form className="auth-form" onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Log In</button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        Don’t have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}

export default Login;
