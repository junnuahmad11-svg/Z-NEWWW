import express from 'express';
import { getDB } from '../config/database.js';

const router = express.Router();

// Get all active fonts
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const { category } = req.query;

    const query = { isActive: true };
    if (category) query.category = category;

    const fonts = await db
      .collection('fonts')
      .find(query)
      .sort({ name: 1 })
      .toArray();

    res.json(fonts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get font categories
router.get('/categories', async (req, res) => {
  try {
    const db = getDB();
    const categories = await db
      .collection('fonts')
      .distinct('category', { isActive: true });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
