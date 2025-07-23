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
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            await account.createEmailPasswordSession(email, password);
            const currentUser = await account.get();
            setUser(currentUser);
            return currentUser;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await account.deleteSession('current');
            setUser(null);
        } catch (error) {
            throw error;
        }
    };

    const signup = async (email, password, name = '') => {
        try {
            // Ensure name is a valid string and at least 1 character
            const validName = name && name.trim() ? name.trim() : 'User';
            
            // Create the user account
            await account.create('unique()', email, password, validName);
            // Automatically log them in after signup
            await login(email, password);
        } catch (error) {
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
