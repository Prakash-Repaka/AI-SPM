import React from 'react';
import { LayoutDashboard, Database, AlertTriangle, Network, FileText, Zap, Eye, LogOut, Shield } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Mapping visual tabs to routes
    const getActive = (path) => location.pathname === path;

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { id: 'inventory', label: 'AI Inventory', icon: Database, path: '/inventory' },
        { id: 'shadow', label: 'Shadow AI', icon: Eye, path: '/shadow' },
        { id: 'graph', label: 'Graph Explorer', icon: Network, path: '/graph' },
        { id: 'risks', label: 'Risks & Findings', icon: AlertTriangle, path: '/risks' },
        { id: 'redteam', label: 'Red Team', icon: Zap, path: '/redteam' },
        { id: 'reports', label: 'Reports', icon: FileText, path: '/reports' },
    ];

    const handleLogout = () => {
        document.cookie = 'authToken=; Max-Age=0; path=/;';
        document.cookie = 'userRole=; Max-Age=0; path=/;';
        navigate('/login');
    };

    return (
        <div className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col">
            <div className="p-6 border-b border-slate-800">
                <Link to="/" className="text-xl font-bold text-white flex items-center hover:opacity-80 transition-opacity">
                    <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center mr-3">
                        <Shield size={20} className="text-white" />
                    </span>
                    AegisAI
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto py-6">
                <nav className="space-y-1 px-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = getActive(item.path);

                        return (
                            <Link
                                key={item.id}
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20'
                                    : 'hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors w-full px-4 py-3 hover:bg-slate-800 rounded-lg"
                >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
