import React, { useContext, useState } from 'react';
import { FolderContext } from '../context/FolderContext';
import { Folder, FileImage, Plus, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CreateFolderModal from './CreateFolderModal';
import UploadImageModal from './UploadImageModal';

const ImageGrid = ({ currentFolderId }) => {
  const { folders, images, loading } = useContext(FolderContext);
  const navigate = useNavigate();
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const formatSize = (bytes) => {
    if (bytes === 0 || !bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading content...</div>;

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button className="btn btn-outline" onClick={() => setIsFolderModalOpen(true)}>
          <Plus size={18} /> New Folder
        </button>
        <button className="btn btn-primary" onClick={() => setIsUploadModalOpen(true)}>
          <Upload size={18} /> Upload Image
        </button>
      </div>

      {folders.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '1rem' }}>Folders</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {folders.map(folder => (
              <div 
                key={folder._id}
                onClick={() => navigate(`/folder/${folder._id}`)}
                className="glass"
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, background-color 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Folder size={24} style={{ color: 'var(--primary)', marginRight: '1rem' }} />
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{folder.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatSize(folder.size)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '1rem' }}>Images</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {images.map(image => (
              <div key={image._id} className="glass" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <div style={{ height: '180px', backgroundColor: 'var(--bg-darker)' }}>
                  <img src={image.imageUrl} alt={image.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '1rem', display: 'flex', alignItems: 'center' }}>
                  <FileImage size={20} style={{ color: 'var(--text-muted)', marginRight: '0.75rem' }} />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontWeight: 500, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{image.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatSize(image.size)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {folders.length === 0 && images.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <Folder size={48} style={{ opacity: 0.5, marginBottom: '1rem', display: 'inline-block' }} />
          <p>This folder is empty.</p>
        </div>
      )}

      {isFolderModalOpen && (
        <CreateFolderModal 
          onClose={() => setIsFolderModalOpen(false)} 
          currentFolderId={currentFolderId} 
        />
      )}

      {isUploadModalOpen && (
        <UploadImageModal 
          onClose={() => setIsUploadModalOpen(false)} 
          currentFolderId={currentFolderId} 
        />
      )}
    </div>
  );
};

export default ImageGrid;
