import { NavLink } from 'react-router-dom'

const Navbar = () => {
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
        </div>
      </div>
    </nav>
  )
}

export default Navbar