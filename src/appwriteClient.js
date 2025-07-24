import { Client, Account, Databases } from 'appwrite';

const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1') 
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '6880984b003cc7ae9f2f');

// Initialize account and databases
const account = new Account(client);
const databases = new Databases(client);

// Log client configuration for debugging
console.log('Appwrite client initialized:', {
  endpoint: client.config.endpoint,
  project: client.config.project
});

export { client, account, databases };
