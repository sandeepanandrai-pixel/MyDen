import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, PieChart, Settings, LogOut, Search, Bell, FileText } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const SidebarItem = ({ icon: Icon, label, active, onClick, to }) => {
    const content = (
        <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Icon size={20} />
            <span className="font-medium">{label}</span>
        </div>
    );

    // If 'to' is provided, render as Link; otherwise use div with onClick
    if (to) {
        return <Link to={to} className="block">{content}</Link>;
    }

    return <div onClick={onClick}>{content}</div>;
};

const Layout = ({ children }) => {
    const { logout } = useAuth();
    const location = useLocation();

    return (
        <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-950 p-6 flex flex-col border-r border-slate-800">
                <div className="flex items-center space-x-2 mb-10 px-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">I</div>
                    <span className="text-xl font-bold tracking-tight">Invest<span className="text-blue-500">App</span></span>
                </div>

                <nav className="flex-1 space-y-2">
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/'} to="/" />
                    <SidebarItem icon={TrendingUp} label="Market" active={location.pathname === '/market'} to="/market" />
                    <SidebarItem icon={PieChart} label="Portfolio" active={location.pathname === '/portfolio'} to="/portfolio" />
                    <SidebarItem icon={FileText} label="History" active={location.pathname === '/history'} to="/history" />
                    <SidebarItem icon={Settings} label="Settings" active={location.pathname === '/settings'} to="/settings" />
                </nav>

                <div className="pt-6 border-t border-slate-800">
                    <SidebarItem icon={LogOut} label="Logout" onClick={logout} />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/50 backdrop-blur-md">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search stocks, ETFs, crypto..."
                            className="w-full bg-slate-800 text-sm text-white pl-10 pr-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-slate-500 transition-all"
                        />
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
                        </button>
                        <div className="h-8 w-8 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full border border-slate-700"></div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-8 bg-slate-900">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
