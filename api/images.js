const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const Image = require('../models/Image');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post('/upload', auth, upload.single('image'), async (req, res) => {
  try {
    const { folderId } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const image = new Image({
      name: req.file.originalname,
      imageUrl: `/uploads/${req.file.filename}`,
      size: req.file.size,
      folderId: folderId && folderId !== 'null' ? folderId : null,
      userId: req.user._id
    });

    await image.save();
    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:folderId', auth, async (req, res) => {
  try {
    const folderId = req.params.folderId === 'null' ? null : req.params.folderId;
    const images = await Image.find({ folderId, userId: req.user._id });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
