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
    
    // OPTIMIZATION: Fetch all user folders and images once to calculate sizes in memory
    // This prevents the N+1 database query problem which slows down serverless environments
    const allUserFolders = await Folder.find({ userId: req.user._id }).lean();
    const allUserImages = await Image.find({ userId: req.user._id }, 'size folderId').lean();

    const calculateSizeMem = (fId) => {
      let size = 0;
      for (const img of allUserImages) {
        if (String(img.folderId) === String(fId)) size += img.size || 0;
      }
      for (const f of allUserFolders) {
        if (String(f.parentFolderId) === String(fId)) size += calculateSizeMem(f._id);
      }
      return size;
    };

    const foldersWithSize = folders.map(folder => ({
      ...folder.toObject(),
      size: calculateSizeMem(folder._id)
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
