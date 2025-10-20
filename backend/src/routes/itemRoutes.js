import express from 'express';
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} from '../controllers/itemController.js';

const router = express.Router();

// RESTful routes
router.get('/', getAllItems);           // GET /api/items - Get all items
router.get('/:id', getItemById);        // GET /api/items/:id - Get item by ID
router.post('/', createItem);           // POST /api/items - Create new item
router.put('/:id', updateItem);         // PUT /api/items/:id - Update item
router.delete('/:id', deleteItem);      // DELETE /api/items/:id - Delete item

export default router;
