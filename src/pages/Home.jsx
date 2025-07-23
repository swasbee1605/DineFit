import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom';

const Home = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            {isAuthenticated ? `Welcome back, ${user.name || user.email}!` : 'Welcome to DineFit!'}
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto">
            {isAuthenticated 
              ? 'Ready to continue your fitness journey?' 
              : 'Your one-stop solution for healthy dining and fitness tracking.'
            }
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-green-600 text-4xl sm:text-5xl mb-4">🥗</div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">Healthy Meals</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Discover nutritious and delicious meal options tailored to your fitness goals.
              </p>
            </div>
            
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-green-600 text-4xl sm:text-5xl mb-4">📊</div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">Track Progress</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Monitor your nutritional intake and fitness journey with detailed analytics.
              </p>
            </div>
            
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 md:col-span-2 lg:col-span-1">
              <div className="text-green-600 text-4xl sm:text-5xl mb-4">🎯</div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">Achieve Goals</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Set and reach your fitness and nutrition goals with personalized recommendations.
              </p>
            </div>
          </div>
          
          <div className="mt-12 sm:mt-16">
            {isAuthenticated ? (
              <div className="space-y-4">
                <Link 
                  to="/dashboard" 
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold text-lg sm:text-xl px-8 py-3 sm:px-10 sm:py-4 rounded-lg transition-colors duration-200 transform hover:scale-105 shadow-lg mr-4"
                >
                  Go to Dashboard
                </Link>
                <p className="text-base text-gray-600">
                  Welcome back! Start tracking your meals and workouts.
                </p>
              </div>
            ) : (
              <a 
                href="/signup" 
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold text-lg sm:text-xl px-8 py-3 sm:px-10 sm:py-4 rounded-lg transition-colors duration-200 transform hover:scale-105 shadow-lg"
              >
                Get Started Today
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home