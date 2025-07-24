import React, { createContext, useContext, useEffect, useState } from 'react';
import { account } from '../appwriteClient';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadingMessage, setLoadingMessage] = useState('Loading DineFit...');

    useEffect(() => {
        // Much faster initial load - don't wait for session check on first load
        const quickInit = async () => {
            // Set loading to false much faster for better UX
            const quickTimeout = setTimeout(() => {
                setLoading(false);
                setUser(null);
            }, 2000); // Reduced from 8 seconds to 2 seconds
            
            try {
                // Quick session check without blocking UI
                const currentUser = await account.get();
                console.log('User session found:', currentUser);
                setUser(currentUser);
                setError(null);
                clearTimeout(quickTimeout);
                setLoading(false);
            } catch (error) {
                console.log('No active session, continuing as guest');
                // Don't treat this as an error - user just isn't logged in
                setUser(null);
                setError(null);
                clearTimeout(quickTimeout);
                setLoading(false);
            }
        };
        
        quickInit();
    }, []);

    const checkUserSession = async () => {
        try {
            console.log('Checking user session...');
            
            // Set a stricter timeout for the session check
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Session check timeout')), 5000);
            });
            
            const sessionPromise = account.get();
            
            // Race between the session check and timeout
            const currentUser = await Promise.race([sessionPromise, timeoutPromise]);
            
            console.log('User found:', currentUser);
            setUser(currentUser);
            setError(null);
        } catch (error) {
            console.log('No user session found or timeout occurred:', error.message);
            
            // In development, if we get a network error or timeout, 
            // continue without authentication to allow app testing
            if (import.meta.env.DEV && (error.message.includes('timeout') || error.message.includes('network'))) {
                console.log('Development mode: continuing without authentication');
            }
            
            setUser(null);
            setError(null);
        } finally {
            console.log('Setting loading to false');
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            console.log('Starting login process...');
            console.log('Using endpoint:', import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1');
            setError(null);
            
            // Test connection first with a quick ping
            try {
                console.log('Testing connection to Appwrite...');
                const healthCheck = fetch('https://cloud.appwrite.io/v1/health', {
                    method: 'GET',
                    timeout: 3000
                });
                const timeoutCheck = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Network timeout')), 3000)
                );
                
                const response = await Promise.race([healthCheck, timeoutCheck]);
                console.log('Health check response status:', response.status);
                console.log('Network connectivity confirmed');
            } catch (healthError) {
                console.warn('Network check failed:', healthError);
                throw new Error('Unable to connect to server. Please check your internet connection and try again.');
            }
            
            // Create session with extended timeout for slow connections
            console.log('Attempting to create session...');
            const loginPromise = account.createEmailPasswordSession(email, password);
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Login is taking longer than expected. Please try again.')), 20000);
            });
            
            const session = await Promise.race([loginPromise, timeoutPromise]);
            console.log('Session created successfully:', session);
            
            // Get user data with timeout
            console.log('Fetching user data...');
            const userPromise = account.get();
            const userTimeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('User data fetch timeout')), 10000);
            });
            
            const currentUser = await Promise.race([userPromise, userTimeoutPromise]);
            console.log('Login successful, user:', currentUser);
            
            setUser(currentUser);
            setError(null);
            return currentUser;
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message);
            
            // Provide user-friendly error messages
            if (error.message.includes('timeout') || error.message.includes('Network timeout')) {
                throw new Error('Connection is slow or unavailable. Please check your internet and try again.');
            } else if (error.message.includes('Unable to connect')) {
                throw new Error(error.message);
            } else if (error.message.includes('Invalid credentials') || error.message.includes('invalid_credentials')) {
                throw new Error('Invalid email or password. Please check your credentials.');
            } else if (error.message.includes('user_invalid')) {
                throw new Error('Invalid email or password. Please check your credentials.');
            } else if (error.message.includes('rate_limit')) {
                throw new Error('Too many login attempts. Please wait a moment and try again.');
            } else {
                throw new Error(`Login failed: ${error.message || 'Unknown error'}`);
            }
        }
    };

    const logout = async () => {
        try {
            // Delete the current session
            await account.deleteSession('current');
            console.log('Session deleted successfully');
            setUser(null);
            setError(null);
        } catch (error) {
            console.error('Logout error:', error);
            // Even if logout fails on server, clear local user state
            setUser(null);
            throw error;
        }
    };

    const signup = async (email, password, name = '') => {
        try {
            // Ensure name is a valid string and at least 1 character
            const validName = name && name.trim() ? name.trim() : 'User';
            
            console.log('Creating user account...');
            // Create the user account
            const user = await account.create('unique()', email, password, validName);
            console.log('User account created:', user);
            
            // Automatically log them in after signup to create a session
            await login(email, password);
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    };

    const value = {
        user,
        login,
        logout,
        signup,
        loading,
        error,
        isAuthenticated: !!user
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600 mb-2">{loadingMessage}</p>
                    <p className="text-sm text-gray-500">If this takes too long, please refresh the page</p>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
