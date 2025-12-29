import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { KeyRound, Chrome, ArrowLeft, Mail } from 'lucide-react';
import api from '../utils/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            const { data } = await api.post('/auth/forgot-password', { email });
            setMessage(data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-slate-800 w-full max-w-md p-8 rounded-2xl border border-slate-700 shadow-2xl">
                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl mx-auto flex items-center justify-center mb-4">
                        <KeyRound size={28} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Forgot Password?</h1>
                    <p className="text-slate-400 mt-2">Enter your email to reset your password.</p>
                </div>

                {message ? (
                    <div className="text-center mb-6">
                        <div className="bg-green-500/10 text-green-500 p-4 rounded-xl flex flex-col items-center">
                            <Mail size={32} className="mb-2" />
                            <p>{message}</p>
                        </div>
                        <Link to="/login" className="block mt-6 text-blue-500 hover:text-blue-400 font-medium">
                            Back to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Email Address</label>
                            <div className="relative">
                                <Chrome size={18} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        {error && <div className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded-lg">{error}</div>}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>

                        <div className="text-center">
                            <Link to="/login" className="inline-flex items-center text-slate-400 hover:text-white transition-colors text-sm">
                                <ArrowLeft size={16} className="mr-2" />
                                Back to Login
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
