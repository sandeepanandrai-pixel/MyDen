import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { FileText, ArrowUpRight, ArrowDownLeft, Download, Filter } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingStates';

const History = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, buy, sell

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

    const handleExport = () => {
        // CSV export functionality
        const csv = ['Type,Asset,Quantity,Price,Total,Date'];
        transactions.forEach(tx => {
            csv.push(`${tx.type},${tx.symbol},${tx.quantity},${tx.price},${tx.total},${new Date(tx.date).toLocaleString()}`);
        });

        const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transaction-history-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const filteredTransactions = transactions.filter(tx =>
        filter === 'all' || tx.type === filter
    );

    const totalBuys = transactions.filter(tx => tx.type === 'buy').reduce((sum, tx) => sum + tx.total, 0);
    const totalSells = transactions.filter(tx => tx.type === 'sell').reduce((sum, tx) => sum + tx.total, 0);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#10162f] to-[#0a0e27] p-6 flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p className="text-slate-400 mt-4">Loading transaction history...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#10162f] to-[#0a0e27] p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between animate-fade-in">
                    <div>
                        <h1 className="text-hero gradient-text mb-2">Transaction History</h1>
                        <p className="text-slate-400">Complete record of your trades</p>
                    </div>
                    {transactions.length > 0 && (
                        <button
                            onClick={handleExport}
                            className="flex items-center space-x-2 btn-premium"
                        >
                            <Download size={18} />
                            <span>Export CSV</span>
                        </button>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-in-right">
                    <div className="premium-card">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-blue-500/20 rounded-xl">
                                <FileText className="text-blue-400" size={24} />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Total Transactions</p>
                                <p className="text-2xl font-bold text-white">{transactions.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="premium-card">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-green-500/20 rounded-xl">
                                <ArrowDownLeft className="text-green-400" size={24} />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Total Bought</p>
                                <p className="text-2xl font-bold text-green-400">${totalBuys.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="premium-card">
                        <div className="flex items-center space-x-3">
                            <div className="p-3 bg-red-500/20 rounded-xl">
                                <ArrowUpRight className="text-red-400" size={24} />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Total Sold</p>
                                <p className="text-2xl font-bold text-red-400">${totalSells.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter */}
                {transactions.length > 0 && (
                    <div className="premium-card flex items-center space-x-4 animate-fade-in">
                        <Filter className="text-slate-400" size={20} />
                        <div className="flex space-x-2">
                            {['all', 'buy', 'sell'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${filter === f
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                            : 'bg-slate-800 text-slate-400 hover:text-white'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Transactions List */}
                {transactions.length === 0 ? (
                    <div className="premium-card text-center py-20 animate-scale-in">
                        <FileText size={64} className="mx-auto text-slate-600 mb-4" />
                        <h3 className="text-2xl font-bold gradient-text mb-2">No transactions yet</h3>
                        <p className="text-slate-400 mb-6">Your trades will appear here</p>
                        <a
                            href="/market"
                            className="inline-block btn-premium"
                        >
                            Start Trading
                        </a>
                    </div>
                ) : (
                    <div className="premium-card animate-fade-in-up">
                        <div className="space-y-3">
                            {filteredTransactions.map((tx, index) => (
                                <div
                                    key={tx._id}
                                    className="glass rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className={`p-3 rounded-xl ${tx.type === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                                                {tx.type === 'buy' ? (
                                                    <ArrowDownLeft className="text-green-400" size={20} />
                                                ) : (
                                                    <ArrowUpRight className="text-red-400" size={20} />
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-3 mb-1">
                                                    <h4 className="text-white font-bold text-lg">{tx.symbol}</h4>
                                                    <span className={`uppercase text-xs font-bold px-2 py-1 rounded ${tx.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                                        }`}>
                                                        {tx.type}
                                                    </span>
                                                </div>
                                                <p className="text-slate-400 text-sm">
                                                    {tx.quantity} units @ ${tx.price.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-white">${tx.total.toLocaleString()}</p>
                                            <p className="text-slate-400 text-sm">
                                                {new Date(tx.date).toLocaleDateString()} {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredTransactions.length === 0 && (
                            <div className="text-center py-12">
                                <Filter size={48} className="mx-auto text-slate-600 mb-3" />
                                <p className="text-slate-400">No {filter} transactions found</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
