import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { getDB } from '../config/database.js';
import { authenticate, isAdmin } from '../middleware/auth.js';
import path from 'path';
import fs from 'fs/promises';

const router = express.Router();

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = file.fieldname === 'font' ? 'uploads/fonts/' : 'uploads/templates/';
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Protect all admin routes
router.use(authenticate);
router.use(isAdmin);

// ===== TEMPLATE MANAGEMENT =====

// Create template
router.post('/templates', upload.single('preview'), async (req, res) => {
  try {
    const db = getDB();
    const { name, description, duration, tracks } = req.body;

    const template = {
      _id: uuidv4(),
      name,
      description,
      duration: parseInt(duration),
      tracks: JSON.parse(tracks),
      previewUrl: req.file ? `/uploads/templates/${req.file.filename}` : null,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      usageCount: 0,
    };

    await db.collection('templates').insertOne(template);
    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update template
router.put('/templates/:id', upload.single('preview'), async (req, res) => {
  try {
    const db = getDB();
    const { name, description, duration, tracks } = req.body;

    const updateData = {
      name,
      description,
      duration: parseInt(duration),
      tracks: JSON.parse(tracks),
      updatedAt: new Date(),
    };

    if (req.file) {
      updateData.previewUrl = `/uploads/templates/${req.file.filename}`;
    }

    const result = await db.collection('templates').updateOne(
      { _id: req.params.id },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.json({ message: 'Template updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete template
router.delete('/templates/:id', async (req, res) => {
  try {
    const db = getDB();
    
    // Soft delete
    const result = await db.collection('templates').updateOne(
      { _id: req.params.id },
      { $set: { isActive: false } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all templates (including inactive)
router.get('/templates', async (req, res) => {
  try {
    const db = getDB();
    const templates = await db
      .collection('templates')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== FONT MANAGEMENT =====

// Upload font
router.post('/fonts', upload.single('font'), async (req, res) => {
  try {
    const db = getDB();
    const { name, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Font file required' });
    }

    const font = {
      _id: uuidv4(),
      name,
      category,
      filename: req.file.filename,
      url: `/uploads/fonts/${req.file.filename}`,
      format: path.extname(req.file.originalname).substring(1),
      isActive: true,
      createdAt: new Date(),
    };

    await db.collection('fonts').insertOne(font);
    res.status(201).json(font);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all fonts
router.get('/fonts', async (req, res) => {
  try {
    const db = getDB();
    const fonts = await db
      .collection('fonts')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.json(fonts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle font status
router.patch('/fonts/:id/toggle', async (req, res) => {
  try {
    const db = getDB();
    const font = await db.collection('fonts').findOne({ _id: req.params.id });

    if (!font) {
      return res.status(404).json({ error: 'Font not found' });
    }

    await db.collection('fonts').updateOne(
      { _id: req.params.id },
      { $set: { isActive: !font.isActive } }
    );

    res.json({ message: 'Font status updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete font
router.delete('/fonts/:id', async (req, res) => {
  try {
    const db = getDB();
    const font = await db.collection('fonts').findOne({ _id: req.params.id });

    if (!font) {
      return res.status(404).json({ error: 'Font not found' });
    }

    // Delete file
    await fs.unlink(`uploads/fonts/${font.filename}`);

    // Delete from database
    await db.collection('fonts').deleteOne({ _id: req.params.id });

    res.json({ message: 'Font deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== USER MANAGEMENT =====

// Get all users
router.get('/users', async (req, res) => {
  try {
    const db = getDB();
    const users = await db
      .collection('users')
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const db = getDB();
    
    // Don't allow deleting self
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot delete yourself' });
    }

    const result = await db.collection('users').deleteOne({ _id: req.params.id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== ANALYTICS =====

// Get analytics
router.get('/analytics', async (req, res) => {
  try {
    const db = getDB();

    const [userCount, templateCount, projectCount, templates] = await Promise.all([
      db.collection('users').countDocuments(),
      db.collection('templates').countDocuments({ isActive: true }),
      db.collection('projects').countDocuments(),
      db.collection('templates').find({}).sort({ usageCount: -1 }).limit(10).toArray(),
    ]);

    res.json({
      users: userCount,
      templates: templateCount,
      projects: projectCount,
      topTemplates: templates,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
