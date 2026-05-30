import React, { useContext, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FolderContext } from '../context/FolderContext';
import Sidebar from '../components/Sidebar';
import ImageGrid from '../components/ImageGrid';
import Breadcrumbs from '../components/Breadcrumbs';

const Dashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { fetchFolders, fetchImages } = useContext(FolderContext);
  const { folderId } = useParams();
  
  const currentFolderId = folderId || 'null';

  useEffect(() => {
    if (user) {
      fetchFolders(currentFolderId);
      fetchImages(currentFolderId);
    }
  }, [user, currentFolderId, fetchFolders, fetchImages]);

  if (authLoading) return <div className="layout" style={{ justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
          <Breadcrumbs currentFolderId={currentFolderId} />
          <ImageGrid currentFolderId={currentFolderId} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
