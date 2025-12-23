import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { time: '10:00', value: 1450 },
    { time: '11:00', value: 1480 },
    { time: '12:00', value: 1460 },
    { time: '13:00', value: 1510 },
    { time: '14:00', value: 1490 },
    { time: '15:00', value: 1550 },
    { time: '16:00', value: 1580 },
];

const MarketChart = () => {
    return (
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-white">Market Overview</h2>
                    <p className="text-sm text-slate-400">S&P 500 Performance</p>
                </div>
                <div className="flex space-x-2">
                    {['1D', '1W', '1M', '1Y', 'ALL'].map(period => (
                        <button key={period} className={`px-3 py-1 text-xs font-medium rounded-md ${period === '1D' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                            {period}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="time" stroke="#94a3b8" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} domain={['dataMin - 50', 'dataMax + 50']} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default MarketChart;
