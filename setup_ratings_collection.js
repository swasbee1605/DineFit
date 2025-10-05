import 'dotenv/config'; // <-- ADD THIS LINE AT THE TOP
import { Client, Databases } from 'node-appwrite';

// Initialize the Appwrite Client
const client = new Client();
client
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT) // Reads from your .env file
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY); // Use a server-side API key

const databases = new Databases(client);

// IDs from your project documentation
const DATABASE_ID = 'dinefit-db';
const COLLECTION_ID = 'ratings';

async function setupRatingsCollection() {
    try {
        console.log(`Creating collection '${COLLECTION_ID}' in database '${DATABASE_ID}'...`);
        
        // 1. Create Collection
        await databases.createCollection(DATABASE_ID, COLLECTION_ID, 'User Ratings');
        console.log("Collection created successfully.");

        // 2. Create Attributes based on our schema
        await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'userId', 255, true);
        await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'recipeId', 255, true);
        await databases.createIntegerAttribute(DATABASE_ID, COLLECTION_ID, 'ratingValue', true, 1, 5);
        await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'reviewText', 2000, false);
        await databases.createDatetimeAttribute(DATABASE_ID, COLLECTION_ID, 'ratedAt', true);
        
        console.log("\nAll attributes created successfully for 'ratings' collection! 🎉");
        console.log("Next, add its ID to your .env file: VITE_APPWRITE_RATINGS_COLLECTION_ID=ratings");

    } catch (error) {
        console.error("Error setting up 'ratings' collection:", error.message);
        console.log("It's possible the collection already exists. Please check your Appwrite console.");
    }
}

setupRatingsCollection();