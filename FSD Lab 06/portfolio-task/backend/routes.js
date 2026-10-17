const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');
const models = require('./models');

const router = express.Router();

/* Helpers */
function requireFields(fields) {
  return (req, res, next) => {
    const missing = fields.filter((f) => !req.body[f] || !String(req.body[f]).trim());
    if (missing.length > 0) {
      return res.status(400).json({ message: `Please fill in: ${missing.join(', ')}` });
    }
    next();
  };
}

function checkLevel(req, res, next) {
  const level = Number(req.body.level);
  if (Number.isNaN(level) || level < 0 || level > 100) {
    return res.status(400).json({ message: 'Level must be between 0 and 100' });
  }
  next();
}

const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(__dirname, 'uploads'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname).toLowerCase())
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) return cb(null, true);
    const err = new Error('Only image files are allowed');
    err.status = 400;
    cb(err);
  },
  limits: { fileSize: 2 * 1024 * 1024 }
});

/* Profile */
router.get('/profile', async (req, res, next) => {
  try {
    res.json(await models.profile.get());
  } catch (err) {
    next(err);
  }
});

router.post('/profile', upload.single('image'), requireFields(['name', 'title', 'email']), async (req, res, next) => {
  try {
    if (!req.body.email.includes('@')) {
      return res.status(400).json({ message: 'Please enter a valid email' });
    }

    const old = await models.profile.get();
    const image = req.file ? '/uploads/' + req.file.filename : null;
    await models.profile.save({ ...req.body, image });

    if (req.file && old && old.image) {
      fs.unlink(path.join(__dirname, old.image), () => {});
    }
    res.json({ message: 'Profile saved' });
  } catch (err) {
    next(err);
  }
});

/* Skills, education, experience and projects share the same CRUD routes */
function addCrudRoutes(name, model, requiredFields, extraCheck) {
  const checks = extraCheck ? [requireFields(requiredFields), extraCheck] : [requireFields(requiredFields)];
  const url = '/' + name;

  router.get(url, async (req, res, next) => {
    try {
      res.json(await model.getAll());
    } catch (err) {
      next(err);
    }
  });

  router.post(url, checks, async (req, res, next) => {
    try {
      res.status(201).json({ id: await model.create(req.body) });
    } catch (err) {
      next(err);
    }
  });

  router.put(url + '/:id', checks, async (req, res, next) => {
    try {
      const changed = await model.update(req.params.id, req.body);
      if (!changed) return res.status(404).json({ message: 'Item not found' });
      res.json({ message: 'Updated' });
    } catch (err) {
      next(err);
    }
  });

  router.delete(url + '/:id', async (req, res, next) => {
    try {
      const removed = await model.remove(req.params.id);
      if (!removed) return res.status(404).json({ message: 'Item not found' });
      res.json({ message: 'Deleted' });
    } catch (err) {
      next(err);
    }
  });
}

addCrudRoutes('skills', models.skills, ['name', 'level'], checkLevel);
addCrudRoutes('education', models.education, ['degree', 'institute']);
addCrudRoutes('experience', models.experience, ['role', 'company']);
addCrudRoutes('projects', models.projects, ['title']);

module.exports = router;
