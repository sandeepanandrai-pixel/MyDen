import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { PieChart, Loader } from 'lucide-react';

const Portfolio = () => {
    const [portfolio, setPortfolio] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPortfolio();
    }, []);

    const fetchPortfolio = async () => {
        try {
            const res = await api.get('/portfolio');
            setPortfolio(res.data);
        } catch (err) {
            console.error("Failed to fetch portfolio", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center text-white">
                <Loader className="animate-spin mr-2" /> Loading Portfolio...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Your Portfolio</h1>

            {portfolio.length === 0 ? (
                <div className="text-center py-20 bg-slate-800 rounded-2xl border border-slate-700">
                    <PieChart size={64} className="mx-auto text-slate-600 mb-4" />
                    <h3 className="text-xl font-medium text-white">No assets found</h3>
                    <p className="text-slate-400 mt-2">Go to the Market page to start investing.</p>
                </div>
            ) : (
                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-900 text-slate-200 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Asset</th>
                                <th className="px-6 py-4">Quantity</th>
                                <th className="px-6 py-4">Avg. Buy Price</th>
                                <th className="px-6 py-4">Total Invested</th>
                                <th className="px-6 py-4">Current Value (Est)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {portfolio.map(asset => (
                                <tr key={asset._id} className="hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-white">{asset.symbol}</td>
                                    <td className="px-6 py-4">{asset.quantity}</td>
                                    <td className="px-6 py-4">${asset.averageBuyPrice.toLocaleString()}</td>
                                    <td className="px-6 py-4">${asset.totalInvested.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-white font-medium">
                                        ${(asset.quantity * asset.averageBuyPrice).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Portfolio;
