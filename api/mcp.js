const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Folder = require('../models/Folder');
const calculateFolderSize = require('../utils/folderSize');

router.post('/', auth, async (req, res) => {
  try {
    const { action, payload } = req.body;
    
    if (action === 'createFolder') {
      const { name, parentFolderId } = payload;
      const folder = new Folder({ name, parentFolderId: parentFolderId || null, userId: req.user._id });
      await folder.save();
      return res.status(201).json(folder);
    }
    
    if (action === 'getFolders') {
      const { parentFolderId } = payload || {};
      const query = { userId: req.user._id };
      if (parentFolderId !== undefined) {
        query.parentFolderId = parentFolderId === 'null' ? null : parentFolderId;
      }
      const folders = await Folder.find(query);
      
      const foldersWithSize = await Promise.all(folders.map(async (folder) => {
        const size = await calculateFolderSize(folder._id);
        return { ...folder.toObject(), size };
      }));
      
      return res.json(foldersWithSize);
    }
    
    return res.status(400).json({ error: 'Unknown action' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
