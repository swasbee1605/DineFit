# Appwrite Database Setup Guide

This guide will help you set up the required database and collection in Appwrite for storing user profile data.

## Prerequisites

- An Appwrite account and project set up
- Access to the Appwrite console
- Project ID: `6880984b003cc7ae9f2f` (as configured in your .env file)

## Step 1: Create Database

1. Log into your Appwrite console: https://cloud.appwrite.io/console
2. Navigate to your project (ID: `6880984b003cc7ae9f2f`)
3. Go to **Databases** in the left sidebar
4. Click **"Create Database"**
5. Enter Database ID: `dinefit-db`
6. Enter Database Name: `DineFit Database`
7. Click **"Create"**

## Step 2: Create Collection

1. Inside the `dinefit-db` database, click **"Create Collection"**
2. Enter Collection ID: `profiles`
3. Enter Collection Name: `User Profiles`
4. Click **"Create"**

## Step 3: Configure Collection Attributes

Add the following attributes to the `profiles` collection:

### Basic Information
```
Attribute Key: userId
Type: String
Size: 255
Required: Yes
Array: No
```

```
Attribute Key: age
Type: Integer
Required: No
Array: No
```

```
Attribute Key: gender
Type: String
Size: 50
Required: No
Array: No
```

### Food Preferences & Restrictions
```
Attribute Key: allergies
Type: String
Size: 1000
Required: No
Array: No
```

```
Attribute Key: dietaryPreferences
Type: String
Size: 500
Required: No
Array: No
```

```
Attribute Key: dislikedFoods
Type: String
Size: 1000
Required: No
Array: No
```

```
Attribute Key: favoriteCuisines
Type: String
Size: 500
Required: No
Array: No
```

### Meal Preferences
```
Attribute Key: mealsPerDay
Type: String
Size: 10
Required: No
Array: No
Default: "3"
```

```
Attribute Key: cookingTime
Type: String
Size: 50
Required: No
Array: No
```

### Timestamps
```
Attribute Key: createdAt
Type: String
Size: 50
Required: No
Array: No
```

```
Attribute Key: updatedAt
Type: String
Size: 50
Required: No
Array: No
```
Array: No
Default: "3"
```

```
Attribute Key: cookingTime
Type: String
Size: 50
Required: No
Array: No
```

```
Attribute Key: budgetRange
Type: String
Size: 50
Required: No
Array: No
```

```
Attribute Key: healthNotes
Type: String
Size: 2000
Required: No
Array: No
```

### Timestamps
```
Attribute Key: createdAt
Type: String
Size: 50
Required: No
Array: No
```

```
Attribute Key: updatedAt
Type: String
Size: 50
Required: No
Array: No
```

## Step 4: Configure Permissions

Set the following permissions for the `profiles` collection:

### Read Permissions
- Add permission for authenticated users to read their own documents
- Permission: `user:[USER_ID]` (this will be set automatically for each user)

### Write Permissions  
- Add permission for authenticated users to create and update their own documents
- Permission: `user:[USER_ID]` (this will be set automatically for each user)

### Update Permissions
- Add permission for authenticated users to update their own documents
- Permission: `user:[USER_ID]` (this will be set automatically for each user)

### Delete Permissions
- Add permission for authenticated users to delete their own documents
- Permission: `user:[USER_ID]` (this will be set automatically for each user)

## Step 5: Configure Indexes (Optional but Recommended)

Create the following indexes for better query performance:

1. **Index Name:** `userId_index`
   - **Attributes:** `userId`
   - **Order:** ASC

2. **Index Name:** `updated_index`
   - **Attributes:** `updatedAt`
   - **Order:** DESC

## Step 6: Test the Setup

After completing the setup:

1. Start your development server: `npm run dev`
2. Sign up for a new account or log in
3. Try to complete the profile setup
4. Check the Appwrite console to see if the profile data is being stored

## Troubleshooting

### Common Issues:

**"Database not found" error:**
- Verify the database ID matches exactly: `dinefit-db`
- Check that the database was created successfully

**"Collection not found" error:**
- Verify the collection ID matches exactly: `profiles`
- Check that the collection was created in the correct database

**Permission denied errors:**
- Verify that permissions are set correctly for authenticated users
- Make sure the user is properly authenticated before attempting to save profile data

**Attribute errors:**
- Verify all attributes are created with correct types and sizes
- Check that array attributes are marked as Array: Yes

## Environment Variables

Ensure these environment variables are set in your `.env` file:

```
VITE_APPWRITE_PROJECT_ID=6880984b003cc7ae9f2f
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_DATABASE_ID=dinefit-db
VITE_APPWRITE_PROFILE_COLLECTION_ID=profiles
```

## Alternative: Auto-Setup Script

If you prefer to set up the database programmatically, you can create a setup script using the Appwrite SDK. However, manual setup through the console is recommended for better control and understanding of the structure.

## Verification

Once setup is complete, you should be able to:

1. ✅ Create user profiles through the ProfileSetup component
2. ✅ View profile data in the Settings page
3. ✅ Update profile information
4. ✅ See profile data persist between sessions
5. ✅ View the stored data in the Appwrite console

The profile data will be automatically associated with the authenticated user's ID, ensuring data privacy and security.
