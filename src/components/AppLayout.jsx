// AppLayout.jsx
import React from 'react';
import Sidebar from './Sidebar'; // Assuming Sidebar.jsx is in the same directory
import { Outlet } from 'react-router-dom';

function AppLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-4">
        <Outlet /> {/* This is where the content of the current route will be rendered */}
      </div>
    </div>
  );
}

export default AppLayout;