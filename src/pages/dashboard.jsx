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
  

  const handleEdit = (item) => {
    navigate('/edit-item', { state: { item } });
  };


  useEffect(() => {
    const user = userPool.getCurrentUser();
    if (user) {
      user.getSession((err, session) => {
        if (err || !session.isValid()) return;
        user.getUserAttributes((err, attrs) => {
          const emailAttr = attrs.find(a => a.getName() === 'email');
          setUsername(emailAttr?.getValue());
        });
      });
    }

    loadStock();
  }, []);

  const loadStock = async () => {
    try {
      const data = await fetchItems();
      const items = Array.isArray(data) ? data : data.items || [];
      setStock(items);
    } catch (e) {
      console.error('Load error:', e);
      setStock([]);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to remove this item?')) return;
    try {
      await deleteItem(itemId);
      loadStock();
    } catch (e) {
      alert("Failed to remove item");
    }
  };

  const filteredStock = stock.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === '' ||
      (item.category && item.category.toLowerCase().includes(categoryFilter.toLowerCase()));
    const price = parseFloat(item.price);
    const min = parseFloat(priceMin);
    const max = parseFloat(priceMax);
    const matchesPrice = (isNaN(min) || price >= min) && (isNaN(max) || price <= max);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="dashboard">
      {/* Top Title Bar */}
      <div className="top-bar" style={{ textAlign: 'center', padding: '20px 0', background: '#1e1e1e', color: '#fff' }}>
        <h1>Inventory Dashboard</h1>
      </div>

      {/* User Header */}
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px' }}>
        <div><strong>Welcome,</strong> {username}</div>
        <button
          className="logout-button"
          style={{ background: 'crimson', color: '#fff', border: 'none', padding: '6px 12px' }}
          onClick={() => {
            userPool.getCurrentUser()?.signOut();
            navigate('/login');
          }}
        >
          Logout
        </button>
      </div>

      {/* Dashboard Body */}
      <div className="dashboard-body" style={{ padding: '0 20px' }}>
        <h2>Stock Overview</h2>
        <p>Displays stock levels, filters, and alerts.</p>

        {/* Filter Controls */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <button
            onClick={() => navigate('/add-item')}
            style={{ padding: '8px 16px', backgroundColor: '#007bff', color: '#fff', border: 'none' }}
          >
            ➕ Add Item
          </button>

          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: '6px', flex: 1, minWidth: '200px' }}
          />

          <input
            type="text"
            placeholder="Filter by category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ padding: '6px', flex: 1, minWidth: '180px' }}
          />

          <input
            type="number"
            placeholder="Min Price"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            style={{ padding: '6px', width: '100px' }}
          />

          <input
            type="number"
            placeholder="Max Price"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            style={{ padding: '6px', width: '100px' }}
          />

          <button
            onClick={() => {
              setSearch('');
              setCategoryFilter('');
              setPriceMin('');
              setPriceMax('');
            }}
            style={{ padding: '6px 12px', background: '#6c757d', color: '#fff', border: 'none' }}
          >
            Reset
          </button>
        </div>
         <button onClick={() => navigate('/sales-history')} style={{ padding: '8px 12px' }}>
            📈 View Sales History
    </button>

        {/* Table */}
        <table className="stock-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f4f4f4' }}>
              <th style={{ padding: '10px' }}>Item</th>
              <th>Quantity</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStock.length > 0 ? (
              filteredStock.map((item) => (
                <tr key={item.itemId}>
                  <td style={{ padding: '8px' }}>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.category || '-'}</td>
                  <td>₹{item.price}</td>
                  <td>{item.quantity < 10 ? '⚠️ Low Stock' : '✅ OK'}</td>
                  <td>
                  <button onClick={() => handleEdit(item)} style={{ marginRight: '10px' }}>
                               Edit
                </button>
                   <button onClick={() => handleRemoveItem(item.itemId)} style={{ color: 'red' }}>
                         Remove
                       </button>
                        </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '10px' }}>No items found.</td>
              </tr>
            )}
          </tbody>
        </table>

       
      </div>
    </div>
  );
}

export default Dashboard;
