import React, { useEffect, useState } from 'react';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { poolData } from '../awsConfig';
import { fetchSales } from '../services/api'; // create this function
import { useNavigate } from 'react-router-dom';

const userPool = new CognitoUserPool(poolData);

function SalesHistory() {
  const [sales, setSales] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = userPool.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }

    user.getSession((err, session) => {
      if (err || !session.isValid()) {
        navigate('/login');
      } else {
        loadSales();
      }
    });
  }, [navigate]);

  const loadSales = async () => {
    try {
      const data = await fetchSales(); // your API call
      setSales(data || []);
    } catch (error) {
      console.error('Error loading sales:', error);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>Sales History</h2>
      {sales.length === 0 ? (
        <p>No sales records found.</p>
      ) : (
        <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale, index) => (
              <tr key={index}>
                <td>{new Date(sale.date).toLocaleString()}</td>
                <td>{sale.itemName}</td>
                <td>{sale.quantity}</td>
                <td>₹{sale.price}</td>
                <td>₹{sale.quantity * sale.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SalesHistory;
