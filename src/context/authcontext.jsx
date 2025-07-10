// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { poolData } from '../awsConfig';

export const AuthContext = createContext();

const userPool = new CognitoUserPool(poolData);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = () => {
      const currentUser = userPool.getCurrentUser();
      console.log('🔍 getCurrentUser():', currentUser);

      if (currentUser) {
        currentUser.getSession((err, session) => {
          if (err) {
            console.error('❌ getSession error:', err);
            setUser(null);
          } else if (!session.isValid()) {
            console.warn('⚠️ Session is invalid');
            setUser(null);
          } else {
            console.log('✅ Session is valid');
            setUser(currentUser);
          }
          setLoading(false);
        });
      } else {
        console.warn('⚠️ No current user found');
        setUser(null);
        setLoading(false);
      }
    };

    // Slight delay to let Cognito persist session (optional but helps)
    const timer = setTimeout(fetchSession, 100);

    // Refresh session every 5 min
    const interval = setInterval(fetchSession, 5 * 60 * 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
  <AuthContext.Provider value={{ user, setUser, loading }}>
    {!loading && children}
  </AuthContext.Provider>
);

};
