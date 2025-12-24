import React from 'react';

// Skeleton for asset cards
export const AssetCardSkeleton = () => (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 animate-pulse">
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-700 rounded-full"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-slate-700 rounded w-16"></div>
                    <div className="h-3 bg-slate-700 rounded w-12"></div>
                </div>
            </div>
            <div className="h-4 w-4 bg-slate-700 rounded"></div>
        </div>
        <div className="space-y-2">
            <div className="h-6 bg-slate-700 rounded w-24"></div>
            <div className="h-4 bg-slate-700 rounded w-20"></div>
        </div>
    </div>
);

// Skeleton for dashboard stats
export const StatCardSkeleton = () => (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 animate-pulse">
        <div className="h-4 bg-slate-700 rounded w-32 mb-3"></div>
        <div className="h-8 bg-slate-700 rounded w-40 mb-4"></div>
        <div className="flex items-center space-x-2">
            <div className="h-6 bg-slate-700 rounded w-16"></div>
            <div className="h-4 bg-slate-700 rounded w-24"></div>
        </div>
    </div>
);

// Skeleton for portfolio holdings
export const PortfolioItemSkeleton = () => (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 animate-pulse">
        <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-slate-700 rounded-full"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-slate-700 rounded w-20"></div>
                    <div className="h-3 bg-slate-700 rounded w-24"></div>
                </div>
            </div>
            <div className="space-y-2 text-right">
                <div className="h-5 bg-slate-700 rounded w-24 ml-auto"></div>
                <div className="h-3 bg-slate-700 rounded w-16 ml-auto"></div>
            </div>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-700">
            <div className="space-y-2">
                <div className="h-3 bg-slate-700 rounded w-16"></div>
                <div className="h-4 bg-slate-700 rounded w-20"></div>
            </div>
            <div className="space-y-2">
                <div className="h-3 bg-slate-700 rounded w-16"></div>
                <div className="h-4 bg-slate-700 rounded w-20"></div>
            </div>
            <div className="space-y-2">
                <div className="h-3 bg-slate-700 rounded w-16"></div>
                <div className="h-4 bg-slate-700 rounded w-20"></div>
            </div>
        </div>
    </div>
);

// Skeleton for transaction history
export const TransactionSkeleton = () => (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 animate-pulse">
        <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-700 rounded-lg"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-slate-700 rounded w-24"></div>
                    <div className="h-3 bg-slate-700 rounded w-32"></div>
                </div>
            </div>
            <div className="space-y-2 text-right">
                <div className="h-4 bg-slate-700 rounded w-20 ml-auto"></div>
                <div className="h-3 bg-slate-700 rounded w-16 ml-auto"></div>
            </div>
        </div>
    </div>
);

// Skeleton for news feed
export const NewsSkeleton = () => (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 animate-pulse">
        <div className="flex space-x-4">
            <div className="w-24 h-24 bg-slate-700 rounded-lg flex-shrink-0"></div>
            <div className="flex-1 space-y-3">
                <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                <div className="h-3 bg-slate-700 rounded w-full"></div>
                <div className="h-3 bg-slate-700 rounded w-2/3"></div>
                <div className="flex items-center space-x-2 mt-2">
                    <div className="h-3 bg-slate-700 rounded w-20"></div>
                    <div className="h-3 bg-slate-700 rounded w-24"></div>
                </div>
            </div>
        </div>
    </div>
);

// Generic loading spinner
export const LoadingSpinner = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    return (
        <div className="flex items-center justify-center">
            <div className={`${sizeClasses[size]} border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin`}></div>
        </div>
    );
};

// Full page loading
export const PageLoader = ({ message = 'Loading...' }) => (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="text-slate-400 mt-4 text-lg">{message}</p>
        </div>
    </div>
);
