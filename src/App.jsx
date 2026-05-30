import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { FolderProvider } from './context/FolderContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <FolderProvider>
          <Toaster position="bottom-right" toastOptions={{
            style: {
              background: '#161920',
              color: '#f0f2f5',
              border: '1px solid #2a2e3a'
            }
          }} />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/folder/:folderId" element={<Dashboard />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </FolderProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
