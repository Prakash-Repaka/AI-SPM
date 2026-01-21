import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, CheckCircle, Terminal, X, Copy } from 'lucide-react';
import config from '../config';

const FindingsPage = () => {
    const [findings, setFindings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRemediation, setSelectedRemediation] = useState(null);

    const fetchFindings = async () => {
        try {
            const res = await axios.post(`${config.API_BASE_URL}/scan`);
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
            // Updated Endpoint for V2 Remediation Engine
            const res = await axios.post(`${config.API_BASE_URL}/remediate`, { finding });

            if (res.data.data && res.data.data.available) {
                setSelectedRemediation(res.data.data); // Save full object (title, risk, actions[])
            } else {
                alert("No automated fix available for this finding yet.");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to generate fix: " + err.message);
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
                <h2 className="text-2xl font-bold flex items-center text-slate-900">
                    <AlertTriangle className="mr-3 text-red-600" />
                    Security Findings
                </h2>
                <button
                    onClick={fetchFindings}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium shadow-sm"
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
                    <div className="p-6 bg-green-50 border border-green-200 rounded-lg flex items-center shadow-sm">
                        <CheckCircle className="text-green-600 mr-3" size={24} />
                        <div>
                            <p className="text-green-800 font-bold">Secure Status</p>
                            <p className="text-green-700 text-sm">No critical security issues found. Great job!</p>
                        </div>
                    </div>
                )}

                {findings.map((finding) => (
                    <div key={finding.id} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <span className={`px-2 py-1 text-xs font-bold rounded border ${getSeverityColor(finding.severity)}`}>
                                        {finding.severity}
                                    </span>
                                    <h3 className="font-bold text-lg text-slate-800">{finding.description}</h3>
                                </div>
                                <p className="text-sm text-slate-500 mb-2">
                                    Asset: <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700 border border-slate-200">{String(finding.assetId || 'Unknown')}</span>
                                </p>
                                <p className="text-sm text-slate-600">{String(finding.remediation || '')}</p>
                            </div>
                            <div className="ml-6 flex flex-col items-end">
                                <div className="text-right mb-3">
                                    <span className="block text-xs text-slate-400 uppercase tracking-wide font-semibold">Projected Loss</span>
                                    <span className="block text-xl font-bold text-slate-700">${(finding.projectedLoss || 0).toLocaleString()}</span>
                                </div>
                                <div className="text-center mb-3">
                                    <span className="block text-2xl font-bold text-slate-800">{finding.score}</span>
                                    <span className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Risk Score</span>
                                </div>

                                <button
                                    onClick={() => handleFix(finding)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
                                >
                                    <Terminal size={16} />
                                    <span>Fix with AI</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Remediation Modal (V2.0 Upgrade) */}
            {selectedRemediation && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="p-5 bg-slate-900 text-white flex justify-between items-center border-b border-slate-700">
                            <div>
                                <h3 className="font-bold text-lg flex items-center text-blue-400">
                                    <Terminal className="mr-2" size={20} />
                                    Automated Remediation
                                </h3>
                                <p className="text-slate-400 text-xs mt-1">{selectedRemediation.title}</p>
                            </div>
                            <button onClick={() => setSelectedRemediation(null)} className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Actions Content */}
                        <div className="p-6 bg-slate-900 overflow-y-auto flex-1">
                            <div className="mb-6">
                                <h4 className="text-slate-300 text-sm font-semibold mb-2">Security Risk</h4>
                                <div className="p-3 bg-red-900/20 border border-red-800/50 rounded text-red-200 text-sm">
                                    {selectedRemediation.risk}
                                </div>
                            </div>

                            <div className="space-y-6">
                                {selectedRemediation.actions && selectedRemediation.actions.map((action, idx) => (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <span className="text-green-400 text-xs font-mono font-bold uppercase tracking-wider flex items-center">
                                                {action.language === 'python' ? <Terminal size={14} className="mr-1" /> :
                                                    action.language === 'hcl' ? <Server size={14} className="mr-1" /> :
                                                        <Terminal size={14} className="mr-1" />}
                                                {action.label}
                                            </span>
                                            <button
                                                onClick={() => navigator.clipboard.writeText(action.code)}
                                                className="text-xs text-slate-400 hover:text-white flex items-center transition-colors"
                                            >
                                                <Copy size={14} className="mr-1.5" /> Copy Code
                                            </button>
                                        </div>
                                        <div className="relative group">
                                            <pre className="bg-black/50 text-slate-300 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-slate-700 whitespace-pre-wrap">
                                                {action.code}
                                            </pre>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg flex items-start">
                                <AlertTriangle className="text-blue-400 shrink-0 mt-0.5 mr-3" size={16} />
                                <p className="text-blue-200 text-xs leading-relaxed">
                                    <strong>AI Safety Protocol:</strong> This remediation script adheres to CIS Benchmarks for AI Security.
                                    However, automated enforcement is disabled in this demo environment.
                                    Please verify in a staging environment before running in production.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FindingsPage;
