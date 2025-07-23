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

    useEffect(() => {
        checkUserSession();
    }, []);

    const checkUserSession = async () => {
        try {
            const currentUser = await account.get();
            setUser(currentUser);
        } catch (error) {
            // User is not logged in
            setUser(null);
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
            // Create the user account
            await account.create('unique()', email, password, name);
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
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
