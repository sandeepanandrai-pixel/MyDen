import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHistory, Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { Lock, Chrome, Phone, UserPlus, Mail, CheckCircle } from 'lucide-react';

const Signup = () => {
    const { signup } = useAuth();
    const history = useHistory();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [captchaToken, setCaptchaToken] = useState(null);
    const [error, setError] = useState('');
    const [showVerificationMessage, setShowVerificationMessage] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        if (!captchaToken) {
            setError('Please complete the captcha.');
            return;
        }

        // Real Signup Logic - role is always 'user'
        const result = await signup({ firstName, lastName, email, phone, password, role: 'user' });

        if (result.success) {
            // Show verification message instead of redirecting
            setShowVerificationMessage(true);
        } else {
            setError(result.message);
        }
    };


    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-slate-800 w-full max-w-md p-8 rounded-2xl border border-slate-700 shadow-2xl">
                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl mx-auto flex items-center justify-center mb-4">
                        <UserPlus size={28} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Create Account</h1>
                    <p className="text-slate-400 mt-2">Join InvestApp today</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">First Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                placeholder="John"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Last Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                placeholder="Doe"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">Email ID <span className="text-red-500">*</span></label>
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
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Phone size={18} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500" />
                            <input
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">Password <span className="text-red-500">*</span></label>
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

                    <div className="flex justify-center pt-2">
                        <ReCAPTCHA
                            sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                            onChange={(token) => setCaptchaToken(token)}
                            theme="dark"
                        />
                    </div>

                    {error && <div className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded-lg">{error}</div>}

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/20">
                        Create Account
                    </button>

                    <p className="text-center text-slate-400 text-sm mt-4">
                        Already have an account? <a href="/login" className="text-blue-500 hover:text-blue-400 font-medium">Log In</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;
