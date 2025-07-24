# DineFit User Profile Data Structure

This document outlines the data structure collected by the DineFit application for user profiles. This data is intended to be used by the backend for personalized nutrition recommendations and meal planning.

## Database Schema

### Collection: `profiles`
**Database ID**: `dinefit-db`
**Collection ID**: `profiles`

## Profile Data Structure

```json
{
  "userId": "string", // Appwrite user ID (unique identifier)
  "createdAt": "ISO_DATE_STRING",
  "updatedAt": "ISO_DATE_STRING",
  
  // Basic Information
  "age": "number", // User's age in years
  "gender": "string", // "male", "female", or "other"
  "height": "number", // Height value (numeric)
  "heightUnit": "string", // "cm" or "ft"
  "currentWeight": "number", // Current weight (numeric)
  "targetWeight": "number", // Desired weight (numeric)
  "weightUnit": "string", // "kg" or "lbs"
  
  // Activity & Goals
  "activityLevel": "string", // "sedentary", "light", "moderate", "very", "extra"
  "primaryGoal": "string", // "lose_weight", "gain_weight", "maintain_weight", "build_muscle", "improve_health", "increase_energy"
  "targetDate": "ISO_DATE_STRING", // Optional target date for achieving goal
  
  // Health Information
  "allergies": ["string"], // Array of allergy strings
  "medicalConditions": ["string"], // Array of medical condition strings
  "dietaryPreferences": ["string"], // Array of dietary preference strings
  
  // Meal Preferences
  "mealsPerDay": "string", // "2", "3", "4", "5", "6"
  "cookingTime": "string", // "quick", "moderate", "elaborate", "no_cooking"
  "budgetRange": "string", // "low", "moderate", "high"
  "dislikedFoods": ["string"] // Array of disliked food strings
}
```

## Data Field Details

### Basic Information
- **age**: User's age in years (13-120)
- **gender**: User's gender identity
- **height**: Numeric height value
- **heightUnit**: Unit of measurement for height
- **currentWeight**: Current body weight
- **targetWeight**: Desired target weight
- **weightUnit**: Unit of measurement for weight

### Activity & Goals
- **activityLevel**: Physical activity level affects caloric needs
  - `sedentary`: Little to no exercise
  - `light`: Light exercise 1-3 days/week
  - `moderate`: Moderate exercise 3-5 days/week
  - `very`: Hard exercise 6-7 days/week
  - `extra`: Very hard exercise, physical job

- **primaryGoal**: Main fitness/health objective
  - `lose_weight`: Weight loss focus
  - `gain_weight`: Weight gain focus
  - `maintain_weight`: Weight maintenance
  - `build_muscle`: Muscle building focus
  - `improve_health`: General health improvement
  - `increase_energy`: Energy level improvement

### Health Information
- **allergies**: Array of food allergies and intolerances
  - Common values: "Nuts", "Peanuts", "Dairy", "Eggs", "Fish", "Shellfish", "Soy", "Wheat/Gluten", "Sesame", "Corn"
  
- **medicalConditions**: Array of relevant medical conditions
  - Common values: "Diabetes", "High Blood Pressure", "Heart Disease", "High Cholesterol", "Thyroid Issues", "PCOS", "Celiac Disease", "IBS"
  
- **dietaryPreferences**: Array of dietary lifestyle choices
  - Common values: "Vegetarian", "Vegan", "Pescatarian", "Keto", "Paleo", "Mediterranean", "Low Carb", "High Protein"

### Meal Preferences
- **mealsPerDay**: Number of meals preferred per day
- **cookingTime**: Time preference for meal preparation
  - `quick`: 15 minutes or less
  - `moderate`: 15-30 minutes
  - `elaborate`: 30+ minutes
  - `no_cooking`: Prefers no cooking
  
- **budgetRange**: Budget preference for groceries/meals
  - `low`: Budget-friendly options
  - `moderate`: Moderate pricing
  - `high`: Premium options
  
- **dislikedFoods**: Array of foods the user dislikes

## Usage for Backend

This profile data should be used to:

1. **Calculate Caloric Needs**: Use age, gender, height, weight, activity level, and goals
2. **Filter Recipes**: Exclude recipes containing allergens or disliked foods
3. **Recommend Meals**: Match dietary preferences and restrictions
4. **Plan Portions**: Adjust serving sizes based on goals and caloric needs
5. **Schedule Meals**: Distribute calories across preferred number of meals
6. **Time Management**: Suggest recipes matching cooking time preferences
7. **Budget Optimization**: Recommend ingredients within budget range
8. **Progress Tracking**: Monitor progress toward target weight and goals

## API Endpoints Needed

The backend should implement these endpoints:

```
GET /api/profile/{userId} - Get user profile
PUT /api/profile/{userId} - Update user profile
POST /api/recommendations/{userId} - Get personalized meal recommendations
POST /api/meal-plan/{userId} - Generate meal plan based on profile
```

## Data Validation

- All numeric fields should be validated for reasonable ranges
- Required fields: age, gender, height, currentWeight, activityLevel, primaryGoal
- Optional fields can be empty arrays or null
- Ensure allergies are properly formatted for recipe filtering
- Validate target dates are in the future

## Privacy and Security

- Profile data contains sensitive health information
- Implement proper access controls
- Consider data encryption for sensitive fields
- Allow users to delete their profile data
- Comply with relevant health data privacy regulations

## Future Enhancements

Consider adding these fields in future iterations:

- `waterIntake`: Daily water consumption goals
- `sleepHours`: Sleep duration for metabolism calculations
- `stressLevel`: Stress level for cortisol considerations
- `supplementsUsed`: Current supplement regimen
- `fitnessGoals`: Specific fitness milestones
- `mealTimings`: Preferred meal times
- `snackPreferences`: Snacking habits and preferences
