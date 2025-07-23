import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const { user, logout, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      alert('Logged out successfully!');
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
          <NavLink 
            to="/" 
            className="text-sm sm:text-base px-2 sm:px-3 py-1 rounded hover:bg-green-700 transition-colors duration-200"
          >
            Home
          </NavLink>
          
          {user ? (
            <>
              <span className="text-sm sm:text-base px-2 sm:px-3 py-1 bg-green-700 rounded">
                Welcome, {user.name || user.email}
              </span>
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
                to="/login" 
                className="text-sm sm:text-base px-2 sm:px-3 py-1 rounded hover:bg-green-700 transition-colors duration-200"
              >
                Login
              </NavLink>
              <NavLink 
                to="/signup" 
                className="text-sm sm:text-base px-2 sm:px-3 py-1 rounded hover:bg-green-700 transition-colors duration-200"
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