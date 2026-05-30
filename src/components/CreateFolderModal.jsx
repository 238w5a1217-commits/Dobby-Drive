import React, { useState, useContext } from 'react';
import { FolderContext } from '../context/FolderContext';
import { X } from 'lucide-react';

const CreateFolderModal = ({ onClose, currentFolderId }) => {
  const [folderName, setFolderName] = useState('');
  const [loading, setLoading] = useState(false);
  const { createFolder } = useContext(FolderContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!folderName.trim()) return;
    
    setLoading(true);
    const success = await createFolder(folderName, currentFolderId === 'null' ? null : currentFolderId);
    setLoading(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Create New Folder</h2>
          <button onClick={onClose} style={{ background: 'none', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Folder Name" 
            className="input-field"
            value={folderName}
            onChange={e => setFolderName(e.target.value)}
            autoFocus
            required
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Folder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFolderModal;
