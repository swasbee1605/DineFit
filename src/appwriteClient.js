import { Client, Account, Databases } from 'appwrite';

const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1') 
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '6880984b003cc7ae9f2f');

const account = new Account(client);
const databases = new Databases(client);

// Debug: Log to ensure client is configured properly
console.log('Appwrite client configured:', {
  endpoint: client.config.endpoint,
  project: client.config.project
});

// Debug: Log available account methods
console.log('Available account methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(account)));

export { client, account, databases };
