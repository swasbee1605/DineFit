// Quick database connection test
import { Client, Databases } from 'appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('6880984b003cc7ae9f2f');

const databases = new Databases(client);

async function testDatabaseConnection() {
    try {
        console.log('🔍 Testing database connection...');
        
        // Test database exists
        const database = await databases.get('dinefit-db');
        console.log('✅ Database found:', database.name);
        
        // Test collection exists
        const collection = await databases.getCollection('dinefit-db', 'profiles');
        console.log('✅ Collection found:', collection.name);
        
        console.log('🎉 All good! Your database is properly configured.');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        
        if (error.message.includes('database_not_found')) {
            console.log('💡 Solution: Create database with ID "dinefit-db" in Appwrite console');
        } else if (error.message.includes('collection_not_found')) {
            console.log('💡 Solution: Create collection with ID "profiles" in your database');
        }
    }
}

// Run the test
testDatabaseConnection();
