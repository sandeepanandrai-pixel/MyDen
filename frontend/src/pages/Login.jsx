import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHistory, Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { ShieldCheck, User, Lock, Chrome } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const history = useHistory();
    const [role, setRole] = useState('user');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [captchaToken, setCaptchaToken] = useState(null);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!captchaToken) {
            setError('Please complete the captcha.');
            return;
        }

        // Real Authentication Logic
        const result = await login(email, password);

        if (result.success) {
            history.push('/dashboard');
        } else {
            setError(result.message);
        }
    };


    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-slate-800 w-full max-w-md p-8 rounded-2xl border border-slate-700 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl mx-auto flex items-center justify-center mb-4">
                        <ShieldCheck size={28} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                    <p className="text-slate-400 mt-2">Sign in to your investment portfolio</p>
                </div>

                <div className="flex bg-slate-700 p-1.5 rounded-xl mb-8">
                    <button
                        onClick={() => setRole('user')}
                        className={`flex-1 flex items-center justify-center text-sm font-medium py-2 rounded-lg transition-all ${role === 'user' ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                    >
                        <User size={16} className="mr-2" />
                        User
                    </button>
                    <button
                        onClick={() => setRole('admin')}
                        className={`flex-1 flex items-center justify-center text-sm font-medium py-2 rounded-lg transition-all ${role === 'admin' ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                    >
                        <ShieldCheck size={16} className="mr-2" />
                        Admin
                    </button>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
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

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">Password</label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    <div className="flex justify-between mt-2 text-sm">
                        <Link to="/resend-verification" className="text-blue-500 hover:text-blue-400">Resend Verification?</Link>
                        <Link to="/forgot-password" className="text-blue-500 hover:text-blue-400">Forgot Password?</Link>
                    </div>

                    <div className="flex justify-center mt-6">
                        <ReCAPTCHA
                            sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                            onChange={(token) => setCaptchaToken(token)}
                            theme="dark"
                        />
                    </div>

                    {error && <div className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded-lg mt-4">{error}</div>}

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 mt-6">
                        Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>

                    <div className="text-center mt-6 space-y-2">
                        <p className="text-slate-400 text-sm">
                            Don't have an account? <a href="/signup" className="text-blue-500 hover:text-blue-400 font-medium">Sign Up</a>
                        </p>
                        <p className="text-sm">
                            <a href="/" className="text-slate-500 hover:text-slate-400 transition-colors">Back to Home</a>
                        </p>
                    </div>
                </form>
            </div >
        </div >
    );
};

export default Login;
