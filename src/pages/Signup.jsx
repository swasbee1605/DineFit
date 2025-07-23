import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
    const { signup } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSignup = async (event) => {
        event.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        setIsLoading(true);
        
        try {
            await signup(formData.email, formData.password, formData.name);
            alert('Signup successful!');
            setFormData({ name: '', email: '', password: '', confirmPassword: '' });
            window.location.href = '/dashboard';
        } catch (error) {
            console.error('Signup failed:', error);
            alert('Signup failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
            <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg space-y-6 sm:space-y-8 bg-white p-6 sm:p-8 lg:p-10 rounded-xl shadow-2xl">
                <div className="text-center">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Join DineFit</h1>
                    <p className="text-base sm:text-lg text-gray-600">Create your account and start your fitness journey</p>
                </div>
                
                <form onSubmit={handleSignup} className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
                    <div className="space-y-3 sm:space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                                required
                                className="w-full px-3 py-2 sm:px-4 sm:py-3 text-base sm:text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 placeholder-gray-400"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter your email"
                                required
                                className="w-full px-3 py-2 sm:px-4 sm:py-3 text-base sm:text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 placeholder-gray-400"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Create a password"
                                required
                                className="w-full px-3 py-2 sm:px-4 sm:py-3 text-base sm:text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 placeholder-gray-400"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="Confirm your password"
                                required
                                className="w-full px-3 py-2 sm:px-4 sm:py-3 text-base sm:text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 placeholder-gray-400"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold text-base sm:text-lg py-2.5 sm:py-3 px-4 rounded-lg transition-colors duration-200 transform hover:scale-105 active:scale-95 disabled:transform-none shadow-lg"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="text-sm sm:text-base">Creating Account...</span>
                            </div>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>
                
                <div className="text-center">
                    <p className="text-sm sm:text-base text-gray-600">
                        Already have an account?{' '}
                        <a href="/login" className="font-medium text-green-600 hover:text-green-500 transition-colors duration-200">
                            Sign in here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup