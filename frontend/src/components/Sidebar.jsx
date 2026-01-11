import React from 'react';
import { LayoutDashboard, Database, Share2, ShieldAlert, FileText } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'inventory', label: 'Asset Inventory', icon: Database },
        { id: 'graph', label: 'Security Graph', icon: Share2 },
        { id: 'risks', label: 'Findings & Risks', icon: ShieldAlert },
        { id: 'reports', label: 'Reports', icon: FileText },
    ];

    return (
        <div className="w-64 bg-slate-900 text-white h-screen flex flex-col shadow-xl">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    AegisAI-SPM
                </h1>
                <p className="text-xs text-slate-400 mt-1">AI Security Posture Manager</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-blue-600 shadow-lg shadow-blue-900/50 text-white'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center space-x-3 px-4 py-3 bg-slate-800/50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm text-slate-300">System Online</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
