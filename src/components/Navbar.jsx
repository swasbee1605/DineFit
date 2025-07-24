import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const { user, logout, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      alert('Logged out successfully!');
      // The user state will be automatically updated by the context
      // No need for manual redirect since React Router will handle it
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <nav className="bg-green-600 text-white px-4 sm:px-6 py-3 sm:py-4 shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-base sm:text-lg lg:text-xl font-semibold">DineFit</h1>
          <div className="text-sm">Loading...</div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-green-600 text-white px-4 sm:px-6 py-3 sm:py-4 shadow-md">
      <div className="flex items-center justify-between">
        <h1 className="text-base sm:text-lg lg:text-xl font-semibold">DineFit</h1>
        <div className="flex space-x-2 sm:space-x-4">
          
          
          {user ? (
            <>
              <span className="text-sm sm:text-base px-2 sm:px-3 py-1 border-2 border-solid border-green-400 rounded">
                Welcome, {user.name || user.email}
              </span>
              <NavLink to="/dashboard" className={({isActive}) => isActive ? "bg-green-800 text-sm sm:text-base px-2 sm:px-3 py-1 rounded hover:bg-green-700 transition-colors duration-200" : "text-sm sm:text-base px-2 sm:px-3 py-1 rounded hover:bg-green-700 transition-colors duration-200"}>
                Dashboard
              </NavLink>
              <button 
                onClick={handleLogout}
                className="text-sm sm:text-base px-2 sm:px-3 py-1 rounded hover:bg-green-700 transition-colors duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
            <NavLink 
                to="/" 
                className="text-sm sm:text-base px-2 sm:px-3 py-1 rounded hover:bg-green-700 transition-colors duration-200"
            >
                Home
            </NavLink>
              <NavLink 
                to="/login" 
                className={({isActive}) => isActive ? "bg-green-800 text-sm sm:text-base px-2 sm:px-3 py-1 rounded hover:bg-green-700 transition-colors duration-200" : "text-sm sm:text-base px-2 sm:px-3 py-1 rounded hover:bg-green-700 transition-colors duration-200"}
              >
                Login
              </NavLink>
              <NavLink 
                to="/signup" 
                className={({isActive}) => isActive ? "bg-green-800 text-sm sm:text-base px-2 sm:px-3 py-1 rounded hover:bg-green-700 transition-colors duration-200" : "text-sm sm:text-base px-2 sm:px-3 py-1 rounded hover:bg-green-700 transition-colors duration-200"}
              >
                Signup
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar