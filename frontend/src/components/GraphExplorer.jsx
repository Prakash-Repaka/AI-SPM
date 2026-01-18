import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ForceGraph2D from 'react-force-graph-2d';

const GraphExplorer = () => {
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });
    const [paths, setPaths] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const gRes = await axios.get('http://localhost:3000/api/graph');
                if (gRes.data.data) setGraphData(gRes.data.data);

                const pRes = await axios.get('http://localhost:3000/api/risks/paths');
                if (pRes.data.data) setPaths(pRes.data.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="flex h-full">
            <div className="flex-1 relative bg-slate-900 overflow-hidden">
                <div className="absolute top-4 left-4 z-10 bg-slate-800 p-4 rounded-lg shadow-lg text-white">
                    <h3 className="font-bold">Security Graph</h3>
                    <p className="text-xs text-slate-400">Visualizing Asset Relationships</p>
                </div>
                <ForceGraph2D
                    graphData={graphData}
                    nodeLabel="name"
                    nodeCanvasObject={(node, ctx, globalScale) => {
                        const label = node.name || node.id;
                        const fontSize = 12 / globalScale;
                        ctx.font = `${fontSize}px Sans-Serif`;
                        const textWidth = ctx.measureText(label).width;
                        const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

                        // Node Color Logic
                        let color = '#64748b'; // Default Slate
                        if (node.type === 'SageMakerEndpoint' || node.label === 'SageMakerEndpoint') color = '#8b5cf6'; // Violet
                        else if (node.type === 'S3Bucket' || node.label === 'S3Bucket') color = '#10b981'; // Emerald
                        else if (node.type === 'IAMRole' || node.type === 'Privilege' || node.label === 'IAMRole') color = '#f43f5e'; // Rose
                        else if (node.id === 'INTERNET' || node.label === 'Network') color = '#3b82f6'; // Blue

                        // Draw Circle
                        ctx.beginPath();
                        ctx.fillStyle = color;
                        ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
                        ctx.fill();

                        // Draw Label
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = '#cbd5e1';
                        ctx.fillText(label, node.x, node.y + 8);
                    }}
                    linkDirectionalArrowLength={3.5}
                    linkDirectionalArrowRelPos={1}
                    backgroundColor="#0f172a"
                    onNodeClick={node => {
                        // Focus on node logic could go here
                        console.log('Clicked', node);
                    }}
                />
            </div>
            <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
                <h3 className="font-bold text-lg mb-4">Attack Paths</h3>
                {paths.map(path => (
                    <div key={path.id} className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-red-900 text-sm">{path.title}</h4>
                            <span className="bg-red-200 text-red-800 text-xs px-2 py-0.5 rounded font-bold">{path.severity}</span>
                        </div>
                        <div className="space-y-3 relative">
                            {/* Vertical Line */}
                            <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-red-200"></div>

                            {path.steps.map((step, idx) => (
                                <div key={step.id} className="relative flex items-center space-x-3 z-10">
                                    <div className="w-5 h-5 rounded-full bg-red-100 border-2 border-red-400 flex items-center justify-center text-[10px] font-bold text-red-800">
                                        {idx + 1}
                                    </div>
                                    <div className="text-xs">
                                        <p className="font-medium text-gray-900">{step.name}</p>
                                        <p className="text-gray-500">{step.type}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GraphExplorer;
