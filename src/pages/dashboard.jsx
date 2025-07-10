// src/pages/dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { poolData } from '../awsConfig';
import { fetchItems, deleteItem } from '../services/api';

const userPool = new CognitoUserPool(poolData);

function Dashboard() {
  const [username, setUsername] = useState('');
  const [stock, setStock] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const navigate = useNavigate();

  // load user and stock
  useEffect(() => {
    const user = userPool.getCurrentUser();
    if (user) {
      user.getSession((err, session) => {
        if (!err && session.isValid()) {
          user.getUserAttributes((_, attrs) => {
            const emailAttr = attrs.find(a => a.getName() === 'email');
            setUsername(emailAttr?.getValue());
          });
        }
      });
    }
    loadStock();
  }, []);

  const loadStock = async () => {
    try {
      const data = await fetchItems();
      const items = Array.isArray(data) ? data : data.items || [];
      setStock(items);
    } catch {
      setStock([]);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!window.confirm('Remove this item?')) return;
    await deleteItem(itemId);
    loadStock();
  };

  // filters
  const filteredStock = stock.filter(item => {
    const nameMatch = item.name.toLowerCase().includes(search.toLowerCase());
    const catMatch = !categoryFilter || (item.category || '').toLowerCase().includes(categoryFilter.toLowerCase());
    const price = parseFloat(item.price);
    const min = parseFloat(priceMin);
    const max = parseFloat(priceMax);
    const priceMatch = (isNaN(min) || price >= min) && (isNaN(max) || price <= max);
    return nameMatch && catMatch && priceMatch;
  });

  return (
    <div className="dashboard-container">
      {/* Top bar: title + user/logout */}
      <div className="top-bar">
        <h1 className="dashboard-title">Inventory Dashboard</h1>
        <div className="dashboard-user">
          {username}
          <button
            className="logout-button"
            onClick={() => {
              userPool.getCurrentUser()?.signOut();
              navigate('/login');
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="dashboard-body">
        <h2>Stock Overview</h2>
        <div className="dashboard-actions">
          <button onClick={() => navigate('/add-item')} className="primary-btn">
            ➕ Add Item
          </button>
          <button onClick={() => navigate('/sales-history')} className="secondary-btn">
            📈 View Sales History
          </button>
          <input
            type="text"
            placeholder="Search items…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="filter-input"
          />
          <input
            type="text"
            placeholder="Category…"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="filter-input"
          />
          <input
            type="number"
            placeholder="Min Price"
            value={priceMin}
            onChange={e => setPriceMin(e.target.value)}
            className="filter-input small"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={priceMax}
            onChange={e => setPriceMax(e.target.value)}
            className="filter-input small"
          />
          <button onClick={() => {
            setSearch(''); setCategoryFilter(''); setPriceMin(''); setPriceMax('');
          }} className="secondary-btn">
            Reset
          </button>
        </div>

        <table className="stock-table">
          <thead>
            <tr>
              <th>Item</th><th>Qty</th><th>Category</th><th>Price</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStock.length ? filteredStock.map(item => (
              <tr key={item.itemId}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.category || '–'}</td>
                <td>₹{item.price}</td>
                <td>{item.quantity < 10 ? '⚠️ Low' : '✅ OK'}</td>
                <td>
                  <button onClick={() => navigate('/edit-item', { state: { item }})} className="secondary-btn small">
                    Edit
                  </button>
                  <button onClick={() => handleRemoveItem(item.itemId)} className="danger-btn small">
                    Remove
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6">No items found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
