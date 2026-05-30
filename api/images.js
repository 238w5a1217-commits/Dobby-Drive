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
    
    const imageObj = image.toObject();
    delete imageObj.imageUrl; // Don't send massive base64 string back in JSON
    
    res.status(201).json(imageObj);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:folderId', auth, async (req, res) => {
  try {
    const folderId = req.params.folderId === 'null' ? null : req.params.folderId;
    const images = await Image.find({ folderId, userId: req.user._id }).select('-imageUrl').lean();
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

router.get('/serve/:imageId', async (req, res) => {
  try {
    const image = await Image.findById(req.params.imageId);
    if (!image || !image.imageUrl) return res.status(404).send('Not found');
    
    const matches = image.imageUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      const buffer = Buffer.from(matches[2], 'base64');
      res.set('Content-Type', matches[1]);
      res.set('Cache-Control', 'public, max-age=31557600');
      return res.send(buffer);
    }
    res.status(400).send('Invalid format');
  } catch (error) {
    res.status(500).send('Server error');
  }
});
