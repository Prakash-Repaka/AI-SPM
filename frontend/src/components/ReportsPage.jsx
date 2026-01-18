import React, { useState } from 'react';
import axios from 'axios';
import { FileText, Download } from 'lucide-react';

const ReportsPage = () => {
    const [generating, setGenerating] = useState(false);
    const [lastReport, setLastReport] = useState(null);

    const generateReport = async () => {
        setGenerating(true);
        try {
            const res = await axios.get('http://localhost:3000/api/reports');
            setLastReport(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setGenerating(false);
        }
    };

    const handleDownloadPDF = async () => {
        if (!lastReport) return;
        try {
            // Request PDF type
            const res = await axios.get('http://localhost:3000/api/reports?type=pdf');
            if (res.data.status === 'success' && res.data.data.type === 'application/pdf') {
                // Decode base64 string
                const byteCharacters = atob(res.data.data.content);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'application/pdf' });

                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = res.data.data.filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        } catch (err) {
            console.error("PDF Download failed", err);
            alert("Failed to download PDF: " + err.message);
        }
    };

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
                <FileText className="mr-3 text-blue-600" />
                Reports & Compliance
            </h2>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <p className="text-gray-600 mb-6">Generate detailed security status reports.</p>

                <button
                    onClick={generateReport}
                    disabled={generating}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                >
                    <Download className="mr-2" size={20} />
                    {generating ? 'Generating...' : 'Generate New Report'}
                </button>

                {lastReport && (
                    <div className="mt-8 p-6 bg-gray-50 rounded border border-gray-200">
                        <h3 className="font-bold text-lg mb-4">Report Summary ({new Date(lastReport.generatedAt).toLocaleString()})</h3>
                        <div className="grid grid-cols-3 gap-6 mb-8">
                            <div className="bg-white p-4 rounded shadow-sm">
                                <span className="block text-gray-500 text-sm">Total Assets</span>
                                <span className="block text-2xl font-bold">{lastReport.summary.totalAssets}</span>
                            </div>
                            <div className="bg-white p-4 rounded shadow-sm">
                                <span className="block text-gray-500 text-sm">Total Risks</span>
                                <span className="block text-2xl font-bold text-red-600">{lastReport.summary.totalRisks}</span>
                            </div>
                            <div className="bg-white p-4 rounded shadow-sm">
                                <span className="block text-gray-500 text-sm">NIST AI RMF Compliance</span>
                                <span className={`block text-2xl font-bold ${lastReport.compliance?.score < 50 ? 'text-red-500' : 'text-green-500'}`}>
                                    {lastReport.compliance?.score || 0}%
                                </span>
                            </div>
                        </div>

                        {/* Compliance Table */}
                        {lastReport.compliance && (
                            <div className="mb-8">
                                <h3 className="font-bold text-md mb-2 text-slate-700">NIST AI RMF Controls Status</h3>
                                <div className="bg-white rounded border border-gray-200 overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                                            <tr>
                                                <th className="p-3">Control ID</th>
                                                <th className="p-3">Description</th>
                                                <th className="p-3">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {lastReport.compliance.controls.map(control => (
                                                <tr key={control.id} className="border-b border-gray-100 last:border-0 hover:bg-slate-50">
                                                    <td className="p-3 font-medium text-slate-900">{control.id}</td>
                                                    <td className="p-3 text-slate-600">{control.description}</td>
                                                    <td className="p-3">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${control.status === 'PASS'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                            }`}>
                                                            {control.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        <div className="text-right">
                            <button
                                onClick={handleDownloadPDF}
                                className="flex items-center text-blue-600 text-sm font-bold hover:text-blue-800 transition-colors"
                            >
                                <Download className="mr-2" size={16} />
                                Download Official PDF Report
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportsPage;
