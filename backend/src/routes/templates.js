import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { getDB } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import path from 'path';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: 'uploads/templates/',
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Get all templates
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const templates = await db
      .collection('templates')
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get template by ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const template = await db
      .collection('templates')
      .findOne({ _id: req.params.id });

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    // Increment usage count
    await db.collection('templates').updateOne(
      { _id: req.params.id },
      { $inc: { usageCount: 1 } }
    );

    res.json(template);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
