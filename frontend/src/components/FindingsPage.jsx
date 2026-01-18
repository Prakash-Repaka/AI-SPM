import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, CheckCircle, Terminal, X, Copy } from 'lucide-react';
const FindingsPage = () => {
    const [findings, setFindings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRemediation, setSelectedRemediation] = useState(null);

    const fetchFindings = async () => {
        try {
            const res = await axios.post('http://localhost:3000/api/scan');
            if (res.data.data && res.data.data.findings) {
                setFindings(res.data.data.findings);
            }
        } catch (err) {
            console.error("Error fetching findings:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // In a real app we'd fetch findings from a dedicated endpoint
        // For now, we trigger a scan to get the fresh analysis
        fetchFindings();
    }, []);

    const handleFix = async (finding) => {
        try {
            const res = await axios.post('http://localhost:3000/api/remediation', { finding });
            setSelectedRemediation({
                title: `Fix for ${finding.ruleId}`,
                script: res.data.data.script
            });
        } catch (err) {
            alert("Failed to generate fix");
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
            case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center">
                    <AlertTriangle className="mr-3 text-red-600" />
                    Security Findings
                </h2>
                <button
                    onClick={fetchFindings}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    {loading ? 'Scanning...' : 'Refresh Findings'}
                </button>
            </div>

            {/* Findings List */}
            <div className="space-y-4">
                {loading && (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-500">Analyzing security posture...</p>
                    </div>
                )}

                {findings.length === 0 && !loading && (
                    <div className="p-6 bg-green-50 border border-green-200 rounded-lg flex items-center">
                        <CheckCircle className="text-green-600 mr-3" />
                        <p className="text-green-800 font-medium">No security issues found. Great job!</p>
                    </div>
                )}

                {findings.map((finding) => (
                    <div key={finding.id} className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <span className={`px-2 py-1 text-xs font-bold rounded border ${getSeverityColor(finding.severity)}`}>
                                        {finding.severity}
                                    </span>
                                    <h3 className="font-bold text-lg text-slate-800">{finding.description}</h3>
                                </div>
                                <p className="text-sm text-slate-500 mb-2">Asset: <span className="font-mono bg-slate-100 px-1 rounded">{String(finding.assetId || 'Unknown')}</span></p>
                                <p className="text-sm text-slate-600">{String(finding.remediation || '')}</p>
                            </div>
                            <div className="ml-4">
                                <span className="block text-2xl font-bold text-red-600 text-center">{finding.score}</span>
                                <span className="text-xs text-secondary-500">Risk Score</span>

                                <button
                                    onClick={() => handleFix(finding)}
                                    className="mt-3 flex items-center space-x-1 px-3 py-1.5 bg-slate-900 text-white text-xs rounded hover:bg-slate-700 transition"
                                >
                                    <Terminal size={14} />
                                    <span>Fix with AI</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Remediation Modal */}
            {selectedRemediation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden">
                        <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                            <h3 className="font-bold flex items-center">
                                <Terminal className="mr-2" size={18} />
                                {selectedRemediation.title}
                            </h3>
                            <button onClick={() => setSelectedRemediation(null)} className="text-slate-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 bg-slate-900">
                            <div className="relative">
                                <pre className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-slate-700">
                                    {selectedRemediation.script}
                                </pre>
                                <button
                                    className="absolute top-2 right-2 text-slate-500 hover:text-white"
                                    onClick={() => navigator.clipboard.writeText(selectedRemediation.script)}
                                >
                                    <Copy size={16} />
                                </button>
                            </div>
                            <p className="text-slate-400 text-xs mt-4">
                                ⚠️ This script is AI-generated. Review carefully before executing in production.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FindingsPage;
