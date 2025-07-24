import React, { useState, useEffect } from 'react';
import { databases } from '../appwriteClient';

const DatabaseStatus = () => {
    const [status, setStatus] = useState({
        database: 'checking',
        collection: 'checking'
    });

    useEffect(() => {
        checkDatabaseStatus();
    }, []);

    const checkDatabaseStatus = async () => {
        try {
            // Check database
            try {
                await databases.get(import.meta.env.VITE_APPWRITE_DATABASE_ID || 'dinefit-db');
                setStatus(prev => ({ ...prev, database: 'connected' }));
                
                // Check collection
                try {
                    await databases.getCollection(
                        import.meta.env.VITE_APPWRITE_DATABASE_ID || 'dinefit-db',
                        import.meta.env.VITE_APPWRITE_PROFILE_COLLECTION_ID || 'profiles'
                    );
                    setStatus(prev => ({ ...prev, collection: 'connected' }));
                } catch (collectionError) {
                    console.error('Collection check failed:', collectionError);
                    setStatus(prev => ({ ...prev, collection: 'missing' }));
                }
            } catch (dbError) {
                console.error('Database check failed:', dbError);
                setStatus(prev => ({ ...prev, database: 'missing', collection: 'missing' }));
            }
        } catch (error) {
            console.error('Status check failed:', error);
            setStatus({ database: 'error', collection: 'error' });
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'checking': return '⏳';
            case 'connected': return '✅';
            case 'missing': return '❌';
            case 'error': return '⚠️';
            default: return '❓';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'checking': return 'text-yellow-600';
            case 'connected': return 'text-green-600';
            case 'missing': return 'text-red-600';
            case 'error': return 'text-orange-600';
            default: return 'text-gray-600';
        }
    };

    const getStatusText = (type, status) => {
        switch (status) {
            case 'checking': return 'Checking...';
            case 'connected': return `${type} connected`;
            case 'missing': return `${type} not found`;
            case 'error': return `${type} error`;
            default: return 'Unknown status';
        }
    };

    const hasIssues = status.database !== 'connected' || status.collection !== 'connected';

    if (!hasIssues && status.database === 'connected' && status.collection === 'connected') {
        return null; // Don't show if everything is working
    }

    return (
        <div className="mb-6 backdrop-blur-sm bg-orange-100/50 rounded-2xl p-4 border border-orange-200/50">
            <div className="flex items-start gap-3">
                <div className="text-orange-500 text-xl">⚠️</div>
                <div className="flex-1">
                    <h3 className="font-semibold text-orange-800 mb-2">Database Setup Required</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                            <span className={getStatusColor(status.database)}>{getStatusIcon(status.database)}</span>
                            <span className="text-gray-700">{getStatusText('Database', status.database)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={getStatusColor(status.collection)}>{getStatusIcon(status.collection)}</span>
                            <span className="text-gray-700">{getStatusText('Collection', status.collection)}</span>
                        </div>
                    </div>
                    {hasIssues && (
                        <div className="mt-3 text-sm text-orange-700">
                            <p>To save profile data, please set up the Appwrite database and collection.</p>
                            <p className="mt-1">
                                <strong>Instructions:</strong> Check the APPWRITE_SETUP_GUIDE.md file in your project root.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DatabaseStatus;
