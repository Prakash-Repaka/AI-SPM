import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, CheckCircle, Search } from 'lucide-react';

const AssetInventory = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/assets');
                if (res.data.data && res.data.data.length > 0) {
                    setAssets(res.data.data);
                } else {
                    // Fallback to local mock if DB is empty/disconnected for demo feel
                    setAssets(mockData);
                }
            } catch (err) {
                console.error("Failed to fetch assets", err);
                setAssets(mockData); // Fallback
            } finally {
                setLoading(false);
            }
        };
        fetchAssets();
    }, []);

    // Placeholder data until we attach the GET endpoint
    const mockData = [
        { id: 1, name: 'finance-llm-v1', type: 'SageMakerEndpoint', status: 'InService', risk: 'High' },
        { id: 2, name: 'internal-embedding-model', type: 'SageMakerEndpoint', status: 'InService', risk: 'Low' },
    ];

    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');

    // Filter Logic
    const filteredAssets = assets.filter(asset => {
        const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'All' || asset.type === filterType;
        return matchesSearch && matchesType;
    });

    // Export Logic
    const handleExport = () => {
        const headers = ["Asset Name", "Type", "Status", "Risk Level"];
        const csvContent = [
            headers.join(","),
            ...filteredAssets.map(asset => {
                const risk = asset.isPublic ? 'High' : 'Low';
                return `${asset.name},${asset.type},${asset.status || 'Active'},${risk}`;
            })
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "asset_inventory.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Asset Inventory</h2>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search assets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex space-x-2">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 border-none focus:ring-0 cursor-pointer"
                        >
                            <option value="All">All Types</option>
                            <option value="SageMakerEndpoint">SageMaker Endpoint</option>
                            <option value="S3Bucket">S3 Bucket</option>
                            <option value="IAMRole">IAM Role</option>
                        </select>
                        <button
                            onClick={handleExport}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                        >
                            Export CSV
                        </button>
                    </div>
                </div>

                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan="5" className="px-6 py-4 text-center">Loading assets...</td></tr>
                        ) : filteredAssets.length > 0 ? (
                            filteredAssets.map((asset) => (
                                <tr key={asset.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{asset.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{asset.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            {asset.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${(asset.isPublic || asset.risk === 'High') ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {asset.isPublic ? 'High' : 'Low'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-900 cursor-pointer">
                                        View Details
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No assets found matching your criteria.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssetInventory;
