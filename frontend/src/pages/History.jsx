import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { FileText, Loader, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const History = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await api.get('/portfolio/history');
            setTransactions(res.data);
        } catch (err) {
            console.error("Failed to fetch history", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center text-white">
                <Loader className="animate-spin mr-2" /> Loading History...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Transaction History</h1>

            {transactions.length === 0 ? (
                <div className="text-center py-20 bg-slate-800 rounded-2xl border border-slate-700">
                    <FileText size={64} className="mx-auto text-slate-600 mb-4" />
                    <h3 className="text-xl font-medium text-white">No transactions yet</h3>
                    <p className="text-slate-400 mt-2">Trades you make will appear here.</p>
                </div>
            ) : (
                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-900 text-slate-200 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Asset</th>
                                <th className="px-6 py-4">Quantity</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {transactions.map(tx => (
                                <tr key={tx._id} className="hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className={`flex items-center space-x-1 ${tx.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                                            {tx.type === 'buy' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                            <span className="uppercase font-bold">{tx.type}</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-white">{tx.symbol}</td>
                                    <td className="px-6 py-4">{tx.quantity}</td>
                                    <td className="px-6 py-4">${tx.price.toLocaleString()}</td>
                                    <td className="px-6 py-4 font-medium text-white">${tx.total.toLocaleString()}</td>
                                    <td className="px-6 py-4">{new Date(tx.date).toLocaleDateString()} {new Date(tx.date).toLocaleTimeString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default History;
