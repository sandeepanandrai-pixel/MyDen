import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

const PortfolioPerformanceChart = ({ portfolioHistory = [], benchmark = 'market' }) => {
    const [timeRange, setTimeRange] = useState('30d'); // 7d, 30d, 90d, 1y, all
    const [chartData, setChartData] = useState([]);
    const [performance, setPerformance] = useState({ change: 0, changePercent: 0 });

    useEffect(() => {
        // Generate mock historical data (replace with real data from backend)
        generateChartData();
    }, [timeRange]);

    const generateChartData = () => {
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
        const data = [];
        let baseValue = 10000;

        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (days - i));

            // Simulate portfolio value with some randomness
            const randomChange = (Math.random() - 0.45) * 100; // Slight upward bias
            baseValue += randomChange;

            // Simulate market benchmark (Bitcoin)
            const marketValue = 10000 + (i * 50) + (Math.random() - 0.5) * 200;

            data.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                portfolio: Math.round(baseValue),
                market: Math.round(marketValue)
            });
        }

        setChartData(data);

        // Calculate performance
        const firstValue = data[0]?.portfolio || 10000;
        const lastValue = data[data.length - 1]?.portfolio || 10000;
        const change = lastValue - firstValue;
        const changePercent = (change / firstValue) * 100;

        setPerformance({ change, changePercent });
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
                    <p className="text-slate-400 text-xs mb-1">{payload[0].payload.date}</p>
                    <p className="text-white font-semibold">
                        Portfolio: ${payload[0].value.toLocaleString()}
                    </p>
                    {payload[1] && (
                        <p className="text-slate-400 text-sm">
                            Market: ${payload[1].value.toLocaleString()}
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    const isPositive = performance.changePercent >= 0;

    return (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white mb-1">Portfolio Performance</h3>
                    <div className="flex items-center space-x-2">
                        {isPositive ? (
                            <TrendingUp className="text-green-500" size={20} />
                        ) : (
                            <TrendingDown className="text-red-500" size={20} />
                        )}
                        <span className={`text-2xl font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                            {isPositive ? '+' : ''}{performance.changePercent.toFixed(2)}%
                        </span>
                        <span className="text-slate-400 text-sm">
                            ({isPositive ? '+' : ''}${performance.change.toLocaleString()})
                        </span>
                    </div>
                </div>

                {/* Time Range Selector */}
                <div className="flex bg-slate-900 rounded-lg p-1">
                    {['7d', '30d', '90d', '1y'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${timeRange === range
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            {range.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="marketGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                        dataKey="date"
                        stroke="#64748b"
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <YAxis
                        stroke="#64748b"
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="market"
                        stroke="#94a3b8"
                        strokeWidth={1}
                        fill="url(#marketGradient)"
                        strokeDasharray="5 5"
                    />
                    <Area
                        type="monotone"
                        dataKey="portfolio"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        fill="url(#portfolioGradient)"
                    />
                </AreaChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex items-center justify-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-sm text-slate-400">Your Portfolio</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-1 bg-slate-500" style={{ borderTop: '2px dashed #94a3b8' }}></div>
                    <span className="text-sm text-slate-400">Market (BTC)</span>
                </div>
            </div>

            {/* Performance Summary */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-700">
                <div className="text-center">
                    <p className="text-slate-400 text-xs mb-1">Best Day</p>
                    <p className="text-green-500 font-semibold">+$450</p>
                </div>
                <div className="text-center">
                    <p className="text-slate-400 text-xs mb-1">Worst Day</p>
                    <p className="text-red-500 font-semibold">-$230</p>
                </div>
                <div className="text-center">
                    <p className="text-slate-400 text-xs mb-1">Avg. Daily</p>
                    <p className="text-white font-semibold">+${(performance.change / chartData.length).toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
};

export default PortfolioPerformanceChart;
