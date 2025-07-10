import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateItem } from '../services/api';

function EditItem() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const itemToEdit = state?.item;

  const [item, setItem] = useState({
    itemId: '',
    name: '',
    description: '',
    quantity: '',
    price: '',
    category: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (!itemToEdit) {
      alert('No item data found.');
      navigate('/');
    } else {
      setItem(itemToEdit);
    }
  }, [itemToEdit, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!item.name || item.quantity <= 0) {
      alert('Name and quantity are required.');
      return;
    }

    try {
      await updateItem({
        ...item,
        quantity: parseInt(item.quantity),
        price: parseFloat(item.price)
      });
      alert('Item updated successfully!');
      navigate('/');
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update item.');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', margin: '40px auto' }}>
      <h2 style={{ marginBottom: '20px', fontWeight: 'bold' }}>✏️ Edit Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Name</label>
          <input className="form-control" type="text" name="name" value={item.name} onChange={handleChange} required />
        </div>

        <div className="form-group mb-3">
          <label>Description</label>
          <textarea className="form-control" name="description" value={item.description} onChange={handleChange} rows={3} />
        </div>

        <div className="form-group mb-3">
          <label>Quantity</label>
          <input className="form-control" type="number" name="quantity" value={item.quantity} onChange={handleChange} />
        </div>

        <div className="form-group mb-3">
          <label>Price (INR)</label>
          <input className="form-control" type="number" name="price" value={item.price} onChange={handleChange} />
        </div>

        <div className="form-group mb-3">
          <label>Category</label>
          <input className="form-control" type="text" name="category" value={item.category} onChange={handleChange} />
        </div>

        <div className="form-group mb-4">
          <label>Image URL</label>
          <input className="form-control" type="text" name="imageUrl" value={item.imageUrl} onChange={handleChange} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
        Cancel
        </button>

          <button type="submit" className="btn btn-success">Save Changes</button>
        </div>
      </form>
    </div>
  );
}

export default EditItem;
