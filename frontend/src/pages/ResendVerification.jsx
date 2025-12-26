import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const ResendVerification = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const response = await axios.post(`${apiUrl}/api/auth/resend-verification`, { email });

            setMessage({
                type: 'success',
                text: response.data.message
            });
            setEmail('');
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to send verification email. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl p-8">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="h-20 w-20 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Mail size={40} className="text-blue-400" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-white text-center mb-2">
                        Resend Verification Email
                    </h1>
                    <p className="text-slate-400 text-center mb-8">
                        Enter your email address and we'll send you a new verification link
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="your@email.com"
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Success/Error Message */}
                        {message.text && (
                            <div className={`p-4 rounded-lg flex items-start space-x-3 ${message.type === 'success'
                                    ? 'bg-green-900/20 border border-green-600/30 text-green-300'
                                    : 'bg-red-900/20 border border-red-600/30 text-red-300'
                                }`}>
                                {message.type === 'success' ? (
                                    <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
                                ) : (
                                    <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                                )}
                                <span className="text-sm">{message.text}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Sending...</span>
                                </>
                            ) : (
                                <>
                                    <Send size={18} />
                                    <span>Send Verification Email</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Additional Links */}
                    <div className="mt-6 text-center space-y-2">
                        <Link
                            to="/login"
                            className="block text-slate-400 hover:text-white transition-colors text-sm"
                        >
                            ← Back to Login
                        </Link>
                        <Link
                            to="/signup"
                            className="block text-slate-400 hover:text-white transition-colors text-sm"
                        >
                            Don't have an account? Sign up
                        </Link>
                    </div>
                </div>

                {/* Info Box */}
                <div className="mt-6 bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2 flex items-center">
                        <Mail size={16} className="mr-2 text-blue-400" />
                        Check your spam folder
                    </h3>
                    <p className="text-slate-400 text-sm">
                        If you don't see the email in your inbox, please check your spam or junk folder.
                        The verification link expires in 24 hours.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResendVerification;
