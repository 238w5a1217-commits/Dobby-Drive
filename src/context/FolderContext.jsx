import React, { createContext, useState, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const FolderContext = createContext();

export const FolderProvider = ({ children }) => {
  const [folders, setFolders] = useState([]);
  const [folderTree, setFolderTree] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFolders = useCallback(async (parentFolderId = null) => {
    try {
      const res = await api.get('/folders', { params: { parentFolderId } });
      setFolders(res.data);
    } catch (error) {
      toast.error('Failed to fetch folders');
    }
  }, []);

  const fetchFolderTree = useCallback(async () => {
    try {
      const res = await api.get('/folders/tree');
      setFolderTree(res.data);
    } catch (error) {
      toast.error('Failed to fetch folder tree');
    }
  }, []);

  const fetchImages = useCallback(async (folderId = null) => {
    try {
      setLoading(true);
      const res = await api.get(`/images/${folderId}`);
      setImages(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const createFolder = async (name, parentFolderId = null) => {
    try {
      await api.post('/folders', { name, parentFolderId });
      toast.success('Folder created');
      fetchFolders(parentFolderId);
      fetchFolderTree();
      return true;
    } catch (error) {
      toast.error('Failed to create folder');
      return false;
    }
  };

  const uploadImage = async (file, folderId = null) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      if (folderId) formData.append('folderId', folderId);

      await api.post('/images/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Image uploaded');
      fetchImages(folderId);
      return true;
    } catch (error) {
      toast.error('Failed to upload image');
      return false;
    }
  };

  return (
    <FolderContext.Provider value={{
      folders, folderTree, images, loading,
      fetchFolders, fetchFolderTree, fetchImages,
      createFolder, uploadImage
    }}>
      {children}
    </FolderContext.Provider>
  );
};
