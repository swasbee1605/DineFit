# Appwrite Database Schema - DineFit

## Database Information
- **Database ID**: `dinefit-db`
- **Endpoint**: `https://cloud.appwrite.io/v1`

---

## Collections Overview

1. [Profiles](#profiles-collection) - User profile information
2. [Meal Logs](#meal-logs-collection) - User's logged meals
3. [User Favourites](#user-favourites-collection) - User's favorite recipes

---

## Profiles Collection

**Collection ID**: `profiles`  
**Collection Name**: User Profiles

### Attributes

| Attribute Name | Type | Size/Range | Required | Default | Description |
|----------------|------|------------|----------|---------|-------------|
| `userId` | String | 255 | ✅ Yes | - | Unique identifier linking to auth user |
| `age` | Integer | - | ❌ No | - | User's age |
| `gender` | String | 50 | ❌ No | - | User's gender |
| `allergies` | String | 1000 | ❌ No | - | List of user allergies |
| `dietaryPreferences` | String | 500 | ❌ No | - | Dietary preferences (vegan, keto, etc.) |
| `dislikedFoods` | String | 1000 | ❌ No | - | Foods the user dislikes |
| `favoriteCuisines` | String | 500 | ❌ No | - | User's favorite cuisine types |
| `mealsPerDay` | String | 10 | ❌ No | - | Number of meals per day |
| `cookingTime` | String | 50 | ❌ No | - | Available cooking time |
| `createdAt` | String | 50 | ❌ No | - | Profile creation timestamp |
| `updatedAt` | String | 50 | ❌ No | - | Profile last update timestamp |

### System Attributes
- `$id` - Document ID (auto-generated)
- `$createdAt` - Creation timestamp (auto-generated)
- `$updatedAt` - Last update timestamp (auto-generated)

### Permissions
Set appropriate permissions based on your security requirements:
- **Read**: Users (own documents)
- **Create**: Users
- **Update**: Users (own documents)
- **Delete**: Users (own documents)

---

## Meal Logs Collection

**Collection ID**: `meal_logs`  
**Collection Name**: Meal Logs

### Attributes

| Attribute Name | Type | Size/Range | Required | Default | Description |
|----------------|------|------------|----------|---------|-------------|
| `userId` | String | 255 | ✅ Yes | - | User who logged the meal |
| `recipeId` | String | 255 | ✅ Yes | - | Unique recipe identifier |
| `name` | String | 255 | ✅ Yes | - | Name of the meal/recipe |
| `image` | String | 500 | ❌ No | - | URL to meal image |
| `category` | String | 255 | ❌ No | - | Meal category (breakfast, lunch, etc.) |
| `type` | String | 255 | ✅ Yes | - | Type of meal |
| `ingredients` | String | 1000 | ❌ No | - | List of ingredients |
| `servings` | Integer | Min: 1, Max: 50 | ❌ No | 1 | Number of servings |
| `cookingTime` | String | 255 | ❌ No | - | Time required to cook |
| `source` | String | 255 | ❌ No | - | Source/origin of recipe |
| `timestamp` | DateTime | - | ✅ Yes | - | When the meal was logged |

### System Attributes
- `$id` - Document ID (auto-generated)
- `$createdAt` - Creation timestamp (auto-generated)
- `$updatedAt` - Last update timestamp (auto-generated)

### Permissions
- **Read**: Users (own documents)
- **Create**: Users
- **Update**: Users (own documents)
- **Delete**: Users (own documents)

---

## User Favourites Collection

**Collection ID**: `user_favourites`  
**Collection Name**: User Favourites

### Attributes

| Attribute Name | Type | Size/Range | Required | Default | Description |
|----------------|------|------------|----------|---------|-------------|
| `userId` | String | 255 | ✅ Yes | - | User who favorited the recipe |
| `recipeId` | String | 255 | ✅ Yes | - | Unique recipe identifier |
| `name` | String | 255 | ✅ Yes | - | Recipe name |
| `image` | String | 500 | ❌ No | - | URL to recipe image |
| `category` | String | 255 | ❌ No | - | Recipe category |
| `cookingTime` | String | 255 | ❌ No | - | Time required to cook |
| `difficulty` | String | 255 | ❌ No | - | Recipe difficulty level |
| `source` | String | 255 | ❌ No | - | Source/origin of recipe |
| `recipeData` | String | 20000 | ❌ No | - | Full recipe data (JSON string) |
| `addedAt` | DateTime | - | ✅ Yes | - | When the recipe was favorited |

### System Attributes
- `$id` - Document ID (auto-generated)
- `$createdAt` - Creation timestamp (auto-generated)
- `$updatedAt` - Last update timestamp (auto-generated)

### Permissions
- **Read**: Users (own documents)
- **Create**: Users
- **Update**: Users (own documents)
- **Delete**: Users (own documents)

---

## Setup Instructions for Contributors

### Method 1: Manual Setup (Detailed)

1. **Create a new Appwrite project** at [cloud.appwrite.io](https://cloud.appwrite.io)

2. **Create the database**:
   - Go to Databases → Create Database
   - Database ID: `dinefit-db`

3. **Create each collection** following the tables above:
   - Click "Add Collection"
   - Set the Collection ID exactly as specified
   - Add all attributes with the correct types and constraints
   - Configure permissions as specified

4. **Update your `.env` file** with your credentials

### Method 2: Using Appwrite CLI (Recommended)

```bash
# Install Appwrite CLI
npm install -g appwrite-cli

# Login to your Appwrite account
appwrite login

# Deploy the schema (if appwrite.json is provided)
appwrite deploy collection
```

---

## Notes

- All string fields should use UTF-8 encoding
- DateTime fields are stored in ISO 8601 format
- Arrays/lists in string fields should be stored as comma-separated values or JSON strings
- Ensure proper indexing on `userId` fields for query performance
- Consider adding indexes on frequently queried fields like `recipeId` and `timestamp`

---

## Environment Variables

After setting up your database, update your `.env` file:

```env
VITE_APPWRITE_PROJECT_ID=your_project_id_here
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_DATABASE_ID=dinefit-db
VITE_APPWRITE_PROFILE_COLLECTION_ID=profiles
```
