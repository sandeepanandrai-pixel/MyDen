import React, { useState, useEffect } from 'react';
import { Bell, X, TrendingUp, TrendingDown, AlertCircle, CheckCircle, DollarSign } from 'lucide-react';

const NotificationCenter = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        // Load notifications from localStorage or API
        loadNotifications();

        // Simulate real-time notifications (in production, use WebSocket or polling)
        const interval = setInterval(() => {
            checkForNewNotifications();
        }, 30000); // Check every 30 seconds

        return () => clearInterval(interval);
    }, []);

    const loadNotifications = () => {
        const stored = localStorage.getItem('notifications');
        if (stored) {
            const parsed = JSON.parse(stored);
            setNotifications(parsed);
            setUnreadCount(parsed.filter(n => !n.read).length);
        } else {
            // Add some demo notifications
            const demoNotifications = [
                {
                    id: 1,
                    type: 'price_alert',
                    title: 'Price Alert Triggered',
                    message: 'Bitcoin reached your target price of $65,000',
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    read: false,
                    icon: TrendingUp,
                    color: 'green'
                },
                {
                    id: 2,
                    type: 'achievement',
                    title: 'Achievement Unlocked!',
                    message: 'You earned the "First Trade" badge',
                    timestamp: new Date(Date.now() - 7200000).toISOString(),
                    read: false,
                    icon: CheckCircle,
                    color: 'blue'
                },
                {
                    id: 3,
                    type: 'market',
                    title: 'Market Condition Change',
                    message: 'Market condition changed from SIDEWAYS to BULL',
                    timestamp: new Date(Date.now() - 10800000).toISOString(),
                    read: true,
                    icon: AlertCircle,
                    color: 'yellow'
                },
                {
                    id: 4,
                    type: 'rebalance',
                    title: 'Rebalancing Recommended',
                    message: 'Your portfolio has drifted 15% from target allocation',
                    timestamp: new Date(Date.now() - 86400000).toISOString(),
                    read: true,
                    icon: TrendingUp,
                    color: 'purple'
                }
            ];
            setNotifications(demoNotifications);
            setUnreadCount(demoNotifications.filter(n => !n.read).length);
        }
    };

    const checkForNewNotifications = () => {
        // In production, this would poll the backend or use WebSocket
        // For now, it's a placeholder
    };

    const markAsRead = (id) => {
        const updated = notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        );
        setNotifications(updated);
        setUnreadCount(updated.filter(n => !n.read).length);
        localStorage.setItem('notifications', JSON.stringify(updated));
    };

    const markAllAsRead = () => {
        const updated = notifications.map(n => ({ ...n, read: true }));
        setNotifications(updated);
        setUnreadCount(0);
        localStorage.setItem('notifications', JSON.stringify(updated));
    };

    const deleteNotification = (id) => {
        const updated = notifications.filter(n => n.id !== id);
        setNotifications(updated);
        setUnreadCount(updated.filter(n => !n.read).length);
        localStorage.setItem('notifications', JSON.stringify(updated));
    };

    const getColorClasses = (color) => {
        const colors = {
            green: 'bg-green-900/20 border-green-600/30 text-green-400',
            blue: 'bg-blue-900/20 border-blue-600/30 text-blue-400',
            yellow: 'bg-yellow-900/20 border-yellow-600/30 text-yellow-400',
            purple: 'bg-purple-900/20 border-purple-600/30 text-purple-400',
            red: 'bg-red-900/20 border-red-600/30 text-red-400'
        };
        return colors[color] || colors.blue;
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="relative">
            {/* Bell Icon with Badge */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
                <Bell size={20} className="text-slate-400" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 z-50 animate-slide-down">
                    {/* Header */}
                    <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                        <div>
                            <h3 className="text-white font-semibold">Notifications</h3>
                            <p className="text-slate-400 text-xs">{unreadCount} unread</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    Mark all read
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Notification List */}
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <Bell size={48} className="mx-auto text-slate-600 mb-3" />
                                <p className="text-slate-400">No notifications yet</p>
                                <p className="text-slate-500 text-sm">We'll notify you about important updates</p>
                            </div>
                        ) : (
                            notifications.map((notification) => {
                                const Icon = notification.icon;
                                return (
                                    <div
                                        key={notification.id}
                                        className={`p-4 border-b border-slate-700 hover:bg-slate-700/30 transition-colors cursor-pointer ${!notification.read ? 'bg-blue-900/10' : ''
                                            }`}
                                        onClick={() => markAsRead(notification.id)}
                                    >
                                        <div className="flex items-start space-x-3">
                                            {/* Icon */}
                                            <div className={`p-2 rounded-lg border flex-shrink-0 ${getColorClasses(notification.color)}`}>
                                                <Icon size={20} />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-1">
                                                    <h4 className="text-white font-semibold text-sm">{notification.title}</h4>
                                                    {!notification.read && (
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                                                    )}
                                                </div>
                                                <p className="text-slate-400 text-sm mb-2">{notification.message}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-slate-500">{formatTimestamp(notification.timestamp)}</span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteNotification(notification.id);
                                                        }}
                                                        className="text-xs text-slate-500 hover:text-red-400 transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="p-3 text-center border-t border-slate-700">
                            <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium">
                                View All Notifications
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;
