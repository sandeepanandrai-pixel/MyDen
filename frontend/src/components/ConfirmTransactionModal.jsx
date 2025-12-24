import React from 'react';
import { X, AlertTriangle, CheckCircle } from 'lucide-react';

const ConfirmTransactionModal = ({ isOpen, onClose, onConfirm, transaction }) => {
    if (!isOpen) return null;

    const { type, symbol, quantity, price } = transaction;
    const total = quantity * price;
    const isBuy = type === 'buy';

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full border border-slate-700 animate-fade-in">
                {/* Header */}
                <div className={`p-6 border-b border-slate-700 ${isBuy ? 'bg-green-900/20' : 'bg-red-900/20'}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${isBuy ? 'bg-green-600' : 'bg-red-600'}`}>
                                <AlertTriangle size={24} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Confirm {isBuy ? 'Purchase' : 'Sale'}</h3>
                                <p className="text-sm text-slate-400">Review transaction details</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Transaction Details */}
                <div className="p-6 space-y-4">
                    <div className="bg-slate-900 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400">Asset</span>
                            <span className="text-white font-semibold text-lg">{symbol}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400">Quantity</span>
                            <span className="text-white font-semibold">{quantity}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400">Price per unit</span>
                            <span className="text-white font-semibold">${price.toLocaleString()}</span>
                        </div>
                        <div className="border-t border-slate-700 pt-3 mt-3">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-300 font-medium">Total Amount</span>
                                <span className={`font-bold text-xl ${isBuy ? 'text-green-400' : 'text-red-400'}`}>
                                    ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Warning Messages */}
                    {total > 1000 && (
                        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3 flex items-start space-x-2">
                            <AlertTriangle size={20} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                            <div className="text-sm">
                                <p className="text-yellow-200 font-medium">Large Transaction</p>
                                <p className="text-yellow-300/80">This transaction exceeds $1,000. Please verify the details carefully.</p>
                            </div>
                        </div>
                    )}

                    <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-3 flex items-start space-x-2">
                        <CheckCircle size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-200">
                            {isBuy
                                ? 'This will deduct funds from your account balance.'
                                : 'This will add funds to your account balance.'}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-slate-700 flex space-x-3">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg ${isBuy
                                ? 'bg-green-600 hover:bg-green-700 shadow-green-600/20'
                                : 'bg-red-600 hover:bg-red-700 shadow-red-600/20'
                            } text-white`}
                    >
                        Confirm {isBuy ? 'Purchase' : 'Sale'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmTransactionModal;
