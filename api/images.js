const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const Image = require('../models/Image');

const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 4 * 1024 * 1024 } // 4MB limit for Vercel serverless functions
});

router.post('/upload', auth, upload.single('image'), async (req, res) => {
  try {
    const { folderId } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const image = new Image({
      name: req.file.originalname,
      imageUrl: base64Image,
      size: req.file.size,
      folderId: folderId && folderId !== 'null' ? folderId : null,
      userId: req.user._id
    });

    await image.save();
    res.status(201).json(image);
  } catch (error) {
    console.error('Upload error:', error);
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
