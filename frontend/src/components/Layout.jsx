import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, PieChart, Settings, LogOut, FileText, BarChart, Menu, X, Search, Bell, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationCenter from './NotificationCenter';
import AIChatAssistant from './AIChatAssistant';

const SidebarItem = ({ icon: Icon, label, active, onClick, to, isMobile, closeSidebar }) => {
    const handleClick = () => {
        if (isMobile && closeSidebar) {
            closeSidebar();
        }
        if (onClick) onClick();
    };

    const content = (
        <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${active ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Icon size={20} />
            <span className="font-medium">{label}</span>
        </div>
    );

    if (to) {
        return <Link to={to} className="block" onClick={handleClick}>{content}</Link>;
    }

    return <div onClick={handleClick}>{content}</div>;
};

const Layout = ({ children }) => {
    const { logout, user } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [chatMinimized, setChatMinimized] = useState(true);

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="flex h-screen bg-gradient-to-br from-[#0a0e27] via-[#10162f] to-[#0a0e27] text-white overflow-hidden">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={closeSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50
                w-64 bg-slate-950/90 backdrop-blur-xl p-6 
                flex flex-col border-r border-slate-800
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Close button (mobile only) */}
                <button
                    onClick={closeSidebar}
                    className="lg:hidden absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
                >
                    <X size={24} />
                </button>

                {/* Logo */}
                <div className="flex items-center space-x-3 mb-10 px-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/30 transform hover:scale-105 transition-transform">
                        <span className="text-2xl">🏠</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-purple-400 via-purple-300 to-blue-400 bg-clip-text text-transparent">
                            MyDen
                        </span>
                        <span className="text-xs text-slate-500 font-medium">Your Investment Den</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-2">
                    <SidebarItem
                        icon={LayoutDashboard}
                        label="Dashboard"
                        active={location.pathname === '/dashboard'}
                        to="/dashboard"
                        isMobile={true}
                        closeSidebar={closeSidebar}
                    />
                    <SidebarItem
                        icon={TrendingUp}
                        label="Market"
                        active={location.pathname === '/market'}
                        to="/market"
                        isMobile={true}
                        closeSidebar={closeSidebar}
                    />
                    <SidebarItem
                        icon={PieChart}
                        label="Portfolio"
                        active={location.pathname === '/portfolio'}
                        to="/portfolio"
                        isMobile={true}
                        closeSidebar={closeSidebar}
                    />
                    <SidebarItem
                        icon={BarChart}
                        label="Analysis"
                        active={location.pathname === '/analysis'}
                        to="/analysis"
                        isMobile={true}
                        closeSidebar={closeSidebar}
                    />
                    <SidebarItem
                        icon={FileText}
                        label="History"
                        active={location.pathname === '/history'}
                        to="/history"
                        isMobile={true}
                        closeSidebar={closeSidebar}
                    />
                    <SidebarItem
                        icon={User}
                        label="Profile"
                        active={location.pathname === '/profile'}
                        to="/profile"
                        isMobile={true}
                        closeSidebar={closeSidebar}
                    />
                    <SidebarItem
                        icon={Settings}
                        label="Settings"
                        active={location.pathname === '/settings'}
                        to="/settings"
                        isMobile={true}
                        closeSidebar={closeSidebar}
                    />
                </nav>

                {/* Logout */}
                <div className="pt-6 border-t border-slate-800">
                    <SidebarItem icon={LogOut} label="Logout" onClick={logout} />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 border-b border-slate-800 flex items-center justify-between px-4 lg:px-8 bg-slate-900/50 backdrop-blur-md shrink-0">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        <Menu size={24} />
                    </button>

                    {/* Search (hidden on small mobile) */}
                    <div className="hidden sm:block relative flex-1 max-w-md lg:max-w-lg">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-slate-800 text-sm text-white pl-10 pr-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-slate-500 transition-all"
                        />
                    </div>

                    {/* Right side icons */}
                    <div className="flex items-center space-x-2 lg:space-x-4">
                        {/* Search icon for mobile */}
                        <button className="sm:hidden p-2 text-slate-400 hover:text-white">
                            <Search size={20} />
                        </button>

                        <NotificationCenter />

                        <div className="hidden lg:flex items-center space-x-2 px-3 py-2 bg-slate-800 rounded-lg">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                                U
                            </div>
                            <span className="text-sm font-medium">User</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto">
                    {children}
                </div>

                {/* Bottom Navigation (Mobile Only) */}
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 z-30">
                    <div className="flex justify-around items-center h-16 px-2">
                        <Link
                            to="/dashboard"
                            className={`flex flex-col items-center justify-center flex-1 py-2 rounded-lg transition-colors ${location.pathname === '/dashboard' ? 'text-blue-500' : 'text-slate-400'}`}
                        >
                            <LayoutDashboard size={20} />
                            <span className="text-xs mt-1">Dashboard</span>
                        </Link>
                        <Link
                            to="/market"
                            className={`flex flex-col items-center justify-center flex-1 py-2 rounded-lg transition-colors ${location.pathname === '/market' ? 'text-blue-500' : 'text-slate-400'}`}
                        >
                            <TrendingUp size={20} />
                            <span className="text-xs mt-1">Market</span>
                        </Link>
                        <Link
                            to="/portfolio"
                            className={`flex flex-col items-center justify-center flex-1 py-2 rounded-lg transition-colors ${location.pathname === '/portfolio' ? 'text-blue-500' : 'text-slate-400'}`}
                        >
                            <PieChart size={20} />
                            <span className="text-xs mt-1">Portfolio</span>
                        </Link>
                        <Link
                            to="/analysis"
                            className={`flex flex-col items-center justify-center flex-1 py-2 rounded-lg transition-colors ${location.pathname === '/analysis' ? 'text-blue-500' : 'text-slate-400'}`}
                        >
                            <BarChart size={20} />
                            <span className="text-xs mt-1">Analysis</span>
                        </Link>
                        <Link
                            to="/settings"
                            className={`flex flex-col items-center justify-center flex-1 py-2 rounded-lg transition-colors ${location.pathname === '/settings' ? 'text-blue-500' : 'text-slate-400'}`}
                        >
                            <Settings size={20} />
                            <span className="text-xs mt-1">Settings</span>
                        </Link>
                    </div>
                </nav>
            </main>

            {/* AI Chat Assistant */}
            <AIChatAssistant
                minimized={chatMinimized}
                onToggle={() => setChatMinimized(!chatMinimized)}
            />
        </div>
    );
};

export default Layout;
