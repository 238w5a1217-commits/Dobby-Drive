import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FolderContext } from '../context/FolderContext';
import FolderTree from './FolderTree';
import { LogOut, HardDrive } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const { logout, user } = useContext(AuthContext);
  const { fetchFolderTree } = useContext(FolderContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFolderTree();
  }, [fetchFolderTree]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <HardDrive size={32} color="var(--primary)" />
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Dobby Drive</h1>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>
          MY FOLDERS
        </div>
        <FolderTree />
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '50%', 
              backgroundColor: 'var(--primary)', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0
            }}>
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={user?.username}>
              {user?.username}
            </span>
          </div>
          <button 
            onClick={handleLogout} 
            className="btn btn-outline"
            style={{ width: '100%', color: '#ff6b6b', borderColor: 'rgba(255, 107, 107, 0.2)' }}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
