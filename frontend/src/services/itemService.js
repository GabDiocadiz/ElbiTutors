import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const itemService = {
  // Get all items
  getAllItems: async () => {
    const response = await axios.get(`${API_URL}/items`);
    return response.data;
  },

  // Get item by ID
  getItemById: async (id) => {
    const response = await axios.get(`${API_URL}/items/${id}`);
    return response.data;
  },

  // Create new item
  createItem: async (itemData) => {
    const response = await axios.post(`${API_URL}/items`, itemData);
    return response.data;
  },

  // Update item
  updateItem: async (id, itemData) => {
    const response = await axios.put(`${API_URL}/items/${id}`, itemData);
    return response.data;
  },

  // Delete item
  deleteItem: async (id) => {
    const response = await axios.delete(`${API_URL}/items/${id}`);
    return response.data;
  }
};

export default itemService;
