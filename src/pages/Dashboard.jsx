import React from 'react'
import { useAuth } from '../contexts/AuthContext'

const Dashboard = () => {
  const { user } = useAuth();
  
  const stats = {
    caloriesConsumed: 1850,
    caloriesGoal: 2200,
    currentWeight: 75,
    targetWeight: 70,
    allergies: ['Nuts', 'Dairy'],
    mealPlan: 'Weight Loss'
  };

  const recentMeals = [
    { id: 1, name: "Greek Yogurt Bowl", calories: 320, time: "8:30 AM", type: "Breakfast", ingredients: "Greek yogurt, berries, honey" },
    { id: 2, name: "Chicken Salad", calories: 450, time: "1:15 PM", type: "Lunch", ingredients: "Grilled chicken, mixed greens, olive oil" },
    { id: 3, name: "Almonds & Apple", calories: 180, time: "4:00 PM", type: "Snack", ingredients: "Raw almonds, green apple" },
    { id: 4, name: "Salmon Bowl", calories: 520, time: "7:30 PM", type: "Dinner", ingredients: "Baked salmon, quinoa, vegetables" },
    { id: 5, name: "Protein Smoothie", calories: 280, time: "10:00 AM", type: "Snack", ingredients: "Protein powder, banana, almond milk" },
    { id: 6, name: "Avocado Toast", calories: 380, time: "8:00 AM", type: "Breakfast", ingredients: "Whole grain bread, avocado, tomato" },
    { id: 7, name: "Quinoa Salad", calories: 420, time: "12:45 PM", type: "Lunch", ingredients: "Quinoa, chickpeas, cucumber, feta" },
    { id: 8, name: "Mixed Nuts", calories: 160, time: "3:30 PM", type: "Snack", ingredients: "Almonds, walnuts, cashews" },
    { id: 9, name: "Grilled Vegetables", calories: 200, time: "6:00 PM", type: "Side", ingredients: "Bell peppers, zucchini, eggplant" },
    { id: 10, name: "Oatmeal Bowl", calories: 350, time: "7:45 AM", type: "Breakfast", ingredients: "Steel cut oats, berries, cinnamon" }
  ];

  const calculatePercentage = (current, goal) => Math.min((current / goal) * 100, 100);
  const remainingCalories = stats.caloriesGoal - stats.caloriesConsumed;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            Welcome back, {user?.name || 'User'}! 🍽️
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-2">
            Track your nutrition and reach your goals
          </p>
          <div className="flex justify-center items-center space-x-4 text-sm text-gray-500">
            <span>Goal: {stats.mealPlan}</span>
            <span>•</span>
            <span>Target: {stats.targetWeight}kg</span>
            {stats.allergies.length > 0 && (
              <>
                <span>•</span>
                <span>Allergies: {stats.allergies.join(', ')}</span>
              </>
            )}
          </div>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
          {/* Calories */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="text-center">
              <div className="text-orange-500 text-4xl mb-3">🔥</div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Daily Calories</h3>
              <div className="text-3xl font-bold text-gray-900 mb-3">
                {stats.caloriesConsumed}<span className="text-lg text-gray-500">/{stats.caloriesGoal}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div 
                  className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${calculatePercentage(stats.caloriesConsumed, stats.caloriesGoal)}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                {remainingCalories > 0 ? `${remainingCalories} calories remaining` : `${Math.abs(remainingCalories)} calories over limit`}
              </p>
            </div>
          </div>

          {/* Weight Progress */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="text-center">
              <div className="text-green-500 text-4xl mb-3">⚖️</div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Current Weight</h3>
              <div className="text-3xl font-bold text-gray-900 mb-3">{stats.currentWeight} kg</div>
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="text-green-600 text-lg">↓</div>
                <span className="text-sm text-gray-600">{stats.currentWeight - stats.targetWeight} kg to goal</span>
              </div>
              <div className="text-xs text-gray-500">Target: {stats.targetWeight} kg</div>
            </div>
          </div>

          {/* Meal Count */}
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="text-center">
              <div className="text-blue-500 text-4xl mb-3">📊</div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Meals Today</h3>
              <div className="text-3xl font-bold text-gray-900 mb-3">{recentMeals.slice(0, 4).length}</div>
              <div className="text-sm text-gray-600 mb-2">Last meal at {recentMeals[0]?.time}</div>
              <div className="text-xs text-gray-500">Average: {Math.round(stats.caloriesConsumed / recentMeals.slice(0, 4).length)} cal/meal</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-8">
          <button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold text-lg px-8 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
            🍽️ Log New Meal
          </button>
          <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-8 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
            🔍 Generate Recipe
          </button>
          <button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-semibold text-lg px-8 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
            ⚙️ Update Goals
          </button>
        </div>

        {/* Recent Meals Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Recent Meals</h2>
            <div className="text-sm text-gray-500">Last 10 meals</div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {recentMeals.map((meal) => (
              <div key={meal.id} className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-green-600 text-xl">
                    {meal.type === 'Breakfast' ? '🌅' : 
                     meal.type === 'Lunch' ? '☀️' : 
                     meal.type === 'Dinner' ? '🌙' : 
                     meal.type === 'Snack' ? '�' : '🥗'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{meal.name}</h3>
                    <span className="font-bold text-gray-900 text-lg ml-2">{meal.calories} cal</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{meal.type} • {meal.time}</p>
                  <p className="text-xs text-gray-400 truncate">{meal.ingredients}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-6">
            <button className="text-green-600 hover:text-green-700 font-medium transition-colors duration-200">
              View Full Meal History →
            </button>
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-6 text-white text-center">
            <h3 className="text-xl font-bold mb-2">Daily Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-2xl font-bold">{Math.round((stats.caloriesConsumed/stats.caloriesGoal)*100)}%</div>
                <div className="opacity-90">Calorie Goal</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{recentMeals.slice(0, 4).length}</div>
                <div className="opacity-90">Meals Logged</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.currentWeight - stats.targetWeight}kg</div>
                <div className="opacity-90">To Goal Weight</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard