import React, { useState, useEffect } from 'react';
import { debugDatabaseSetup } from '../utils/debugDatabase';
const DatabaseStatus = () => {
    const [status, setStatus] = useState({
        database: 'checking',
        collection: 'checking'
    });
    const [testResult, setTestResult] = useState(null);
    const [detailedInfo, setDetailedInfo] = useState(null);
    useEffect(() => {
        checkDatabaseStatus();
    }, []);
    const checkDatabaseStatus = async () => {
        try {
            console.log('🔄 Running database status check...');
            const result = await debugDatabaseSetup();
            setTestResult(result);
            if (result.success) {
                setStatus({ database: 'connected', collection: 'connected' });
                setDetailedInfo({
                    totalAttributes: result.collection?.attributes?.length || 0,
                    attributes: result.collection?.attributes || []
                });
            } else {
                if (result.message.includes('Database')) {
                    setStatus({ database: 'missing', collection: 'missing' });
                } else if (result.message.includes('Collection')) {
                    setStatus({ database: 'connected', collection: 'missing' });
                } else if (result.needsAttributes || result.missingAttributes) {
                    setStatus({ database: 'connected', collection: 'error' });
                    setDetailedInfo({
                        missingAttributes: result.missingAttributes || [],
                        existingAttributes: result.existingAttributes || []
                    });
                } else {
                    setStatus({ database: 'error', collection: 'error' });
                }
            }
        } catch (error) {
            console.error('Status check failed:', error);
            setStatus({ database: 'error', collection: 'error' });
            setTestResult({ 
                success: false, 
                message: 'Failed to test database connection',
                error: error.message 
            });
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
    const hasIssues = status.database !== 'connected' || status.collection !== 'connected';
    if (!hasIssues && status.database === 'connected' && status.collection === 'connected') {
        return null; // Don't show if everything is working
    }
    return (
        <div className="backdrop-blur-sm bg-white/40 rounded-2xl p-4 sm:p-6 shadow-lg border border-white/30 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Database Status</h3>
                <button
                    onClick={checkDatabaseStatus}
                    className="px-3 py-1 text-sm bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
                >
                    Refresh
                </button>
            </div>
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Database Connection</span>
                    <div className="flex items-center gap-2">
                        <span>{getStatusIcon(status.database)}</span>
                        <span className="text-sm font-medium">
                            {status.database === 'checking' ? 'Checking...' : 
                             status.database === 'connected' ? 'Connected' :
                             status.database === 'missing' ? 'Database not found' : 'Error'}
                        </span>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Profiles Collection</span>
                    <div className="flex items-center gap-2">
                        <span>{getStatusIcon(status.collection)}</span>
                        <span className="text-sm font-medium">
                            {status.collection === 'checking' ? 'Checking...' : 
                             status.collection === 'connected' ? 'Ready' :
                             status.collection === 'missing' ? 'Collection not found' : 'Error'}
                        </span>
                    </div>
                </div>
            </div>
            {testResult && !testResult.success && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-2">
                        <span className="text-amber-600">⚠️</span>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-amber-800">Setup Issue Detected</p>
                            <p className="text-xs text-amber-700 mt-1">
                                {testResult?.message || 'Database configuration incomplete'}
                            </p>
                            {detailedInfo?.missingAttributes && (
                                <div className="mt-2">
                                    <p className="text-xs text-amber-700 font-medium">Missing attributes:</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {detailedInfo.missingAttributes.map(attr => (
                                            <code key={attr} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                                                {attr}
                                            </code>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {detailedInfo?.existingAttributes && detailedInfo.existingAttributes.length > 0 && (
                                <div className="mt-2">
                                    <p className="text-xs text-green-700 font-medium">Existing attributes:</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {detailedInfo.existingAttributes.map(attr => (
                                            <code key={attr} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                                {attr}
                                            </code>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {testResult?.availableCollections && (
                                <div className="mt-2">
                                    <p className="text-xs text-amber-700">Available collections:</p>
                                    <code className="text-xs bg-amber-100 px-2 py-1 rounded">
                                        {testResult.availableCollections.join(', ') || 'None'}
                                    </code>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {testResult?.success && detailedInfo && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-2">
                        <span className="text-green-600">✅</span>
                        <div>
                            <p className="text-sm font-medium text-green-800">Database Setup Complete!</p>
                            <p className="text-xs text-green-700 mt-1">
                                Collection has {detailedInfo.totalAttributes} attributes configured
                            </p>
                        </div>
                    </div>
                </div>
            )}
            {(status.database === 'missing' || status.collection === 'missing') && (
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600 mb-2">To save profile data, please set up the Appwrite database and collection.</p>
                    <p className="text-xs text-gray-500">
                        <strong>Instructions:</strong> Check the APPWRITE_SETUP_GUIDE.md file in your project root.
                    </p>
                </div>
            )}
        </div>
    );
};
export default DatabaseStatus;
