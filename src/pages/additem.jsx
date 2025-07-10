import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createItem } from '../services/api';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { poolData } from '../awsConfig';

function AddItem() {
  const [item, setItem] = useState({
    name: '',
    description: '',
    quantity: 0,
    price: 0,
    category: '',
    imageUrl: ''
  });

  const navigate = useNavigate();

  // ✅ Check user session on mount
  useEffect(() => {
    const userPool = new CognitoUserPool(poolData);
    const user = userPool.getCurrentUser();

    if (!user) {
      console.log('User not found, redirecting to login');
      navigate('/login');
      return;
    }

    user.getSession((err, session) => {
      if (err || !session.isValid()) {
        console.log('Session invalid or expired');
        navigate('/login');
      }
    });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!item.name || item.quantity <= 0) {
      alert('Name and quantity are required.');
      return;
    }

    try {
      await createItem({
        ...item,
        quantity: parseInt(item.quantity),
        price: parseFloat(item.price),
      });
      alert('Item added successfully!');
      navigate('/dashboard'); // ✅ FIXED: Go to dashboard instead of root
    } catch (error) {
      console.error('Add item failed:', error);
      alert('Failed to add item');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', margin: '40px auto' }}>
      <h2 style={{ marginBottom: '20px', fontWeight: 'bold' }}>Add Inventory Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: '16px' }}>
          <label>Name</label>
          <input className="form-control" type="text" name="name" value={item.name} onChange={handleChange} required />
        </div>

        <div className="form-group" style={{ marginBottom: '16px' }}>
          <label>Description</label>
          <textarea className="form-control" name="description" value={item.description} onChange={handleChange} rows={3} />
        </div>

        <div className="form-group" style={{ marginBottom: '16px' }}>
          <label>Quantity</label>
          <input className="form-control" type="number" name="quantity" value={item.quantity} onChange={handleChange} />
        </div>

        <div className="form-group" style={{ marginBottom: '16px' }}>
          <label>Price (INR)</label>
          <input className="form-control" type="number" name="price" value={item.price} onChange={handleChange} />
        </div>

        <div className="form-group" style={{ marginBottom: '16px' }}>
          <label>Category</label>
          <input className="form-control" type="text" name="category" value={item.category} onChange={handleChange} />
        </div>

        <div className="form-group" style={{ marginBottom: '16px' }}>
          <label>Image URL</label>
          <input className="form-control" type="text" name="imageUrl" placeholder="https://example.com/image.jpg" value={item.imageUrl} onChange={handleChange} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Cancel</button>
          <button type="submit" className="btn btn-primary">Add Item</button>
        </div>
      </form>
    </div>
  );
}

export default AddItem;
