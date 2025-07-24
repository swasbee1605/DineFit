import { Client, Account, Databases } from 'appwrite';

const client = new Client();

try {
  client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1') 
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '6880984b003cc7ae9f2f');

  // Log client configuration for debugging
  console.log('Appwrite client initialized:', {
    endpoint: client.config.endpoint,
    project: client.config.project
  });

  // Test connection with better error handling
  const testConnection = async () => {
    try {
      console.log('Testing Appwrite connection...');
      const account = new Account(client);
      
      // Create a promise with timeout for the connection test
      const connectionTest = account.get();
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection test timeout')), 5000)
      );
      
      await Promise.race([connectionTest, timeout]);
      console.log('Appwrite connection test successful');
    } catch (error) {
      if (error.message.includes('unauthorized') || error.code === 401) {
        console.log('Appwrite connection successful (not authenticated)');
      } else if (error.message.includes('timeout')) {
        console.warn('Appwrite connection is slow - this may affect login performance');
      } else {
        console.warn('Appwrite connection issue:', error.message);
        console.warn('Login may be affected. Please check your internet connection.');
      }
    }
  };

  // Test connection after initialization
  testConnection();

} catch (error) {
  console.error('Failed to initialize Appwrite client:', error);
}

// Initialize account and databases
const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases };
