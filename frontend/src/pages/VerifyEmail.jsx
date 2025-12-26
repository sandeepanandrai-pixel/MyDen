import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Mail, RefreshCw } from 'lucide-react';
import axios from 'axios';

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
                const response = await axios.get(`${apiUrl}/api/auth/verify-email/${token}`);

                setStatus('success');
                setMessage(response.data.message);

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Verification failed. The link may be expired or invalid.');
            }
        };

        if (token) {
            verifyEmail();
        }
    }, [token, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl p-8">
                    {/* Status Icon */}
                    <div className="flex justify-center mb-6">
                        {status === 'verifying' && (
                            <div className="h-20 w-20 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <RefreshCw size={40} className="text-blue-400 animate-spin" />
                            </div>
                        )}
                        {status === 'success' && (
                            <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center">
                                <CheckCircle size={40} className="text-green-400" />
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="h-20 w-20 rounded-full bg-red-500/20 flex items-center justify-center">
                                <XCircle size={40} className="text-red-400" />
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-white text-center mb-4">
                        {status === 'verifying' && 'Verifying Email'}
                        {status === 'success' && 'Email Verified!'}
                        {status === 'error' && 'Verification Failed'}
                    </h1>

                    {/* Message */}
                    <p className="text-slate-300 text-center mb-6">
                        {message}
                    </p>

                    {/* Success State */}
                    {status === 'success' && (
                        <div className="space-y-4">
                            <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
                                <p className="text-green-300 text-sm">
                                    ✓ Your account is now active<br />
                                    ✓ Redirecting to login page in 3 seconds...
                                </p>
                            </div>
                            <Link
                                to="/login"
                                className="block w-full text-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
                            >
                                Go to Login Now
                            </Link>
                        </div>
                    )}

                    {/* Error State */}
                    {status === 'error' && (
                        <div className="space-y-4">
                            <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4">
                                <p className="text-red-300 text-sm">
                                    The verification link may have expired or is invalid.
                                    Please request a new verification email.
                                </p>
                            </div>
                            <Link
                                to="/resend-verification"
                                className="block w-full text-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
                            >
                                <Mail size={18} className="inline mr-2" />
                                Request New Link
                            </Link>
                            <Link
                                to="/login"
                                className="block w-full text-center text-slate-400 hover:text-white transition-colors"
                            >
                                Back to Login
                            </Link>
                        </div>
                    )}

                    {/* Verifying State */}
                    {status === 'verifying' && (
                        <div className="text-center">
                            <div className="inline-block">
                                <div className="flex space-x-2">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Help Text */}
                <p className="text-slate-400 text-sm text-center mt-6">
                    Need help? Contact support at{' '}
                    <a href="mailto:support@myden.com" className="text-blue-400 hover:underline">
                        support@myden.com
                    </a>
                </p>
            </div>
        </div>
    );
};

export default VerifyEmail;
