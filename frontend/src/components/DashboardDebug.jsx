import React, { useState, useEffect } from 'react';
import { Shield, Server, AlertTriangle, Activity, Play } from 'lucide-react';
import axios from 'axios';

// Move component outside to prevent re-creation
const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">{value}</h3>
                <p className={`text-xs mt-2 ${color}`}>{subtext}</p>
            </div>
            <div className={`p-3 rounded-lg ${color.replace('text-', 'bg-').replace('600', '100')}`}>
                <Icon className={`w-6 h-6 ${color}`} />
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        assets: 0,
        risks: 0,
        coverage: 100,
        lastScan: 'Never'
    });
    // Removed complex state for now to test basic render
    const [backendStatus, setBackendStatus] = useState('Checking...');

    useEffect(() => {
        // Simple check
        setBackendStatus('Connected');
    }, []);

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold">Dashboard Debug Mode</h1>
            <p>Backend: {backendStatus}</p>

            <div className="grid grid-cols-4 gap-4 mt-8">
                <StatCard title="Test Asset" value="10" icon={Server} color="text-blue-600" subtext="test" />
            </div>
        </div>
    );
};

export default Dashboard;
