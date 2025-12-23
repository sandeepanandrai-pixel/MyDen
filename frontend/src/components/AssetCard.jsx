import React from 'react';
import { ArrowUpRight, ArrowDownRight, Star } from 'lucide-react';

const AssetCard = ({ symbol, name, price, change, changePercent, isPositive, isWatchlisted, onToggleWatchlist }) => {
    return (
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer group relative">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleWatchlist && onToggleWatchlist(symbol);
                }}
                className={`absolute top-4 right-4 p-1 rounded-full hover:bg-slate-700 transition-colors ${isWatchlisted ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`}
            >
                <Star size={18} fill={isWatchlisted ? "currentColor" : "none"} />
            </button>
            <div className="flex justify-between items-start mb-2">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white group-hover:bg-slate-600 transition-colors">
                    {symbol[0]}
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    <span>{Math.abs(changePercent)}%</span>
                </div>
            </div>

            <div>
                <h3 className="text-white font-bold text-lg">{symbol}</h3>
                <p className="text-slate-400 text-sm mb-2">{name}</p>
                <p className="text-white font-mono text-xl">${(price || 0).toLocaleString()}</p>
            </div>
        </div>
    );
};

export default AssetCard;
