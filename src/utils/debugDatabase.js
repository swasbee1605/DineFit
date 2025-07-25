import { databases, client } from '../appwriteClient';
const DATABASE_ID = 'dinefit-db';
const COLLECTION_ID = 'profiles';
export const debugDatabaseSetup = async () => {
    console.log('🔍 DEBUGGING DATABASE SETUP...');
    console.log('Database ID:', DATABASE_ID);
    console.log('Collection ID:', COLLECTION_ID);
    console.log('Client config:', {
        endpoint: client.config?.endpoint,
        project: client.config?.project,
        hasProject: !!client.config?.project
    });
    if (!client.config?.project) {
        return {
            success: false,
            message: 'Appwrite client not properly configured. Missing project ID.',
            error: 'No project ID found in client configuration'
        };
    }
    try {
        console.log('\n1️⃣ Testing database connection...');
        try {
            const testResult = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [], 0);
            console.log('✅ Collection found and accessible!');
            return {
                success: true,
                message: 'Collection appears to be working, but cannot verify attributes in browser SDK',
                note: 'Please verify attributes manually in Appwrite console'
            };
        } catch (docError) {
            console.log('Document access error:', docError.message, 'Code:', docError.code);
            if (docError.code === 404) {
                if (docError.message.includes('Database')) {
                    console.log('\n❌ Database not found!');
                    return {
                        success: false,
                        message: `Database '${DATABASE_ID}' not found. Please create it in Appwrite console.`,
                        error: docError.message
                    };
                } else if (docError.message.includes('Collection')) {
                    console.log('\n❌ Collection not found!');
                    return {
                        success: false,
                        message: `Collection '${COLLECTION_ID}' not found. Please create it in database '${DATABASE_ID}'.`,
                        error: docError.message,
                        needsCollection: true
                    };
                }
            }
            console.log('\n⚠️ Collection may exist but has access issues');
            return {
                success: false,
                message: `Collection access error: ${docError.message}`,
                error: docError.message,
                code: docError.code
            };
        }
    } catch (error) {
        console.error('\n💥 Database test failed:', error);
        if (error.message.includes('not found') || error.code === 404) {
            if (error.message.includes('Database')) {
                return {
                    success: false,
                    message: `Database '${DATABASE_ID}' not found. Please create it in Appwrite console.`,
                    error: error.message
                };
            } else {
                return {
                    success: false,
                    message: `Collection '${COLLECTION_ID}' not found. Please create it in database '${DATABASE_ID}'.`,
                    error: error.message
                };
            }
        }
        return {
            success: false,
            message: 'Database connection failed',
            error: error.message
        };
    }
};
