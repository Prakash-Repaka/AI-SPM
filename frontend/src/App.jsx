import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import AssetInventory from './components/AssetInventory';
import FindingsPage from './components/FindingsPage';
import GraphExplorer from './components/GraphExplorer';
import ReportsPage from './components/ReportsPage';
import RedTeamPage from './components/RedTeamPage';
import ShadowAIPage from './components/ShadowAIPage';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import AdminDashboard from './components/AdminDashboard';

// Layout for the main app (Sidebar + Content)
const MainLayout = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Guard: Check if user is logged in (simple cookie check for demo)
  const ProtectedRoute = ({ children }) => {
    const isAuthenticated = document.cookie.includes('authToken');
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Admin Route */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <MainLayout activeTab="dashboard" setActiveTab={setActiveTab}>
              <Dashboard setActiveTab={setActiveTab} />
            </MainLayout>
          </ProtectedRoute>
        } />

        {/* Since Sidebar uses local state mapping, we map the routes to the Sidebar layout manually or refactor Sidebar to use Links. 
                For this quick integration, let's keep the Sidebar 'tab' logic but wrap it. 
            */}
        <Route path="/inventory" element={<ProtectedRoute><MainLayout activeTab="inventory" setActiveTab={setActiveTab}><AssetInventory /></MainLayout></ProtectedRoute>} />
        <Route path="/risks" element={<ProtectedRoute><MainLayout activeTab="risks" setActiveTab={setActiveTab}><FindingsPage /></MainLayout></ProtectedRoute>} />
        <Route path="/graph" element={<ProtectedRoute><MainLayout activeTab="graph" setActiveTab={setActiveTab}><GraphExplorer /></MainLayout></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><MainLayout activeTab="reports" setActiveTab={setActiveTab}><ReportsPage /></MainLayout></ProtectedRoute>} />
        <Route path="/redteam" element={<ProtectedRoute><MainLayout activeTab="redteam" setActiveTab={setActiveTab}><RedTeamPage /></MainLayout></ProtectedRoute>} />
        <Route path="/shadow" element={<ProtectedRoute><MainLayout activeTab="shadow" setActiveTab={setActiveTab}><ShadowAIPage /></MainLayout></ProtectedRoute>} />

      </Routes>
    </Router>
  );
}

export default App;
