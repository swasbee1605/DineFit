import React from 'react'
import { useAuth } from '../contexts/AuthContext'

const Dashboard = () => {
  const { user } = useAuth();
  
  // Mock data for demonstration
  const stats = {
    caloriesConsumed: 1850,
    caloriesGoal: 2200,
    waterIntake: 6,
    waterGoal: 8,
    workoutsCompleted: 3,
    workoutsGoal: 5,
    currentWeight: 75,
    targetWeight: 70
  };

  const recentMeals = [
    { id: 1, name: "Greek Yogurt Bowl", calories: 320, time: "8:30 AM", type: "Breakfast" },
    { id: 2, name: "Chicken Salad", calories: 450, time: "1:15 PM", type: "Lunch" },
    { id: 3, name: "Almonds & Apple", calories: 180, time: "4:00 PM", type: "Snack" }
  ];

  const upcomingWorkouts = [
    { id: 1, name: "Morning Cardio", time: "7:00 AM", duration: "30 min", type: "Cardio" },
    { id: 2, name: "Strength Training", time: "6:00 PM", duration: "45 min", type: "Strength" },
    { id: 3, name: "Evening Yoga", time: "8:30 PM", duration: "20 min", type: "Flexibility" }
  ];

  const calculatePercentage = (current, goal) => Math.min((current / goal) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Here's your fitness journey overview for today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {/* Calories */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="text-orange-600 text-2xl sm:text-3xl">🔥</div>
              <div className="text-right">
                <p className="text-xs sm:text-sm font-medium text-gray-500">CALORIES</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">
                  {stats.caloriesConsumed}/{stats.caloriesGoal}
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${calculatePercentage(stats.caloriesConsumed, stats.caloriesGoal)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600">
              {stats.caloriesGoal - stats.caloriesConsumed} cal remaining
            </p>
          </div>

          {/* Water */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="text-blue-600 text-2xl sm:text-3xl">💧</div>
              <div className="text-right">
                <p className="text-xs sm:text-sm font-medium text-gray-500">WATER</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">
                  {stats.waterIntake}/{stats.waterGoal} glasses
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${calculatePercentage(stats.waterIntake, stats.waterGoal)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600">
              {stats.waterGoal - stats.waterIntake} glasses to go
            </p>
          </div>

          {/* Workouts */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="text-purple-600 text-2xl sm:text-3xl">💪</div>
              <div className="text-right">
                <p className="text-xs sm:text-sm font-medium text-gray-500">WORKOUTS</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">
                  {stats.workoutsCompleted}/{stats.workoutsGoal}
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${calculatePercentage(stats.workoutsCompleted, stats.workoutsGoal)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600">
              {stats.workoutsGoal - stats.workoutsCompleted} workouts left
            </p>
          </div>

          {/* Weight */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="text-green-600 text-2xl sm:text-3xl">⚖️</div>
              <div className="text-right">
                <p className="text-xs sm:text-sm font-medium text-gray-500">WEIGHT</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">
                  {stats.currentWeight} kg
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-green-600 text-sm">↓</div>
              <p className="text-xs text-gray-600">
                {stats.currentWeight - stats.targetWeight} kg to goal
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Recent Meals */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Recent Meals</h2>
              <button className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors duration-200">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentMeals.map((meal) => (
                <div key={meal.id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-lg sm:text-xl">🍽️</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{meal.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-500">{meal.type} • {meal.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-sm sm:text-base">{meal.calories} cal</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg transition-colors duration-200">
              Log New Meal
            </button>
          </div>

          {/* Upcoming Workouts */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Today's Workouts</h2>
              <button className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors duration-200">
                Schedule
              </button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {upcomingWorkouts.map((workout) => (
                <div key={workout.id} className="p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{workout.name}</h3>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      {workout.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
                    <span>⏰ {workout.time}</span>
                    <span>⏱️ {workout.duration}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 sm:py-3 px-4 rounded-lg transition-colors duration-200">
              Start Workout
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <button className="flex flex-col items-center p-3 sm:p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors duration-200">
              <span className="text-2xl sm:text-3xl mb-2">🍎</span>
              <span className="text-xs sm:text-sm font-medium text-gray-900">Log Food</span>
            </button>
            <button className="flex flex-col items-center p-3 sm:p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200">
              <span className="text-2xl sm:text-3xl mb-2">💧</span>
              <span className="text-xs sm:text-sm font-medium text-gray-900">Add Water</span>
            </button>
            <button className="flex flex-col items-center p-3 sm:p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200">
              <span className="text-2xl sm:text-3xl mb-2">🏃</span>
              <span className="text-xs sm:text-sm font-medium text-gray-900">Log Exercise</span>
            </button>
            <button className="flex flex-col items-center p-3 sm:p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200">
              <span className="text-2xl sm:text-3xl mb-2">⚖️</span>
              <span className="text-xs sm:text-sm font-medium text-gray-900">Log Weight</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard