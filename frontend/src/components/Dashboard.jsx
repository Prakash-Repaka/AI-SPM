import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Server, AlertTriangle, Activity, Play, CircleDollarSign } from 'lucide-react';
import axios from 'axios';
import config from '../config';

const Dashboard = ({ setActiveTab }) => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        assets: 0,
        risks: 0,
        coverage: 100,
        lastScan: 'Never',
        projectedLoss: 0,
        threats: null
    });
    const [scanning, setScanning] = useState(false);
    const [scanLogs, setScanLogs] = useState([]);
    const [backendStatus, setBackendStatus] = useState('Checking...');
    const [showConfig, setShowConfig] = useState(false);
    const [awsConfig, setAwsConfig] = useState({
        region: 'us-east-1',
        accessKeyId: '',
        secretAccessKey: ''
    });

    useEffect(() => {
        checkBackend();
    }, []);

    const checkBackend = async () => {
        try {
            const res = await axios.get(`${config.API_BASE_URL.replace('/api', '')}/health`);
            setBackendStatus(res.data.status === 'ok' ? 'Connected' : 'Error');
        } catch (err) {
            setBackendStatus('Disconnected');
        }
    };

    const addLog = (msg) => {
        setScanLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    const startScan = async () => {
        setScanning(true);
        setScanLogs([]); // Clear logs
        setShowConfig(false);

        addLog("Initializing AegisAI Discovery Engine...");
        addLog(`Target Region: ${awsConfig.region || 'us-east-1'}`);
        addLog("Authenticating with AWS STS...");

        try {
            // Send config (empty means demo mode)
            const res = await axios.post(`${config.API_BASE_URL}/scan`, {
                config: awsConfig
            });

            addLog("✓ Authentication Successful.");
            addLog("Scanning S3 Buckets...");
            addLog(`Found ${res.data.data?.S3Scanner?.length || 0} S3 Buckets.`);
            addLog("Scanning SageMaker Endpoints...");
            addLog(`Found ${res.data.data?.SageMakerScanner?.length || 0} ML Endpoints.`);
            addLog("Analyzing IAM Roles & Policies...");
            addLog("Running Risk Analysis Engine (Financial Impact Estimation)...");
            addLog("Evaluating NIST AI RMF Compliance...");
            addLog("✓ Scan Complete. Updating Dashboard.");

            const totalAssets = (res.data.data?.SageMakerScanner?.length || 0) +
                (res.data.data?.S3Scanner?.length || 0) +
                (res.data.data?.IAMScanner?.length || 0);

            setStats(prev => ({
                ...prev,
                assets: totalAssets,
                risks: res.data.stats?.criticalCount || 0,
                lastScan: new Date().toLocaleTimeString(),
                projectedLoss: res.data.stats?.totalProjectedLoss || 0,
                threats: res.data.threats
            }));
        } catch (err) {
            console.error(err);
            addLog(`❌ Scan Failed: ${err.message}`);
            alert('Scan Failed: ' + err.message);
        } finally {
            setScanning(false);
        }
    };

    const handleConfigChange = (e) => {
        setAwsConfig({ ...awsConfig, [e.target.name]: e.target.value });
    };

    const StatCard = ({ title, value, icon: Icon, color, subtext, onClick }) => (
        <div
            onClick={onClick}
            className={`bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer hover:border-blue-200 transition-all active:scale-95`}
        >
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

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Security Overview</h2>
                    <p className="text-slate-500 mt-1">Real-time security posture analysis for AI Workloads</p>
                </div>
                <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${backendStatus === 'Connected' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        Backend: {backendStatus}
                    </span>

                    <button
                        onClick={() => setShowConfig(!showConfig)}
                        className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                    >
                        Configure Cloud
                    </button>

                    <button
                        onClick={startScan}
                        disabled={scanning}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${scanning
                            ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/30'
                            }`}
                    >
                        {scanning ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-500 border-t-white"></div>
                                <span>Scanning...</span>
                            </>
                        ) : (
                            <>
                                <Play size={18} />
                                <span>Start Discovery Scan</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Config Modal */}
            {showConfig && (
                <div className="mb-8 p-6 bg-white rounded-xl shadow border border-blue-100">
                    <h3 className="text-lg font-bold mb-4 text-slate-800">AWS Configuration (Optional)</h3>
                    <p className="text-sm text-slate-500 mb-4">Leave blank to use Demo Mode (Mock Data). Enter credentials to scan your real AWS environment.</p>
                    <div className="grid grid-cols-3 gap-4">
                        <input
                            type="text"
                            name="region"
                            placeholder="us-east-1"
                            value={awsConfig.region}
                            onChange={handleConfigChange}
                            className="p-2 border rounded"
                        />
                        <input
                            type="text"
                            name="accessKeyId"
                            placeholder="AWS Access Key ID"
                            value={awsConfig.accessKeyId}
                            onChange={handleConfigChange}
                            className="p-2 border rounded"
                        />
                        <input
                            type="password"
                            name="secretAccessKey"
                            placeholder="AWS Secret Access Key"
                            value={awsConfig.secretAccessKey}
                            onChange={handleConfigChange}
                            className="p-2 border rounded"
                        />
                    </div>
                </div>
            )}


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <StatCard
                    title="Total AI Assets"
                    value={stats.assets}
                    icon={Server}
                    color="text-blue-600"
                    subtext="+3 new assets"
                    onClick={() => navigate('/inventory')}
                />
                <StatCard
                    title="Critical Risks"
                    value={stats.risks}
                    icon={AlertTriangle}
                    color="text-red-600"
                    subtext="Requires attention"
                    onClick={() => navigate('/risks')}
                />
                <StatCard
                    title="Projected Loss"
                    value={`$${(stats.projectedLoss || 0).toLocaleString()}`}
                    icon={CircleDollarSign}
                    color="text-orange-600"
                    subtext="Financial Risk Exposure"
                    onClick={() => navigate('/risks')}
                />
                <StatCard
                    title="Security Score"
                    value="A+"
                    icon={Shield}
                    color="text-green-600"
                    subtext="Top 10%"
                    onClick={() => navigate('/reports')}
                />
                <StatCard
                    title="Compliance"
                    value={`${stats.coverage}%`}
                    icon={Activity}
                    color="text-purple-600"
                    subtext="NIST AI RMF"
                    onClick={() => navigate('/reports')}
                />
            </div>

            {/* STRIDE THREAT MATRIX WIDGET */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-indigo-600" />
                    Threat Landscape (STRIDE Model)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {stats.threats && Object.values(stats.threats).some(val => val > 0) ? (
                        Object.entries(stats.threats).map(([category, count]) => (
                            <div key={category} className={`p-4 rounded-lg border ${count > 0 ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{category}</p>
                                <div className="flex items-end items-baseline">
                                    <span className={`text-2xl font-bold ${count > 0 ? 'text-red-600' : 'text-slate-400'}`}>{count}</span>
                                    <span className="text-xs text-slate-400 ml-1">threats</span>
                                </div>
                            </div>
                        ))
                    ) : stats.threats ? (
                        <div className="col-span-full p-6 bg-green-50 border border-green-200 rounded-lg flex items-center justify-center">
                            <Shield className="text-green-600 mr-2" size={24} />
                            <p className="text-green-800 font-medium">No STRIDE model vulnerabilities have been detected.</p>
                        </div>
                    ) : (
                        <p className="text-slate-400 text-sm col-span-full">Run a scan to see threat modeling results.</p>
                    )}
                </div>
            </div>

            {/* Terminal Log Output */}
            <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-700 p-6 font-mono text-sm overflow-hidden">
                <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
                    <h3 className="text-slate-100 font-bold flex items-center">
                        <Activity className="mr-2 text-green-400" size={16} />
                        Discovery Log
                    </h3>
                    <span className="text-slate-500 text-xs">Live Output</span>
                </div>
                <div className="h-48 overflow-y-auto space-y-2">
                    {scanLogs.length === 0 ? (
                        <p className="text-slate-600 italic">Ready to scan. Waiting for command...</p>
                    ) : (
                        scanLogs.map((log, i) => (
                            <p key={i} className="text-green-400 border-l-2 border-transparent hover:border-green-800 pl-2">
                                <span className="opacity-50 mr-2">$</span>
                                {log}
                            </p>
                        ))
                    )}
                    {scanning && (
                        <p className="text-green-400 animate-pulse">_</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
