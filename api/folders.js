const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Folder = require('../models/Folder');
const calculateFolderSize = require('../utils/folderSize');

router.post('/', auth, async (req, res) => {
  try {
    const { name, parentFolderId } = req.body;
    const folder = new Folder({ name, parentFolderId: parentFolderId || null, userId: req.user._id });
    await folder.save();
    res.status(201).json(folder);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { parentFolderId } = req.query;
    const query = { userId: req.user._id };
    if (parentFolderId !== undefined) {
      query.parentFolderId = parentFolderId === 'null' ? null : parentFolderId;
    }
    const folders = await Folder.find(query);
    
    const foldersWithSize = await Promise.all(folders.map(async (folder) => {
      const size = await calculateFolderSize(folder._id);
      return { ...folder.toObject(), size };
    }));
    
    res.json(foldersWithSize);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/tree', auth, async (req, res) => {
  try {
    const folders = await Folder.find({ userId: req.user._id });
    const buildTree = (parentId = null) => {
      return folders
        .filter(f => String(f.parentFolderId) === String(parentId))
        .map(f => ({ ...f.toObject(), children: buildTree(f._id) }));
    };
    res.json(buildTree());
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
