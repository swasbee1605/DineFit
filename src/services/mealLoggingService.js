class MealLoggingService {
  constructor() {
    this.storageKey = 'dinefit_meal_logs';
    this.favoritesKey = 'dinefit_favorites';
    this.maxRecentMeals = 10;
  }
  getCurrentTimestamp() {
    return new Date().toISOString();
  }
  formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
  formatDate(timestamp) {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  }
  logMeal(recipe, mealType = 'Unknown') {
    try {
      const mealLog = {
        id: Date.now() + Math.random(),
        recipeId: recipe.id,
        name: recipe.name || recipe.title,
        image: recipe.image,
        category: recipe.category,
        timestamp: this.getCurrentTimestamp(),
        type: mealType,
        ingredients: this.extractIngredientsText(recipe),
        servings: recipe.servings || 1,
        cookingTime: recipe.cookingTime || recipe.readyInMinutes || 'Unknown',
        source: recipe.source || 'spoonacular'
      };
      const existingLogs = this.getMealLogs();
      const updatedLogs = [mealLog, ...existingLogs];
      const trimmedLogs = updatedLogs.slice(0, this.maxRecentMeals);
      localStorage.setItem(this.storageKey, JSON.stringify(trimmedLogs));
      console.log(`🍽️ Meal logged: ${mealLog.name} at ${this.formatTime(mealLog.timestamp)}`);
      return mealLog;
    } catch (error) {
      console.error('Error logging meal:', error);
      return null;
    }
  }
  getMealLogs() {
    try {
      const logs = localStorage.getItem(this.storageKey);
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.error('Error getting meal logs:', error);
      return [];
    }
  }
  getRecentMeals(limit = 10) {
    const logs = this.getMealLogs();
    return logs.slice(0, limit).map(log => ({
      ...log,
      time: this.formatTime(log.timestamp),
      date: this.formatDate(log.timestamp),
      displayTime: `${this.formatDate(log.timestamp)} at ${this.formatTime(log.timestamp)}`
    }));
  }
  clearMealLogs() {
    localStorage.removeItem(this.storageKey);
    console.log('🗑️ All meal logs cleared');
  }
  extractIngredientsText(recipe) {
    if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
      return recipe.ingredients.slice(0, 3).map(ing => ing.name || ing.original || ing).join(', ');
    }
    return recipe.category || 'Various ingredients';
  }
  addToFavorites(recipe) {
    try {
      const favorite = {
        id: recipe.id,
        name: recipe.name || recipe.title,
        image: recipe.image,
        category: recipe.category,
        cookingTime: recipe.cookingTime || recipe.readyInMinutes || 'Unknown',
        difficulty: recipe.difficulty || 'Medium',
        addedAt: this.getCurrentTimestamp(),
        source: recipe.source || 'spoonacular',
        recipeData: recipe
      };
      const favorites = this.getFavorites();
      if (favorites.some(fav => fav.id === recipe.id)) {
        console.log(`⭐ Recipe already in favorites: ${recipe.name}`);
        return favorite;
      }
      const updatedFavorites = [favorite, ...favorites];
      localStorage.setItem(this.favoritesKey, JSON.stringify(updatedFavorites));
      console.log(`⭐ Added to favorites: ${recipe.name}`);
      return favorite;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return null;
    }
  }
  removeFromFavorites(recipeId) {
    try {
      const favorites = this.getFavorites();
      const updatedFavorites = favorites.filter(fav => fav.id !== recipeId);
      localStorage.setItem(this.favoritesKey, JSON.stringify(updatedFavorites));
      console.log(`💔 Removed from favorites: ${recipeId}`);
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }
  }
  isFavorited(recipeId) {
    const favorites = this.getFavorites();
    return favorites.some(fav => fav.id === recipeId);
  }
  getFavorites() {
    try {
      const favorites = localStorage.getItem(this.favoritesKey);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }
  toggleFavorite(recipe) {
    const isCurrentlyFavorited = this.isFavorited(recipe.id);
    if (isCurrentlyFavorited) {
      this.removeFromFavorites(recipe.id);
      return false;
    } else {
      this.addToFavorites(recipe);
      return true;
    }
  }
  getStats() {
    const logs = this.getMealLogs();
    const favorites = this.getFavorites();
    const mealsByType = logs.reduce((acc, log) => {
      acc[log.type] = (acc[log.type] || 0) + 1;
      return acc;
    }, );
    const today = new Date().toDateString();
    const todayMeals = logs.filter(log => 
      new Date(log.timestamp).toDateString() === today
    ).length;
    return {
      totalMealsLogged: logs.length,
      totalFavorites: favorites.length,
      todayMeals,
      mealsByType,
      lastMealTime: logs.length > 0 ? logs[0].timestamp : null
    };
  }
  suggestMealType() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 11) return 'Breakfast';
    if (hour >= 11 && hour < 16) return 'Lunch';
    if (hour >= 16 && hour < 19) return 'Snack';
    if (hour >= 19 || hour < 6) return 'Dinner';
    return 'Snack';
  }
}
export const mealLoggingService = new MealLoggingService();
export default mealLoggingService;
