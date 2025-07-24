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

    useEffect(() => {
        checkUserSession();
        
        // Fallback timeout in case Appwrite hangs
        const timeout = setTimeout(() => {
            console.log('Auth check timeout - setting loading to false');
            setLoading(false);
        }, 10000); // 10 second timeout
        
        return () => clearTimeout(timeout);
    }, []);

    const checkUserSession = async () => {
        try {
            console.log('Checking user session...');
            const currentUser = await account.get();
            console.log('User found:', currentUser);
            setUser(currentUser);
            setError(null);
        } catch (error) {
            // User is not logged in
            console.log('No user session found:', error.message);
            setUser(null);
            setError(null); // Don't set this as an error, it's normal
        } finally {
            console.log('Setting loading to false');
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            // Create a persistent email session
            const session = await account.createEmailPasswordSession(email, password);
            console.log('Session created:', session);
            
            // Get the current user after successful login
            const currentUser = await account.get();
            console.log('Login successful, user:', currentUser);
            
            setUser(currentUser);
            setError(null);
            return currentUser;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
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
                    <p className="text-lg text-gray-600">Loading DineFit...</p>
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
