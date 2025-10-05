import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { advancedRecipeService } from '../services/advancedRecipeService';
import RecipeCard from '../components/RecipeCard';
import RecipeModal from '../components/RecipeModal';
import { Link } from 'react-router-dom';
// 1. Make sure these imports are at the top
import { databases } from '../appwriteClient';
import { ID } from 'appwrite';

// --- All filter functions remain the same ---
const filterByAllergies = (recipes, allergies) => {
  if (!allergies || allergies === 'None specified') return recipes;
  const allergyList = allergies.toLowerCase().split(',').map(a => a.trim());
  return recipes.filter(recipe => {
    const recipeName = recipe.name.toLowerCase();
    const recipeCategory = recipe.category?.toLowerCase() || '';
    return !allergyList.some(allergy =>
      recipeName.includes(allergy) ||
      recipeCategory.includes(allergy)
    );
  });
};
const filterByDislikedFoods = (recipes, dislikedFoods) => {
  if (!dislikedFoods || dislikedFoods === 'None specified') return recipes;
  const dislikedList = dislikedFoods.toLowerCase().split(',').map(d => d.trim());
  return recipes.filter(recipe => {
    const recipeName = recipe.name.toLowerCase();
    const recipeCategory = recipe.category?.toLowerCase() || '';
    return !dislikedList.some(disliked =>
      recipeName.includes(disliked) ||
      recipeCategory.includes(disliked)
    );
  });
};
const filterByDietaryPreferences = (recipes, dietaryPreferences) => {
  if (!dietaryPreferences || dietaryPreferences === 'None specified') return recipes;
  const preferences = dietaryPreferences.toLowerCase().split(',').map(p => p.trim());
  return recipes.filter(recipe => {
    const recipeName = recipe.name.toLowerCase();
    const recipeCategory = recipe.category?.toLowerCase() || '';
    const meatKeywords = [
      'chicken', 'beef', 'pork', 'lamb', 'turkey', 'duck', 'bacon', 'ham',
      'sausage', 'meat', 'fish', 'salmon', 'tuna', 'cod', 'prawn', 'shrimp',
      'lobster', 'crab', 'seafood', 'anchovies', 'sardines', 'mackerel'
    ];
    const dairyKeywords = ['cheese', 'milk', 'cream', 'butter', 'yogurt', 'dairy'];
    if (preferences.some(pref => pref.includes('vegetarian'))) {
      const hasMeat = meatKeywords.some(meat =>
        recipeName.includes(meat) || recipeCategory.includes(meat)
      );
      if (hasMeat) return false;
    }
    if (preferences.some(pref => pref.includes('vegan'))) {
      const hasAnimalProduct = [...meatKeywords, ...dairyKeywords].some(product =>
        recipeName.includes(product) || recipeCategory.includes(product)
      );
      if (hasAnimalProduct) return false;
    }
    if (preferences.some(pref => pref.includes('pescatarian'))) {
      const landMeatKeywords = [
        'chicken', 'beef', 'pork', 'lamb', 'turkey', 'duck', 'bacon', 'ham',
        'sausage', 'meat'
      ];
      const hasLandMeat = landMeatKeywords.some(meat =>
        recipeName.includes(meat) || recipeCategory.includes(meat)
      );
      if (hasLandMeat) return false;
    }
    return true;
  });
};
const filterByCuisinePreferences = (recipes, favoriteCuisines) => {
  if (!favoriteCuisines || favoriteCuisines === 'None specified') return recipes;
  const cuisines = favoriteCuisines.toLowerCase().split(',').map(c => c.trim());
  if (import.meta.env.DEV) {
    console.log('🍛 Filtering recipes by favorite cuisines:', cuisines);
  }

  const filtered = recipes.filter(recipe => {
    const recipeName = recipe.name.toLowerCase();
    const recipeCategory = recipe.category?.toLowerCase() || '';
    const recipeCuisines = recipe.cuisines?.map(c => c.toLowerCase()) || [];
    const recipeArea = recipe.area?.toLowerCase() || '';

    const matches = cuisines.some(cuisine => {
      return recipeName.includes(cuisine) ||
             recipeCategory.includes(cuisine) ||
             recipeArea.includes(cuisine) ||
             recipeCuisines.some(recipeCuisine => recipeCuisine.includes(cuisine));
    });

    if (matches && import.meta.env.DEV) {
      console.log(`✅ Recipe "${recipe.name}" matches cuisine preference`);
    }

    return matches;
  });

  if (import.meta.env.DEV) {
    console.log(`🎯 Filtered ${recipes.length} recipes down to ${filtered.length} based on cuisine preferences`);
  }
  return filtered;
};


const Recipes = () => {
  const { user, userProfile } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [showQuotaStatus, setShowQuotaStatus] = useState(false);

  useEffect(() => {
    loadInitialData();
    if (import.meta.env.DEV) {
      setTimeout(() => {
        const status = advancedRecipeService.getQuotaStatus();
        console.log('🔄 API System Status:', status);
      }, 2000);
    }
  }, [userProfile]);

  const loadInitialData = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Loading personalized recipes with profile:', userProfile);
      const recipesData = await advancedRecipeService.getPersonalizedRecipes(userProfile);
      setRecipes(recipesData);
      console.log('📊 API Quota & Cache Status:', advancedRecipeService.getQuotaStatus());
      if (recipesData.length === 0) {
        setError('No recipes found matching your preferences. Try adjusting your dietary restrictions.');
      }
    } catch (error) {
      console.error('Error loading recipes:', error);
      setError('Failed to load recipes. Please check your internet connection and try again.');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadInitialData();
      return;
    }
    setLoading(true);
    setError('');
    try {
      console.log('Searching for:', searchTerm, 'with profile:', userProfile);
      const searchResults = await advancedRecipeService.searchRecipes(searchTerm, userProfile);
      setRecipes(searchResults);
      if (searchResults.length === 0) {
        setError(`No recipes found for "${searchTerm}" matching your dietary preferences.`);
      }
    } catch (error) {
      console.error('Error searching recipes:', error);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setShowModal(true);
  };

  const handleSaveRecipe = async (recipe) => {
    console.log('Saving recipe:', recipe.name);
  };

  const getRandomRecipes = async () => {
    setLoading(true);
    try {
      const randomRecipes = await advancedRecipeService.getRandomRecipes(12);
      setRecipes(randomRecipes);
      setSearchTerm('');
    } catch (error) {
      console.error('Error loading random recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. THIS IS THE COMPLETE AND CORRECT FUNCTION TO SAVE THE RATING ---
  const handleRating = async (ratingValue) => {
    if (!user) {
        alert('You must be logged in to rate a recipe.');
        return;
    }
    if (!selectedRecipe) return;

    const ratingData = {
        userId: user.$id,
        recipeId: selectedRecipe.id.toString(),
        ratingValue: ratingValue,
        ratedAt: new Date().toISOString(),
    };

    try {
        await databases.createDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_RATINGS_COLLECTION_ID,
            ID.unique(),
            ratingData
        );
        alert('Thank you! Your rating has been saved.');
    } catch (error) {
        console.error('Error saving rating:', error);
        alert('Error: Could not save your rating. Please check the console for details.');
    } finally {
        setShowModal(false);
    }
  };


  return (
    <div className="min-h-[calc(100vh-4rem)] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100"></div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-r from-emerald-200/20 to-teal-300/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-gradient-to-r from-cyan-200/15 to-blue-300/15 rounded-full blur-3xl animate-float-delayed"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center mb-8 backdrop-blur-sm bg-white/30 rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/dashboard"
              className="p-2 text-gray-600 hover:text-emerald-600 transition-colors duration-200 backdrop-blur-sm bg-white/50 rounded-xl hover:bg-white/70"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Recipe Discovery
            </h1>
            <div className="w-9"></div>
          </div>
          <p className="text-gray-600">Find your perfect meal based on your preferences</p>
        </div>
        <div className="backdrop-blur-sm bg-white/40 rounded-3xl p-6 shadow-xl border border-white/30 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by ingredient (e.g., chicken, tomato, rice)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 whitespace-nowrap"
            >
              🔍 Search
            </button>
            <button
              onClick={getRandomRecipes}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 whitespace-nowrap"
            >
              🎲 Random
            </button>
          </div>
        </div>
        {userProfile && (
          <div className="backdrop-blur-sm bg-gradient-to-r from-emerald-100/50 to-teal-100/50 rounded-2xl p-4 mb-8 border border-emerald-200/30">
            <h3 className="font-semibold text-emerald-800 mb-2">🎯 Personalized for You</h3>
            <div className="flex flex-wrap gap-4 text-sm text-emerald-700">
              {userProfile.dietaryPreferences && userProfile.dietaryPreferences !== 'None specified' && (
                <span>Diet: {userProfile.dietaryPreferences}</span>
              )}
              {userProfile.favoriteCuisines && userProfile.favoriteCuisines !== 'Not set' && (
                <span>Cuisines: {userProfile.favoriteCuisines}</span>
              )}
              {userProfile.cookingTime && userProfile.cookingTime !== 'Not set' && (
                <span>Time: {
                  userProfile.cookingTime === 'quick' ? 'Quick & Easy (≤15 min)' :
                  userProfile.cookingTime === 'moderate' ? 'Moderate (15-45 min)' :
                  userProfile.cookingTime === 'elaborate' ? 'Take Your Time (45+ min)' :
                  userProfile.cookingTime === 'no_cooking' ? 'Minimal/No Cooking' :
                  userProfile.cookingTime
                }</span>
              )}
              {userProfile.allergies && userProfile.allergies !== 'None specified' && (
                <span>Avoiding: {userProfile.allergies}</span>
              )}
            </div>
          </div>
        )}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Discovering delicious recipes...</p>
            </div>
          </div>
        )}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={handleRecipeClick}
                onSave={handleSaveRecipe}
              />
            ))}
          </div>
        )}
        {!loading && recipes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
            <p className="text-gray-600 mb-6">Try searching with different ingredients or browse all categories</p>
            <button
              onClick={getRandomRecipes}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200"
            >
              Discover Random Recipes
            </button>
          </div>
        )}
      </div>
      <RecipeModal
        recipe={selectedRecipe}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveRecipe}
        onRate={handleRating}
      />
    </div>
  );
};

export default Recipes;

