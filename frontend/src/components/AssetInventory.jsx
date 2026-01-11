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
                            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="space-x-2">
                        <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">Filter</button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Export</button>
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
                        ) : assets.map((asset) => (
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
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssetInventory;
