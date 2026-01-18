import React, { useState, useEffect } from 'react';
import { Eye, Shield, Globe, Server, AlertOctagon, Activity } from 'lucide-react';

const ShadowAIPage = () => {
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({ sanctioned: 0, unsanctioned: 0, risky: 0 });

    useEffect(() => {
        // Mock Shadow AI Discovery Data
        const mockLogs = [
            { id: 1, source: '10.0.4.55', dest: 'api.openai.com', app: 'ChatGPT', status: 'Unsanctioned', risk: 'HIGH', bytes: '45 MB', time: '10:05 AM' },
            { id: 2, source: '10.0.4.12', dest: 'huggingface.co', app: 'HuggingFace', status: 'Unsanctioned', risk: 'MEDIUM', bytes: '120 MB', time: '10:12 AM' },
            { id: 3, source: '10.1.2.33', dest: 'bedrock.us-east-1.amazonaws.com', app: 'AWS Bedrock', status: 'Sanctioned', risk: 'LOW', bytes: '1.2 GB', time: '10:15 AM' },
            { id: 4, source: '10.0.4.89', dest: 'bard.google.com', app: 'Gemini', status: 'Unsanctioned', risk: 'HIGH', bytes: '15 MB', time: '10:18 AM' },
            { id: 5, source: '10.1.2.34', dest: 'sagemaker.us-east-1.amazonaws.com', app: 'SageMaker', status: 'Sanctioned', risk: 'LOW', bytes: '4.5 GB', time: '10:22 AM' },
            { id: 6, source: '10.0.5.21', dest: 'anthropic.com', app: 'Claude', status: 'Unsanctioned', risk: 'MEDIUM', bytes: '32 MB', time: '10:45 AM' },
        ];
        setLogs(mockLogs);
        setStats({ sanctioned: 2, unsanctioned: 4, risky: 2 });
    }, []);

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center text-slate-900">
                <Eye className="mr-3 text-indigo-600" />
                Shadow AI Discovery
            </h2>
            <p className="text-slate-500 mb-8">
                Detecting unauthorized AI usage across the corporate network by analyzing DNS and Firewall logs.
            </p>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                            <h3 className="text-3xl font-bold text-slate-900">5.7 GB</h3>
                        </div>
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                            <Shield size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Network Graph Visual (Mock) */}
            <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg mb-8">
                <h3 className="font-bold flex items-center mb-4 text-indigo-400">
                    <Globe className="mr-2" /> Live Network Activity
                </h3>
                <div className="h-40 flex items-center justify-around relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                    <div className="z-10 flex flex-col items-center">
                        <Server size={32} className="text-slate-400 mb-2" />
                        <span className="text-xs text-slate-400">Corp Network</span>
                    </div>

                    {/* Animated Traffic Particles */}
                    <div className="flex-1 h-0.5 bg-slate-700 mx-4 relative">
                        <div className="absolute top-1/2 left-0 w-2 h-2 bg-red-500 rounded-full animate-[ping_1.5s_linear_infinite] translate-y-[-50%]"></div>
                        <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-green-500 rounded-full animate-[ping_2s_linear_infinite] translate-y-[-50%]"></div>
                        <div className="absolute top-1/2 left-2/3 w-2 h-2 bg-orange-500 rounded-full animate-[ping_1.8s_linear_infinite] translate-y-[-50%]"></div>
                    </div>

                    <div className="z-10 flex flex-col items-center">
                        <Globe size={32} className="text-blue-400 mb-2" />
                        <span className="text-xs text-slate-400">Public Internet</span>
                    </div>
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-slate-800">Detected AI Traffic Logs</h3>
                </div>
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
    );
};

export default ShadowAIPage;
