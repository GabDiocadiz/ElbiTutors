import React, { useState, useEffect } from 'react';
import itemService from '../services/itemService';
import ItemForm from './ItemForm';
import './ItemList.css';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await itemService.getAllItems();
      setItems(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch items. Make sure the backend server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await itemService.deleteItem(id);
        fetchItems();
      } catch (err) {
        setError('Failed to delete item');
        console.error(err);
      }
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingItem(null);
    fetchItems();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="item-list-container">
      <h1>ElbiTutor - Item Management</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <button 
        className="btn btn-primary"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Cancel' : 'Add New Item'}
      </button>

      {showForm && (
        <ItemForm 
          item={editingItem}
          onSuccess={handleFormSuccess}
          onCancel={handleCancel}
        />
      )}

      <div className="items-grid">
        {items.length === 0 ? (
          <p className="no-items">No items found. Create your first item!</p>
        ) : (
          items.map((item) => (
            <div key={item._id} className="item-card">
              <h3>{item.name}</h3>
              <p className="item-description">{item.description}</p>
              <p className="item-price">${item.price}</p>
              <p className="item-category">Category: {item.category}</p>
              <p className={`item-stock ${item.inStock ? 'in-stock' : 'out-of-stock'}`}>
                {item.inStock ? 'In Stock' : 'Out of Stock'}
              </p>
              <div className="item-actions">
                <button 
                  className="btn btn-edit"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-delete"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ItemList;
