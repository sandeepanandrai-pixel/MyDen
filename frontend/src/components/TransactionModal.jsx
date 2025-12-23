import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../utils/api';

const TransactionModal = ({ isOpen, onClose, symbol, currentPrice, type = 'buy' }) => {
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const total = quantity * currentPrice;

    const handleTransaction = async () => {
        setLoading(true);
        try {
            await api.post('/portfolio/transaction', {
                type,
                symbol,
                quantity,
                price: currentPrice
            });
            alert('Transaction Successful!');
            onClose();
            window.location.reload(); // Simple reload to refresh data
        } catch (error) {
            alert('Transaction Failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-slate-800 w-full max-w-md p-6 rounded-2xl border border-slate-700 shadow-2xl transform transition-all">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white capitalize">{type} {symbol}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Current Price</label>
                        <div className="text-2xl font-bold text-white">${currentPrice.toLocaleString()}</div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Quantity</label>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    <div className="pt-4 border-t border-slate-700">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-slate-300">Total Estimation</span>
                            <span className="text-xl font-bold text-blue-400">${total.toLocaleString()}</span>
                        </div>

                        <button
                            onClick={handleTransaction}
                            disabled={loading}
                            className={`w-full py-3.5 rounded-lg font-bold text-white transition-all ${type === 'buy' ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20' : 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            {loading ? 'Processing...' : `Confirm ${type === 'buy' ? 'Purchase' : 'Sale'}`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionModal;
