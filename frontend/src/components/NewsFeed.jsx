import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

const MOCK_NEWS = [
    {
        id: 1,
        title: "Bitcoin Surges Past $65,000 as Institutional Interest Grows",
        source: "CryptoDaily",
        time: "2 hours ago",
        url: "#"
    },
    {
        id: 2,
        title: "Ethereum 2.0 Upgrade: What You Need to Know",
        source: "BlockchainNews",
        time: "4 hours ago",
        url: "#"
    },
    {
        id: 3,
        title: "Regulatory Clarity Boosts Market Confidence",
        source: "CoinTelegraph",
        time: "5 hours ago",
        url: "#"
    },
    {
        id: 4,
        title: "Top 5 Altcoins to Watch This Month",
        source: "Investopedia",
        time: "1 day ago",
        url: "#"
    }
];

const NewsFeed = () => {
    const [news, setNews] = useState([]);

    useEffect(() => {
        // Simulate API fetch
        setNews(MOCK_NEWS);
    }, []);

    return (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Latest News</h3>
            <div className="space-y-4">
                {news.map(item => (
                    <a key={item.id} href={item.url} className="block group">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors line-clamp-2">{item.title}</h4>
                                <div className="flex items-center mt-2 text-xs text-slate-500 space-x-2">
                                    <span>{item.source}</span>
                                    <span>•</span>
                                    <span>{item.time}</span>
                                </div>
                            </div>
                            <ExternalLink size={16} className="text-slate-500 group-hover:text-blue-400 transition-colors flex-shrink-0 ml-2" />
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default NewsFeed;
