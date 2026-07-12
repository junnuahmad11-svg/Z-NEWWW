import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDB } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

// Get user projects
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const projects = await db
      .collection('projects')
      .find({ userId: req.user._id.toString() })
      .sort({ updatedAt: -1 })
      .toArray();

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const project = await db.collection('projects').findOne({
      _id: req.params.id,
      userId: req.user._id.toString(),
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create project
router.post('/', async (req, res) => {
  try {
    const db = getDB();
    const { name, timeline, settings } = req.body;

    const project = {
      _id: uuidv4(),
      userId: req.user._id.toString(),
      name,
      timeline,
      settings,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('projects').insertOne(project);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update project
router.put('/:id', async (req, res) => {
  try {
    const db = getDB();
    const { name, timeline, settings } = req.body;

    const result = await db.collection('projects').updateOne(
      { _id: req.params.id, userId: req.user._id.toString() },
      {
        $set: {
          name,
          timeline,
          settings,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('projects').deleteOne({
      _id: req.params.id,
      userId: req.user._id.toString(),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDB } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

// Get user projects
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const projects = await db
      .collection('projects')
      .find({ userId: req.user._id.toString() })
      .sort({ updatedAt: -1 })
      .toArray();

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const project = await db.collection('projects').findOne({
      _id: req.params.id,
      userId: req.user._id.toString(),
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create project
router.post('/', async (req, res) => {
  try {
    const db = getDB();
    const { name, timeline, settings } = req.body;

    const project = {
      _id: uuidv4(),
      userId: req.user._id.toString(),
      name,
      timeline,
      settings,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('projects').insertOne(project);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update project
router.put('/:id', async (req, res) => {
  try {
    const db = getDB();
    const { name, timeline, settings } = req.body;

    const result = await db.collection('projects').updateOne(
      { _id: req.params.id, userId: req.user._id.toString() },
      {
        $set: {
          name,
          timeline,
          settings,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('projects').deleteOne({
      _id: req.params.id,
      userId: req.user._id.toString(),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDB } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

// Get user projects
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const projects = await db
      .collection('projects')
      .find({ userId: req.user._id.toString() })
      .sort({ updatedAt: -1 })
      .toArray();

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const project = await db.collection('projects').findOne({
      _id: req.params.id,
      userId: req.user._id.toString(),
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create project
router.post('/', async (req, res) => {
  try {
    const db = getDB();
    const { name, timeline, settings } = req.body;

    const project = {
      _id: uuidv4(),
      userId: req.user._id.toString(),
      name,
      timeline,
      settings,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('projects').insertOne(project);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update project
router.put('/:id', async (req, res) => {
  try {
    const db = getDB();
    const { name, timeline, settings } = req.body;

    const result = await db.collection('projects').updateOne(
      { _id: req.params.id, userId: req.user._id.toString() },
      {
        $set: {
          name,
          timeline,
          settings,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('projects').deleteOne({
      _id: req.params.id,
      userId: req.user._id.toString(),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDB } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

// Get user projects
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const projects = await db
      .collection('projects')
      .find({ userId: req.user._id.toString() })
      .sort({ updatedAt: -1 })
      .toArray();

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const project = await db.collection('projects').findOne({
      _id: req.params.id,
      userId: req.user._id.toString(),
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create project
router.post('/', async (req, res) => {
  try {
    const db = getDB();
    const { name, timeline, settings } = req.body;

    const project = {
      _id: uuidv4(),
      userId: req.user._id.toString(),
      name,
      timeline,
      settings,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('projects').insertOne(project);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update project
router.put('/:id', async (req, res) => {
  try {
    const db = getDB();
    const { name, timeline, settings } = req.body;

    const result = await db.collection('projects').updateOne(
      { _id: req.params.id, userId: req.user._id.toString() },
      {
        $set: {
          name,
          timeline,
          settings,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('projects').deleteOne({
      _id: req.params.id,
      userId: req.user._id.toString(),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDB } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

// Get user projects
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const projects = await db
      .collection('projects')
      .find({ userId: req.user._id.toString() })
      .sort({ updatedAt: -1 })
      .toArray();

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const project = await db.collection('projects').findOne({
      _id: req.params.id,
      userId: req.user._id.toString(),
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create project
router.post('/', async (req, res) => {
  try {
    const db = getDB();
    const { name, timeline, settings } = req.body;

    const project = {
      _id: uuidv4(),
      userId: req.user._id.toString(),
      name,
      timeline,
      settings,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('projects').insertOne(project);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update project
router.put('/:id', async (req, res) => {
  try {
    const db = getDB();
    const { name, timeline, settings } = req.body;

    const result = await db.collection('projects').updateOne(
      { _id: req.params.id, userId: req.user._id.toString() },
      {
        $set: {
          name,
          timeline,
          settings,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('projects').deleteOne({
      _id: req.params.id,
      userId: req.user._id.toString(),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDB } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

// Get user projects
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const projects = await db
      .collection('projects')
      .find({ userId: req.user._id.toString() })
      .sort({ updatedAt: -1 })
      .toArray();

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const project = await db.collection('projects').findOne({
      _id: req.params.id,
      userId: req.user._id.toString(),
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create project
router.post('/', async (req, res) => {
  try {
    const db = getDB();
    const { name, timeline, settings } = req.body;

    const project = {
      _id: uuidv4(),
      userId: req.user._id.toString(),
      name,
      timeline,
      settings,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('projects').insertOne(project);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update project
router.put('/:id', async (req, res) => {
  try {
    const db = getDB();
    const { name, timeline, settings } = req.body;

    const result = await db.collection('projects').updateOne(
      { _id: req.params.id, userId: req.user._id.toString() },
      {
        $set: {
          name,
          timeline,
          settings,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('projects').deleteOne({
      _id: req.params.id,
      userId: req.user._id.toString(),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDB } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

// Get user projects
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const projects = await db
      .collection('projects')
      .find({ userId: req.user._id.toString() })
      .sort({ updatedAt: -1 })
      .toArray();

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const project = await db.collection('projects').findOne({
      _id: req.params.id,
      userId: req.user._id.toString(),
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create project
router.post('/', async (req, res) => {
  try {
    const db = getDB();
    const { name, timeline, settings } = req.body;

    const project = {
      _id: uuidv4(),
      userId: req.user._id.toString(),
      name,
      timeline,
      settings,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('projects').insertOne(project);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update project
router.put('/:id', async (req, res) => {
  try {
    const db = getDB();
    const { name, timeline, settings } = req.body;

    const result = await db.collection('projects').updateOne(
      { _id: req.params.id, userId: req.user._id.toString() },
      {
        $set: {
          name,
          timeline,
          settings,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('projects').deleteOne({
      _id: req.params.id,
      userId: req.user._id.toString(),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
