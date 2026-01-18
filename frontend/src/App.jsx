import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import AssetInventory from './components/AssetInventory';
import FindingsPage from './components/FindingsPage';
import GraphExplorer from './components/GraphExplorer';
import ReportsPage from './components/ReportsPage';
import RedTeamPage from './components/RedTeamPage';
import ShadowAIPage from './components/ShadowAIPage';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 overflow-auto">
        {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
        {activeTab === 'inventory' && <AssetInventory />}
        {activeTab === 'risks' && <FindingsPage />}
        {activeTab === 'graph' && <GraphExplorer />}
        {activeTab === 'reports' && <ReportsPage />}
        {activeTab === 'redteam' && <RedTeamPage />}
        {activeTab === 'shadow' && <ShadowAIPage />}
      </div>
    </div>
  );
}

export default App;
