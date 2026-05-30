import React, { useContext } from 'react';
import { FolderContext } from '../context/FolderContext';
import { Folder, ChevronRight, ChevronDown } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const TreeNode = ({ node, level = 0 }) => {
  const [expanded, setExpanded] = React.useState(false);
  const navigate = useNavigate();
  const { folderId } = useParams();

  const isSelected = String(node._id) === String(folderId);

  const toggleExpand = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <div>
      <div 
        onClick={() => navigate(`/folder/${node._id}`)}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0.5rem',
          paddingLeft: `${level * 1.5 + 0.5}rem`,
          cursor: 'pointer',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: isSelected ? 'var(--bg-hover)' : 'transparent',
          color: isSelected ? 'var(--primary)' : 'var(--text-main)',
          transition: 'background-color 0.2s',
          fontSize: '0.875rem'
        }}
        onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-dark)' }}
        onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent' }}
      >
        <div onClick={toggleExpand} style={{ marginRight: '0.5rem', display: 'flex', alignItems: 'center' }}>
          {node.children && node.children.length > 0 ? (
            expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
          ) : (
            <span style={{ width: '16px' }} />
          )}
        </div>
        <Folder size={18} style={{ marginRight: '0.75rem', color: isSelected ? 'var(--primary)' : 'var(--text-muted)' }} />
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{node.name}</span>
      </div>
      {expanded && node.children && (
        <div>
          {node.children.map(child => <TreeNode key={child._id} node={child} level={level + 1} />)}
        </div>
      )}
    </div>
  );
};

const FolderTree = () => {
  const { folderTree } = useContext(FolderContext);
  const navigate = useNavigate();
  const { folderId } = useParams();
  
  const isRootSelected = !folderId || folderId === 'null';

  return (
    <div>
      <div 
        onClick={() => navigate('/dashboard')}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0.5rem',
          cursor: 'pointer',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: isRootSelected ? 'var(--bg-hover)' : 'transparent',
          color: isRootSelected ? 'var(--primary)' : 'var(--text-main)',
          marginBottom: '0.5rem',
          fontSize: '0.875rem'
        }}
      >
        <span style={{ width: '16px', marginRight: '0.5rem' }} />
        <Folder size={18} style={{ marginRight: '0.75rem', color: isRootSelected ? 'var(--primary)' : 'var(--text-muted)' }} />
        Root
      </div>
      {folderTree.map(node => (
        <TreeNode key={node._id} node={node} />
      ))}
    </div>
  );
};

export default FolderTree;
