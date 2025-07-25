import BrowserCache from '../utils/BrowserCache.js';
class AdvancedRecipeService {
  constructor() {
    this.memoryCache = new BrowserCache({ 
      stdTTL: 3600, // 1 hour
      checkperiod: 600 // Check for expired keys every 10 minutes
    });
    this.apiKeys = this.loadApiKeys();
    this.currentKeyIndex = 0;
    this.initializeQuotas();
    console.log(`🔑 Loaded ${this.apiKeys.length} API keys for rotation`);
  }
  loadApiKeys() {
    const keys = [];
    const apiKeysString = import.meta.env.VITE_SPOONACULAR_API_KEYS;
    if (apiKeysString && apiKeysString !== 'your_api_key_here') {
      const splitKeys = apiKeysString.split(',').map(key => key.trim()).filter(key => key.length > 0);
      keys.push(...splitKeys);
    }
    for (let i = 1; i <= 10; i++) {
      const key = import.meta.env[`VITE_SPOONACULAR_KEY_${i}`];
      if (key && key !== 'YOUR_FREE_API_KEY_HERE' && !keys.includes(key)) {
        keys.push(key);
      }
    }
    const singleKey = import.meta.env.VITE_SPOONACULAR_KEY;
    if (singleKey && singleKey !== 'YOUR_FREE_API_KEY_HERE' && !keys.includes(singleKey)) {
      keys.push(singleKey);
    }
    if (keys.length === 0) {
      console.warn('⚠️ No API keys found in environment variables');
      console.warn('Add VITE_SPOONACULAR_API_KEYS to your .env file');
      return ['DEMO_KEY_FALLBACK']; // Will use fallback recipes
    }
    console.log(`🔑 Loaded ${keys.length} Spoonacular API key(s)`);
    return keys;
  }
  initializeQuotas() {
    this.quotas = {};
    const savedQuotas = this.loadQuotasFromStorage();
    this.apiKeys.forEach((key, index) => {
      const keyId = `key_${index}`;
      if (savedQuotas[keyId] && Date.now() < savedQuotas[keyId].resetTime) {
        this.quotas[keyId] = savedQuotas[keyId];
      } else {
        this.quotas[keyId] = {
          used: 0,
          limit: 150, // Free tier limit
          resetTime: this.getNextResetTime()
        };
      }
    });
    this.saveQuotasToStorage();
  }
  getNextResetTime() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.getTime();
  }
  loadQuotasFromStorage() {
    try {
      const saved = localStorage.getItem('apiQuotas');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.warn('Could not load quotas from storage:', error);
      return {};
    }
  }
  saveQuotasToStorage() {
    try {
      localStorage.setItem('apiQuotas', JSON.stringify(this.quotas));
    } catch (error) {
      console.warn('Could not save quotas to storage:', error);
    }
  }
  getAvailableApiKey() {
    const now = Date.now();
    Object.keys(this.quotas).forEach(keyId => {
      if (now > this.quotas[keyId].resetTime) {
        this.quotas[keyId] = {
          used: 0,
          limit: 150,
          resetTime: this.getNextResetTime()
        };
      }
    });
    for (let i = 0; i < this.apiKeys.length; i++) {
      const keyIndex = (this.currentKeyIndex + i) % this.apiKeys.length;
      const keyId = `key_${keyIndex}`;
      if (this.quotas[keyId].used < this.quotas[keyId].limit) {
        this.currentKeyIndex = keyIndex;
        return {
          key: this.apiKeys[keyIndex],
          keyId: keyId,
          remaining: this.quotas[keyId].limit - this.quotas[keyId].used
        };
      }
    }
    return null; // No keys available
  }
  useApiQuota(keyId) {
    if (this.quotas[keyId]) {
      this.quotas[keyId].used++;
      this.saveQuotasToStorage();
    }
  }
  generateCacheKey(type, params) {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
    return `recipe_${type}_${btoa(sortedParams)}`;
  }
  async getFromCache(cacheKey) {
    try {
      const memoryResult = this.memoryCache.get(cacheKey);
      if (memoryResult) {
        console.log('🚀 Cache HIT (memory):', cacheKey);
        return memoryResult;
      }
      console.log('❌ Cache MISS:', cacheKey);
      return null;
    } catch (error) {
      console.warn('Cache get error:', error);
      return null;
    }
  }
  async setCache(cacheKey, data, ttl = 3600) {
    try {
      this.memoryCache.set(cacheKey, data, ttl);
      console.log('💾 Cached:', cacheKey);
    } catch (error) {
      console.warn('Cache set error:', error);
    }
  }
  needsAdvancedFiltering(userProfile) {
    if (!userProfile) return false;
    const hasAllergies = userProfile.allergies && userProfile.allergies !== 'None specified';
    const hasDietary = userProfile.dietaryPreferences && userProfile.dietaryPreferences !== 'None specified';
    const hasDislikes = userProfile.dislikedFoods && userProfile.dislikedFoods !== 'None specified';
    return hasAllergies || hasDietary || hasDislikes;
  }
  async makeSpoonacularRequest(endpoint, params) {
    const availableKey = this.getAvailableApiKey();
    if (!availableKey) {
      throw new Error('No API quota available. All keys exhausted for today.');
    }
    const url = new URL(`https://api.spoonacular.com/recipes/${endpoint}`);
    url.searchParams.append('apiKey', availableKey.key);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });
    console.log(`🔑 Using API key ${availableKey.keyId} (${availableKey.remaining} requests remaining)`);
    const response = await fetch(url.toString());
    if (!response.ok) {
      if (response.status === 402) {
        this.quotas[availableKey.keyId].used = this.quotas[availableKey.keyId].limit;
        this.saveQuotasToStorage();
        throw new Error(`API quota exceeded for ${availableKey.keyId}`);
      }
      throw new Error(`API request failed: ${response.status}`);
    }
    this.useApiQuota(availableKey.keyId);
    return await response.json();
  }
  async getPersonalizedRecipes(userProfile) {
    try {
      const cacheParams = {
        allergies: userProfile?.allergies || '',
        dietary: userProfile?.dietaryPreferences || '',
        dislikes: userProfile?.dislikedFoods || '',
        cuisines: userProfile?.favoriteCuisines || '',
        cookingTime: userProfile?.cookingTime || ''
      };
      const cacheKey = this.generateCacheKey('personalized', cacheParams);
      const cached = await this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }
      console.log('🔍 Fetching fresh personalized recipes...');
      if (!this.needsAdvancedFiltering(userProfile)) {
        console.log('📱 Using TheMealDB (no restrictions)');
        const recipes = await this.getTheMealDBRecipes(userProfile);
        await this.setCache(cacheKey, recipes, 7200); // Cache for 2 hours
        return recipes;
      }
      const params = {
        number: 12,
        addRecipeInformation: true,
        fillIngredients: true,
        sort: 'popularity'
      };
      if (userProfile?.dietaryPreferences) {
        const dietary = userProfile.dietaryPreferences.toLowerCase();
        if (dietary.includes('vegetarian')) params.diet = 'vegetarian';
        if (dietary.includes('vegan')) params.diet = 'vegan';
        if (dietary.includes('gluten-free')) params.diet = 'gluten free';
        if (dietary.includes('keto')) params.diet = 'ketogenic';
        if (dietary.includes('paleo')) params.diet = 'paleo';
      }
      if (userProfile?.allergies) {
        const intolerances = this.parseAllergies(userProfile.allergies);
        if (intolerances.length > 0) {
          params.intolerances = intolerances.join(',');
        }
      }
      if (userProfile?.dislikedFoods) {
        const excludeIngredients = userProfile.dislikedFoods
          .split(',')
          .map(food => food.trim().toLowerCase())
          .filter(food => food.length > 0)
          .join(',');
        if (excludeIngredients) {
          params.excludeIngredients = excludeIngredients;
        }
      }
      if (userProfile?.cookingTime === 'quick') {
        params.maxReadyTime = '30';
      } else if (userProfile?.cookingTime === 'moderate') {
        params.maxReadyTime = '60';
      }
      const data = await this.makeSpoonacularRequest('complexSearch', params);
      const recipes = data.results?.map(recipe => this.transformSpoonacularRecipe(recipe)) || [];
      await this.setCache(cacheKey, recipes, 3600); // Cache for 1 hour
      return recipes;
    } catch (error) {
      console.error('Error fetching personalized recipes:', error);
      try {
        const fallbackRecipes = await this.getTheMealDBRecipes(userProfile);
        return fallbackRecipes;
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        return this.getDemoRecipes(userProfile);
      }
    }
  }
  async searchRecipes(query, userProfile) {
    try {
      const cacheParams = {
        query,
        allergies: userProfile?.allergies || '',
        dietary: userProfile?.dietaryPreferences || '',
        dislikes: userProfile?.dislikedFoods || ''
      };
      const cacheKey = this.generateCacheKey('search', cacheParams);
      const cached = await this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }
      console.log(`🔍 Searching for: "${query}"...`);
      const params = {
        query,
        number: 12,
        addRecipeInformation: true
      };
      if (userProfile?.dietaryPreferences) {
        const dietary = userProfile.dietaryPreferences.toLowerCase();
        if (dietary.includes('vegetarian')) params.diet = 'vegetarian';
        if (dietary.includes('vegan')) params.diet = 'vegan';
        if (dietary.includes('gluten-free')) params.diet = 'gluten free';
      }
      if (userProfile?.allergies) {
        const intolerances = this.parseAllergies(userProfile.allergies);
        if (intolerances.length > 0) {
          params.intolerances = intolerances.join(',');
        }
      }
      if (userProfile?.dislikedFoods) {
        const excludeIngredients = userProfile.dislikedFoods
          .split(',')
          .map(food => food.trim())
          .join(',');
        params.excludeIngredients = excludeIngredients;
      }
      const data = await this.makeSpoonacularRequest('complexSearch', params);
      const recipes = data.results?.map(recipe => this.transformSpoonacularRecipe(recipe)) || [];
      await this.setCache(cacheKey, recipes, 1800); // Cache for 30 minutes
      return recipes;
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }
  parseAllergies(allergies) {
    const allergiesList = allergies.toLowerCase();
    const intolerances = [];
    if (allergiesList.includes('dairy') || allergiesList.includes('milk')) intolerances.push('dairy');
    if (allergiesList.includes('egg')) intolerances.push('egg');
    if (allergiesList.includes('gluten') || allergiesList.includes('wheat')) intolerances.push('gluten');
    if (allergiesList.includes('peanut')) intolerances.push('peanut');
    if (allergiesList.includes('sesame')) intolerances.push('sesame');
    if (allergiesList.includes('seafood') || allergiesList.includes('shellfish') || allergiesList.includes('fish')) intolerances.push('seafood');
    if (allergiesList.includes('soy')) intolerances.push('soy');
    if (allergiesList.includes('tree nut') || allergiesList.includes('nuts')) intolerances.push('tree nut');
    return intolerances;
  }
  async getTheMealDBRecipes(userProfile) {
    const cacheKey = this.generateCacheKey('themealdb', { profile: 'basic' });
    const cached = await this.getFromCache(cacheKey);
    if (cached) return cached;
    const recipes = [];
    try {
      for (let i = 0; i < 6; i++) {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        const data = await response.json();
        if (data.meals?.[0]) {
          recipes.push(this.transformTheMealDBRecipe(data.meals[0]));
        }
      }
      await this.setCache(cacheKey, recipes, 1800); // Cache for 30 minutes
      return recipes;
    } catch (error) {
      console.error('TheMealDB error:', error);
      return this.getDemoRecipes(userProfile);
    }
  }
  transformSpoonacularRecipe(recipe) {
    return {
      id: recipe.id,
      name: recipe.title,
      image: recipe.image,
      category: recipe.dishTypes?.[0] || 'Main Course',
      cuisines: recipe.cuisines || [],
      readyInMinutes: recipe.readyInMinutes || 30,
      servings: recipe.servings || 4,
      vegetarian: recipe.vegetarian || false,
      vegan: recipe.vegan || false,
      glutenFree: recipe.glutenFree || false,
      dairyFree: recipe.dairyFree || false,
      healthScore: recipe.healthScore || 0,
      cookingTime: recipe.readyInMinutes ? `${recipe.readyInMinutes} min` : 'Unknown',
      difficulty: recipe.readyInMinutes < 30 ? 'Easy' : recipe.readyInMinutes < 60 ? 'Medium' : 'Hard',
      summary: recipe.summary || '',
      source: 'spoonacular'
    };
  }
  transformTheMealDBRecipe(meal) {
    return {
      id: meal.idMeal,
      name: meal.strMeal,
      image: meal.strMealThumb,
      category: meal.strCategory,
      area: meal.strArea,
      tags: meal.strTags ? meal.strTags.split(',').map(tag => tag.trim()) : [],
      videoUrl: meal.strYoutube,
      cookingTime: '30 min',
      difficulty: 'Medium',
      source: 'themealdb'
    };
  }
  getDemoRecipes(userProfile) {
    const demos = [
      {
        id: 'demo-1',
        name: 'Mediterranean Quinoa Bowl',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
        category: 'Healthy',
        vegetarian: true,
        vegan: true,
        cookingTime: '25 min',
        difficulty: 'Easy',
        source: 'demo'
      },
      {
        id: 'demo-2',
        name: 'Lentil Curry',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
        category: 'Indian',
        vegetarian: true,
        vegan: true,
        cookingTime: '35 min',
        difficulty: 'Medium',
        source: 'demo'
      }
    ];
    if (userProfile?.dietaryPreferences?.toLowerCase().includes('vegan')) {
      return demos.filter(r => r.vegan);
    }
    if (userProfile?.dietaryPreferences?.toLowerCase().includes('vegetarian')) {
      return demos.filter(r => r.vegetarian);
    }
    return demos;
  }
  getQuotaStatus() {
    const totalUsed = Object.values(this.quotas).reduce((sum, quota) => sum + quota.used, 0);
    const totalLimit = Object.values(this.quotas).reduce((sum, quota) => sum + quota.limit, 0);
    return {
      summary: {
        totalKeys: this.apiKeys.length,
        totalUsed,
        totalLimit,
        totalRemaining: totalLimit - totalUsed,
        utilizationPercent: Math.round((totalUsed / totalLimit) * 100)
      },
      individual: Object.keys(this.quotas).map(keyId => ({
        keyId,
        used: this.quotas[keyId].used,
        limit: this.quotas[keyId].limit,
        remaining: this.quotas[keyId].limit - this.quotas[keyId].used,
        resetTime: new Date(this.quotas[keyId].resetTime).toLocaleString()
      })),
      cacheStats: {
        memoryKeys: this.memoryCache.keys().length,
        memoryStats: this.memoryCache.getStats()
      }
    };
  }
  async getByCategory(category) {
    console.log(`🔍 Getting recipes by category: ${category}`);
    const cacheKey = `category_${category}`;
    const cached = await this.getFromCache(cacheKey);
    if (cached) {
      console.log('📋 Returning cached category recipes');
      return cached;
    }
    try {
      const recipes = await this.searchRecipes(category, );
      await this.setCache(cacheKey, recipes, 3600);
      return recipes;
    } catch (error) {
      console.error('Error getting recipes by category:', error);
      return this.getDemoRecipes();
    }
  }
  async getRandomRecipes(count = 12) {
    console.log(`🎲 Getting ${count} random recipes`);
    const cacheKey = `random_${count}`;
    const cached = await this.getFromCache(cacheKey);
    if (cached) {
      console.log('📋 Returning cached random recipes');
      return cached;
    }
    try {
      const recipes = await this.getPersonalizedRecipes();
      const randomRecipes = recipes.slice(0, count);
      await this.setCache(cacheKey, randomRecipes, 1800); // 30 min cache for random
      return randomRecipes;
    } catch (error) {
      console.error('Error getting random recipes:', error);
      return this.getDemoRecipes().slice(0, count);
    }
  }
  cleanHtmlText(htmlString) {
    if (!htmlString) return '';
    return htmlString
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
      .replace(/&amp;/g, '&') // Replace &amp; with &
      .replace(/&lt;/g, '<') // Replace &lt; with <
      .replace(/&gt;/g, '>') // Replace &gt; with >
      .replace(/&quot;/g, '"') // Replace &quot; with "
      .replace(/&#39;/g, "'") // Replace &#39; with '
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
  }
  processInstructions(instructions, analyzedInstructions) {
    if (analyzedInstructions && Array.isArray(analyzedInstructions) && analyzedInstructions.length > 0) {
      const steps = analyzedInstructions[0]?.steps || [];
      return steps.map((step, index) => ({
        number: step.number || index + 1,
        step: this.cleanHtmlText(step.step)
      }));
    }
    if (instructions && typeof instructions === 'string') {
      const cleanText = this.cleanHtmlText(instructions);
      const steps = cleanText
        .split(/\d+\.|\.\s+/)
        .map(step => step.trim())
        .filter(step => step.length > 10) // Filter out very short steps
        .map((step, index) => ({
          number: index + 1,
          step: step
        }));
      return steps.length > 0 ? steps : [{ number: 1, step: cleanText }];
    }
    return [{ number: 1, step: 'Instructions not available for this recipe.' }];
  }
  async getRecipeDetails(id) {
    console.log(`📖 Getting recipe details for ID: ${id}`);
    const cacheKey = `details_${id}`;
    const cached = await this.getFromCache(cacheKey);
    if (cached) {
      console.log('📋 Returning cached recipe details');
      return cached;
    }
    try {
      const response = await this.makeSpoonacularRequest(`${id}/information`, {
        includeNutrition: true
      });
      if (response) {
        const ingredients = response.extendedIngredients?.map(ing => ({
          name: ing.name || ing.nameClean || 'Unknown ingredient',
          amount: ing.amount || 0,
          unit: ing.unit || '',
          original: ing.original || `${ing.amount || ''} ${ing.unit || ''} ${ing.name || ''}`.trim()
        })).filter(ing => ing.name !== 'Unknown ingredient' && ing.original) || [];
        const processedInstructions = this.processInstructions(
          response.instructions, 
          response.analyzedInstructions
        );
        const details = {
          id: response.id,
          title: response.title,
          image: response.image,
          servings: response.servings,
          readyInMinutes: response.readyInMinutes,
          instructions: processedInstructions,
          ingredients: ingredients,
          nutrition: response.nutrition,
          summary: this.cleanHtmlText(response.summary),
          sourceUrl: response.sourceUrl,
          vegetarian: response.vegetarian || false,
          vegan: response.vegan || false,
          glutenFree: response.glutenFree || false,
          dairyFree: response.dairyFree || false,
          healthScore: response.healthScore || 0
        };
        console.log(`✅ Recipe details processed: ${ingredients.length} ingredients, ${processedInstructions.length} steps`);
        await this.setCache(cacheKey, details, 7200); // 2 hour cache for details
        return details;
      }
    } catch (error) {
      console.error('Error getting recipe details:', error);
      return {
        id,
        title: 'Recipe Details Unavailable',
        image: null,
        instructions: [{ number: 1, step: 'Recipe details could not be loaded at this time.' }],
        ingredients: [],
        servings: 1,
        readyInMinutes: 30
      };
    }
  }
}
export const advancedRecipeService = new AdvancedRecipeService();
export const recipeService = advancedRecipeService;
