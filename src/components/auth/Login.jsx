import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { USER_ROLES } from '../../types/types';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login, register, loginWithGoogle } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        department: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const redirectBasedOnRole = (role) => {
        switch (role) {
            case USER_ROLES.ADMIN_ITC:
                navigate('/admin');
                break;
            case USER_ROLES.INSTITUTIONAL_HEAD:
                navigate('/head-dashboard');
                break;
            case USER_ROLES.DEAN:
                navigate('/dean-dashboard');
                break;
            case USER_ROLES.HOD:
                navigate('/hod-dashboard');
                break;
            case USER_ROLES.EVENT_COORDINATOR:
            default:
                navigate('/dashboard');
                break;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let result;
            if (isLogin) {
                result = await login(formData.email, formData.password);
            } else {
                result = await register(formData.email, formData.password, formData.name, formData.department);
            }
            // Add a small delay to ensure Firestore update propagates if needed, though usually not distinct for auth
            redirectBasedOnRole(result.role);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to authenticate');
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            const result = await loginWithGoogle();
            redirectBasedOnRole(result.role);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to sign in with Google');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 lg:p-0 font-sans">
            <div className="max-w-6xl w-full grid lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[600px] animate-fade-in">

                {/* Left Side - Form */}
                <div className="p-8 lg:p-12 flex flex-col justify-center relative">
                    <div className="absolute top-8 left-8">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-brand-50 text-brand-600 rounded-lg flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </div>
                            <span className="text-sm font-semibold text-slate-500 group-hover:text-brand-600 transition-colors">Back to Home</span>
                        </Link>
                    </div>

                    <div className="max-w-md mx-auto w-full mt-10">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-slate-900 mb-2 font-display">
                                {isLogin ? 'Welcome Back' : 'Create Account'}
                            </h2>
                            <p className="text-slate-500">
                                {isLogin
                                    ? 'Enter your credentials to access your dashboard.'
                                    : 'Register to start managing your institutional events.'}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2 animate-slide-down">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                        )}

                        {/* Google Sign In Button */}
                        <button
                            onClick={handleGoogleLogin}
                            type="button"
                            className="w-full btn btn-secondary py-3 text-sm flex items-center gap-3 mb-6 relative hover:bg-slate-50 transition-all border-slate-200"
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                            <span>Sign in with Google</span>
                        </button>

                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-slate-500">Or continue with email</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {!isLogin && (
                                <>
                                    <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                                        <label className="input-label">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="input-field"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                                        <label className="input-label">Department</label>
                                        <input
                                            type="text"
                                            name="department"
                                            value={formData.department}
                                            onChange={handleChange}
                                            required
                                            className="input-field"
                                            placeholder="CSE"
                                        />
                                    </div>
                                </>
                            )}

                            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                                <label className="input-label">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                    placeholder="name@institution.edu"
                                />
                            </div>

                            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                                <label className="input-label">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn btn-primary py-3.5 text-base shadow-brand-500/25 animate-slide-up"
                                style={{ animationDelay: '0.4s' }}
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    isLogin ? 'Sign In' : 'Create Account'
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center animate-slide-up" style={{ animationDelay: '0.5s' }}>
                            <p className="text-slate-500 text-sm">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}
                                <button
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="ml-2 font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                                >
                                    {isLogin ? 'Register Now' : 'Sign In'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Decorative */}
                <div className="hidden lg:block relative bg-slate-900 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-secondary-900 opacity-90"></div>
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center mix-blend-overlay opacity-50"></div>

                    {/* Abstract Shapes */}
                    <div className="absolute top-20 right-20 w-64 h-64 bg-brand-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
                    <div className="absolute bottom-20 left-20 w-64 h-64 bg-secondary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

                    <div className="relative z-10 h-full flex flex-col justify-between p-12 text-white">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>

                        <div>
                            <h3 className="text-3xl font-bold mb-4 font-display">Institutional Excellence</h3>
                            <p className="text-blue-100 leading-relaxed max-w-sm">
                                Experience the future of event management. Streamlined workflows, intelligent allocation, and real-time insights—all in one place.
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <div className="w-12 h-1 bg-white rounded-full"></div>
                            <div className="w-4 h-1 bg-white/30 rounded-full"></div>
                            <div className="w-4 h-1 bg-white/30 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
