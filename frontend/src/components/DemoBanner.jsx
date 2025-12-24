import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useDemoMode } from '../context/DemoModeContext';

const DemoBanner = () => {
    const { isDemoMode, disableDemoMode, demoBalance } = useDemoMode();

    if (!isDemoMode) return null;

    return (
        <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border-b border-purple-600/30 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-600/20 rounded-lg">
                        <AlertTriangle className="text-purple-400" size={20} />
                    </div>
                    <div>
                        <p className="text-white font-semibold">
                            🎮 Demo Mode Active
                        </p>
                        <p className="text-purple-200 text-sm">
                            You're trading with ${demoBalance.toLocaleString()} virtual money. No real transactions.
                        </p>
                    </div>
                </div>
                <button
                    onClick={disableDemoMode}
                    className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <X size={18} />
                    <span>Exit Demo</span>
                </button>
            </div>
        </div>
    );
};

export default DemoBanner;
