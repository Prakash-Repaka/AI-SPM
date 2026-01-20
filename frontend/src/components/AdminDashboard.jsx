import React, { useEffect, useState } from 'react';
import { Shield, Users, FileText, Search, LogOut, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch users from backend (Protected Route)
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/auth/users');
            const data = await response.json();
            if (data.status === 'success') {
                setUsers(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        document.cookie = 'authToken=; Max-Age=0; path=/;';
        document.cookie = 'userRole=; Max-Age=0; path=/;';
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans">
            {/* Admin Header */}
            <header className="bg-slate-800 border-b border-slate-700 px-8 py-4 flex justify-between items-center shadow-lg">
                <div className="flex items-center">
                    <Shield className="text-red-500 mr-3" size={28} />
                    <h1 className="text-xl font-bold">Admin Command Center</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-slate-400 text-sm">Administrator</span>
                    <button
                        onClick={handleLogout}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-300 hover:text-white"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <main className="p-8 max-w-7xl mx-auto">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-slate-400 font-medium">Total Users</h3>
                            <Users className="text-indigo-400" />
                        </div>
                        <p className="text-4xl font-bold">{users.length}</p>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-slate-400 font-medium">Active Logs</h3>
                            <FileText className="text-green-400" />
                        </div>
                        <p className="text-4xl font-bold">1,284</p>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-slate-400 font-medium">Security Incidents</h3>
                            <Shield className="text-red-400" />
                        </div>
                        <p className="text-4xl font-bold">12</p>
                    </div>
                </div>

                {/* User Database Table */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
                        <h2 className="text-xl font-bold flex items-center">
                            <Users className="mr-2 text-indigo-400" />
                            User Database & Credentials
                        </h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="p-4">User ID</th>
                                    <th className="p-4">Username</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Role</th>
                                    <th className="p-4">Password Hash (SHA-256)</th>
                                    <th className="p-4">Last Login</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700 text-sm">
                                {loading ? (
                                    <tr><td colSpan="7" className="p-8 text-center text-slate-500">Loading user database...</td></tr>
                                ) : users.map((user, i) => (
                                    <tr key={i} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="p-4 font-mono text-slate-500 text-xs">#{user.id.substring(0, 8)}</td>
                                        <td className="p-4 font-bold text-white flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3 text-indigo-400 font-bold">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            {user.username}
                                        </td>
                                        <td className="p-4 text-slate-300">{user.email}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4 font-mono text-xs text-slate-500 truncate max-w-[150px]" title={user.password}>
                                            {user.password}
                                        </td>
                                        <td className="p-4 text-slate-400">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <span className="flex items-center text-green-400 text-xs font-bold">
                                                <Check size={14} className="mr-1" /> Active
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
