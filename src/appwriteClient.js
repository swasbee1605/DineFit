import { Client, Account, Databases } from 'appwrite';

const client = new Client();

// --- THIS IS THE CORRECTED SECTION ---
// We have removed the wrong, hardcoded fallback values.
// This forces the app to use your .env file correctly.
const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;

if (!endpoint || !projectId) {
  throw new Error("Please make sure VITE_APPWRITE_ENDPOINT and VITE_APPWRITE_PROJECT_ID are set in your .env file.");
}

client
  .setEndpoint(endpoint)
  .setProject(projectId);
// --- END OF CORRECTION ---

const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases };

