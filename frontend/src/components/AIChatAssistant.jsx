import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Sparkles, TrendingUp, HelpCircle, X, Minimize2 } from 'lucide-react';

const AIChatAssistant = ({ minimized = false, onToggle }) => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "👋 Hi! I'm your MyDen AI assistant. I can help you with:\n\n• Portfolio analysis\n• Investment advice\n• Market insights\n• Trading strategies\n• Risk assessment\n\nWhat would you like to know?",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const quickQuestions = [
        { icon: TrendingUp, text: "What's my portfolio performance?", color: "purple" },
        { icon: Sparkles, text: "Should I rebalance my portfolio?", color: "blue" },
        { icon: HelpCircle, text: "What is dollar-cost averaging?", color: "green" }
    ];

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = {
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages([...messages, userMessage]);
        setInput('');
        setLoading(true);

        // Simulate AI response (replace with actual API call)
        setTimeout(() => {
            const aiResponse = {
                role: 'assistant',
                content: getAIResponse(input),
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);
            setLoading(false);
        }, 1500);
    };

    const getAIResponse = (question) => {
        const q = question.toLowerCase();

        if (q.includes('portfolio') && q.includes('performance')) {
            return "📊 Based on your current portfolio:\n\n• Total Value: $12,450\n• 30-day return: +8.5%\n• Best performer: BTC (+15%)\n• Underperformer: ETH (-2%)\n\nYour portfolio is outperforming the market! Consider taking some profits on BTC.";
        }

        if (q.includes('rebalance')) {
            return "⚖️ Portfolio Rebalancing Recommendation:\n\nYour current allocation:\n• BTC: 45% (Target: 40%)\n• ETH: 30% (Target: 35%)\n• Others: 25%\n\n✅ Suggested trades:\n• Sell $620 of BTC\n• Buy $620 of ETH\n\nThis will optimize your risk/reward ratio!";
        }

        if (q.includes('dollar-cost averaging') || q.includes('dca')) {
            return "💡 Dollar-Cost Averaging (DCA):\n\nDCA is an investment strategy where you invest a fixed amount at regular intervals, regardless of price.\n\n✅ Benefits:\n• Reduces timing risk\n• Averages out volatility\n• Disciplined investing\n• Lower psychological stress\n\nExample: Investing $100/week in BTC instead of $4,800 all at once.\n\nWant to set up auto-investing?";
        }

        if (q.includes('buy') || q.includes('invest')) {
            return "🎯 Investment Analysis:\n\nBefore buying, consider:\n1. Market conditions (currently: Bullish)\n2. Your risk tolerance\n3. Portfolio diversification\n4. Time horizon\n\nBased on current trends, BTC and ETH show strong momentum. Would you like specific entry points?";
        }

        if (q.includes('risk')) {
            return "⚠️ Risk Assessment:\n\nYour portfolio risk level: MODERATE\n\n• Diversification score: 7/10\n• Volatility: Medium\n• Recommended: Add more stable assets\n\nConsider:\n• 10-20% in stablecoins\n• Diversify across 5+ assets\n• Set stop-loss orders\n\nWant a detailed risk report?";
        }

        return `💭 Great question! I can help with:\n\n• Real-time market analysis\n• Personalized investment strategies\n• Portfolio optimization\n• Risk management tips\n• Educational resources\n\nCould you be more specific about what you'd like to know?`;
    };

    const handleQuickQuestion = (question) => {
        setInput(question);
        setTimeout(() => sendMessage(), 100);
    };

    if (minimized) {
        return (
            <button
                onClick={onToggle}
                className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-50 glow"
            >
                <MessageCircle size={28} className="text-white" />
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    AI
                </span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-purple-500/30 shadow-2xl flex flex-col z-50 animate-scale-in">
            {/* Header */}
            <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-gradient-to-r from-purple-900/50 to-blue-900/50">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                        <Sparkles size={20} className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">AI Assistant</h3>
                        <p className="text-xs text-green-400 flex items-center">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                            Online
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={onToggle}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <Minimize2 size={18} className="text-slate-400" />
                    </button>
                    <button
                        onClick={onToggle}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X size={18} className="text-slate-400" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                                    ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white'
                                    : 'bg-slate-800 text-slate-200'
                                }`}
                        >
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            <p className="text-xs opacity-60 mt-1">
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-slate-800 rounded-2xl px-4 py-3">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length === 1 && (
                <div className="px-4 pb-2">
                    <p className="text-xs text-slate-400 mb-2">Quick questions:</p>
                    <div className="space-y-2">
                        {quickQuestions.map((q, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleQuickQuestion(q.text)}
                                className="w-full text-left px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 flex items-center space-x-2 transition-colors"
                            >
                                <q.icon size={16} className={`text-${q.color}-400`} />
                                <span>{q.text}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-slate-700">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Ask me anything..."
                        className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                        disabled={loading}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={loading || !input.trim()}
                        className="btn-premium px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIChatAssistant;
