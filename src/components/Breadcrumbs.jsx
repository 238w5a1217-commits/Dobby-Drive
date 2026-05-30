import React, { useContext } from 'react';
import { FolderContext } from '../context/FolderContext';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Breadcrumbs = ({ currentFolderId }) => {
  const { folderTree } = useContext(FolderContext);

  const getPath = (tree, targetId, currentPath = []) => {
    if (!targetId || targetId === 'null') return [];
    
    for (const node of tree) {
      if (String(node._id) === String(targetId)) {
        return [...currentPath, node];
      }
      if (node.children && node.children.length > 0) {
        const found = getPath(node.children, targetId, [...currentPath, node]);
        if (found) return found;
      }
    }
    return null;
  };

  const path = getPath(folderTree, currentFolderId) || [];

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', fontSize: '1.25rem', fontWeight: 600 }}>
      <Link to="/dashboard" style={{ color: (!currentFolderId || currentFolderId === 'null') ? 'var(--text-main)' : 'var(--text-muted)', transition: 'color 0.2s' }}>
        Root
      </Link>
      
      {path.map((node, index) => (
        <React.Fragment key={node._id}>
          <ChevronRight size={20} style={{ color: 'var(--text-muted)', margin: '0 0.5rem' }} />
          <Link 
            to={`/folder/${node._id}`} 
            style={{ color: index === path.length - 1 ? 'var(--text-main)' : 'var(--text-muted)', transition: 'color 0.2s' }}
          >
            {node.name}
          </Link>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;
