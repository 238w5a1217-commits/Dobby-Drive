const Folder = require('../models/Folder');
const Image = require('../models/Image');

const calculateFolderSize = async (folderId) => {
  let size = 0;
  
  const images = await Image.find({ folderId });
  for (const img of images) {
    size += img.size || 0;
  }

  const childFolders = await Folder.find({ parentFolderId: folderId });
  for (const child of childFolders) {
    size += await calculateFolderSize(child._id);
  }

  return size;
};

module.exports = calculateFolderSize;
