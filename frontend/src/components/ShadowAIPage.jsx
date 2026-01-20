import React, { useState, useEffect } from 'react';
import { Eye, Shield, Globe, Server, AlertOctagon, Activity, Upload, FileText, CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import axios from 'axios';
import config from '../config';

const ShadowAIPage = () => {
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({ sanctioned: 0, unsanctioned: 0, risky: 0 });
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null); // 'success' | 'error'

    // Initial Mock Data (Fallback)
    useEffect(() => {
        const mockLogs = [
            { id: 1, source: '10.0.4.55', dest: 'api.openai.com', app: 'ChatGPT', status: 'Unsanctioned', risk: 'HIGH', bytes: '45 MB', time: '10:05 AM' },
            { id: 2, source: '10.0.4.12', dest: 'huggingface.co', app: 'HuggingFace', status: 'Unsanctioned', risk: 'MEDIUM', bytes: '120 MB', time: '10:12 AM' },
            { id: 3, source: '10.1.2.33', dest: 'bedrock.us-east-1.amazonaws.com', app: 'AWS Bedrock', status: 'Sanctioned', risk: 'LOW', bytes: '1.2 GB', time: '10:15 AM' },
        ];
        setLogs(mockLogs);
        setStats({ sanctioned: 1, unsanctioned: 2, risky: 1 });
    }, []);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('logfile', file);

        setUploading(true);
        setUploadStatus(null);

        try {
            const res = await axios.post(`${config.API_BASE_URL}/shadow-ai/upload-logs`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.status === 'success') {
                setLogs(res.data.data.findings);
                setStats(res.data.data.stats);
                setUploadStatus('success');
            }
        } catch (error) {
            console.error("Upload failed", error);
            setUploadStatus('error');
        } finally {
            setUploading(false);
        }
    };

    // Chart Data Preparation
    const riskData = [
        { name: 'High Risk', value: stats.risky, color: '#ef4444' },
        { name: 'Medium Risk', value: stats.unsanctioned - stats.risky, color: '#f97316' }, // Approximate
        { name: 'Safe', value: stats.sanctioned, color: '#22c55e' }
    ];

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold flex items-center text-slate-900">
                        <Eye className="mr-3 text-indigo-600" />
                        Shadow AI Discovery
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Upload firewall or DNS logs to detect unauthorized AI usage.
                    </p>
                </div>

                {/* File Upload Area */}
                <div className="flex items-center space-x-4">
                    <label className="cursor-pointer group relative flex items-center justify-center px-6 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-indigo-500 transition-colors bg-slate-50 hover:bg-indigo-50">
                        <input type="file" className="hidden" accept=".csv,.json,.txt" onChange={handleFileUpload} disabled={uploading} />
                        <div className="flex items-center space-x-2 text-slate-600 group-hover:text-indigo-600">
                            {uploading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-600 border-t-transparent"></div>
                            ) : (
                                <Upload size={20} />
                            )}
                            <span className="font-medium text-sm">
                                {uploading ? 'Analyzing...' : 'Upload Log File'}
                            </span>
                        </div>
                    </label>
                    {uploadStatus === 'success' && <div className="text-green-600 flex items-center text-sm font-bold"><CheckCircle size={16} className="mr-1" /> Analysis Complete</div>}
                    {uploadStatus === 'error' && <div className="text-red-500 text-sm font-bold">Analysis Failed</div>}
                </div>
            </div>

            {/* Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stats Cards */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Unsanctioned Apps</p>
                                <h3 className="text-3xl font-bold text-slate-900">{stats.unsanctioned}</h3>
                            </div>
                            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                                <AlertOctagon size={24} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Data Leak Risks</p>
                                <h3 className="text-3xl font-bold text-slate-900">{stats.risky}</h3>
                            </div>
                            <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                                <Activity size={24} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Sanctioned Traffic</p>
                                <h3 className="text-3xl font-bold text-slate-900">{stats.sanctioned}</h3>
                            </div>
                            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                                <Shield size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4">Traffic Volume by Application</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={logs.slice(0, 10)}> {/* Show top 10 for clarity */}
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="app" tick={{ fontSize: 12 }} interval={0} />
                                <YAxis />
                                <RechartsTooltip />
                                <Bar dataKey="risk" fill="#6366f1" radius={[4, 4, 0, 0]} /> {/* Mocking bar value mapping would be better */}
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                            {/* Visual placeholder if no data, logic inside chart prop usually */}
                            {logs.length === 0 && "No data to display"}
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4">Risk Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={riskData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {riskData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">Detected AI Traffic Logs</h3>
                    <span className="text-xs text-slate-500 font-mono">Total Records: {logs.length}</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                <th className="p-4 font-medium">Source IP</th>
                                <th className="p-4 font-medium">Destination</th>
                                <th className="p-4 font-medium">Application</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Risk Level</th>
                                <th className="p-4 font-medium">Data Volume</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-mono text-slate-600">{log.source}</td>
                                    <td className="p-4 text-slate-600">{log.dest}</td>
                                    <td className="p-4 font-semibold text-slate-800">{log.app}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${log.status === 'Sanctioned'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                            }`}>
                                            {log.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`font-bold ${log.risk === 'HIGH' ? 'text-red-600' :
                                            log.risk === 'MEDIUM' ? 'text-orange-600' : 'text-green-600'
                                            }`}>
                                            {log.risk}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-500">{log.bytes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ShadowAIPage;
