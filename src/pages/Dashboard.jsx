import React, { useContext, useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FolderContext } from '../context/FolderContext';
import Sidebar from '../components/Sidebar';
import ImageGrid from '../components/ImageGrid';
import Breadcrumbs from '../components/Breadcrumbs';
import { Menu } from 'lucide-react';

const Dashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { fetchFolders, fetchImages } = useContext(FolderContext);
  const { folderId } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const currentFolderId = folderId || 'null';

  useEffect(() => {
    if (user) {
      fetchFolders(currentFolderId);
      fetchImages(currentFolderId);
    }
  }, [user, currentFolderId, fetchFolders, fetchImages]);

  // Close sidebar when navigating to a new folder on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [folderId]);

  if (authLoading) return <div className="layout" style={{ justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="layout">
      {/* Mobile Header */}
      <div className="mobile-header">
        <button onClick={() => setIsSidebarOpen(true)} className="btn btn-outline" style={{ padding: '0.5rem', border: 'none' }}>
          <Menu size={24} />
        </button>
        <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Dobby Drive</span>
        <div style={{ width: 40 }}></div>
      </div>
      
      {/* Sidebar Overlay */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} 
        onClick={() => setIsSidebarOpen(false)}
      />

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
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
