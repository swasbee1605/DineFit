import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isHomePage = location.pathname === "/";
  const { user, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navClasses = `sticky top-0 z-50 px-4 sm:px-6 py-3 sm:py-4 shadow-md transition-all duration-300 ${
    isHomePage
      ? "bg-white/80 backdrop-blur-md text-gray-800 border-b border-gray-200/20"
      : "bg-green-600 text-white"
  }`;

  const baseLink =
    "block text-sm sm:text-base px-2 sm:px-3 py-1 rounded transition-colors duration-200";

  const activeLink = (isActive) =>
    isActive
      ? isHomePage
        ? "bg-green-600 text-white"
        : "bg-green-800 text-white"
      : isHomePage
      ? "text-gray-700 hover:bg-green-100 hover:text-green-700"
      : "text-white hover:bg-green-700";

  if (loading) {
    return (
      <nav className={navClasses}>
        <div className="flex items-center justify-between">
          <h1 className="text-base sm:text-lg lg:text-xl font-semibold">DineFit</h1>

  if (loading) {
    return (
      <nav className={`sticky top-0 z-50 px-4 sm:px-6 py-3 sm:py-4 shadow-md transition-all duration-300 bg-background text-foreground border-b`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img src="/dine-fit-logo.svg" alt="DineFit" className="h-12 w-12 sm:h-16 sm:w-16" />
            <span className="ml-2 text-base sm:text-lg lg:text-xl font-semibold">DineFit</span>
          </div>

          <div className="text-sm">Loading...</div>
        </div>
      </nav>
    );
  }


  if (loading) {
    return (
      <nav className={navClasses}>
        <div className="flex items-center justify-between">
          <h1 className="text-base sm:text-lg lg:text-xl font-semibold">
            DineFit
          </h1>
          <div className="text-sm">Loading...</div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={navClasses}>
      <div className="flex items-center justify-between">
        <h1 className="text-base sm:text-lg lg:text-xl font-semibold">DineFit</h1>

        {/* Hamburger Button */}
        <button
          className="sm:hidden flex flex-col space-y-1 focus:outline-none"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span
            className={`block h-0.5 w-5 bg-current transform transition duration-300 ${
              menuOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          ></span>
          <span
            className={`block h-0.5 w-5 bg-current transition duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block h-0.5 w-5 bg-current transform transition duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          ></span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden sm:flex space-x-4 items-center">
          {user ? (
            <>
              <span
                className={`text-sm sm:text-base px-2 sm:px-3 py-1 border-2 rounded ${
                  isHomePage
                    ? "border-green-500 text-green-700 bg-green-50"
                    : "border-green-400 text-white"
                }`}
              >
                Welcome, {user.name || user.email}
              </span>
              <NavLink to="/dashboard" className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}>
                Dashboard
              </NavLink>
              <NavLink to="/meal-planner" className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}>
                Meal Planner
              </NavLink>
              <NavLink to="/about" className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}>
                About
              </NavLink>
              <button
                onClick={handleLogout}
                className={`${baseLink} ${
                  isHomePage
                    ? "text-gray-700 hover:bg-red-100 hover:text-red-700"
                    : "text-white hover:bg-green-700"

  return (
    <nav className={`sticky top-0 z-50 px-4 sm:px-6 py-3 sm:py-4 shadow-md transition-all duration-300 bg-background text-foreground border-b`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img src="/dine-fit-logo.svg" alt="DineFit" className="h-12 w-100 sm:h-16 sm:w-100" />
          {/* <span className="ml-2 text-base sm:text-lg lg:text-xl font-semibold">DineFit</span> */}
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className={`p-2 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              theme === 'dark'
                ? 'bg-[hsl(var(--border))] text-[hsl(var(--card-foreground))] hover:bg-[hsl(var(--border))/0.9]'
                : 'bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] hover:bg-[hsl(var(--card))/0.95]'
            }`}
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
          {user ? (
            <>
              <span className={`text-sm sm:text-base px-2 sm:px-3 py-1 rounded-full transition-colors duration-200 ${
                isHomePage
                  ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-sm'
                  : 'bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] border border-[hsl(var(--border))]'
              }`}>
                Welcome, {user.name || user.email}
              </span>
              <NavLink 
                to="/dashboard" 
                className={({isActive}) => `text-sm sm:text-base px-2 sm:px-3 py-1 rounded transition-colors duration-200 ${
                    isActive 
                    ? (isHomePage ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]')
                    : (isHomePage ? 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--card))] hover:text-[hsl(var(--primary))]' : 'text-[hsl(var(--card-foreground))] hover:bg-[hsl(var(--primary))]')
                }`}
              >
                Dashboard
              </NavLink>
              <NavLink 
                to="/meal-planner" 
                className={({isActive}) => `text-sm sm:text-base px-2 sm:px-3 py-1 rounded transition-colors duration-200 ${
                  isActive 
          ? (isHomePage ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]')
          : (isHomePage ? 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--card))] hover:text-[hsl(var(--primary))]' : 'text-[hsl(var(--card-foreground))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]')
                }`}
              >
                Meal Planner
              </NavLink>
              <button 
                onClick={handleLogout}
                className={`text-sm sm:text-base px-2 sm:px-3 py-1 rounded transition-colors duration-200 ${
                  isHomePage 
                    ? 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--card))] hover:text-[hsl(var(--destructive))]' 
                    : 'text-[hsl(var(--card-foreground))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]'

                }`}
              >
                Logout
              </button>
            </>
          ) : (
            <>

              <NavLink to="/" className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}>
                Home
              </NavLink>
              <NavLink to="/about" className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}>
                About
              </NavLink>
              <NavLink to="/login" className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}>
                Login
              </NavLink>
              {!isHomePage && (
                <NavLink to="/signup" className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}>

              <NavLink 
                to="/" 
                className={`text-sm sm:text-base px-2 sm:px-3 py-1 rounded transition-colors duration-200 ${
                  isHomePage 
                    ? 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--card))] hover:text-[hsl(var(--primary))]' 
                    : 'text-[hsl(var(--card-foreground))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]'
                }`}
              >
                Home
              </NavLink>
              <NavLink 
                to="/login" 
                className={({isActive}) => `text-sm sm:text-base px-2 sm:px-3 py-1 rounded transition-colors duration-200 ${
                  isActive 
                    ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                    : (isHomePage ? 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--card))] hover:text-[hsl(var(--primary))]' : 'text-[hsl(var(--card-foreground))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]')
                }`}
              >
                Login
              </NavLink>
              {!isHomePage && (
                <NavLink 
                  to="/signup" 
                  className={({isActive}) => `text-sm sm:text-base px-2 sm:px-3 py-1 rounded transition-colors duration-200 ${
                    isActive 
                      ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                      : 'text-[hsl(var(--card-foreground))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]'
                  }`}
                >

                  Signup
                </NavLink>
              )}
            </>
          )}
        </div>
      </div>


      {/* Mobile Nav */}
      <div
        className={`sm:hidden flex flex-col mt-3 space-y-2 transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {user ? (
          <>
            <span
              className={`text-sm px-2 py-1 ${
                isHomePage
                  ? "border-green-500 text-green-700 bg-green-50"
                  : "text-white"
              }`}
            >
              Welcome, {user.name || user.email}
            </span>
            <NavLink to="/dashboard" onClick={() => setMenuOpen(false)} className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}>
              Dashboard
            </NavLink>
            <NavLink to="/meal-planner" onClick={() => setMenuOpen(false)} className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}>
              Meal Planner
            </NavLink>
            <NavLink to="/about" onClick={() => setMenuOpen(false)} className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}>
              About
            </NavLink>
            <button
              onClick={handleLogout}
              className={`border-2 border-white ${baseLink} ${
                isHomePage
                  ? "text-gray-700 hover:bg-red-100 hover:text-red-700"
                  : "text-white hover:bg-green-700"
              }`}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/" onClick={() => setMenuOpen(false)} className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}>
              Home
            </NavLink>
            <NavLink to="/about" onClick={() => setMenuOpen(false)} className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}>
              About
            </NavLink>
            <NavLink to="/login" onClick={() => setMenuOpen(false)} className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}>
              Login
            </NavLink>
            {!isHomePage && (
              <NavLink to="/signup" onClick={() => setMenuOpen(false)} className={({ isActive }) => `${baseLink} ${activeLink(isActive)}`}>
                Signup
              </NavLink>
            )}
          </>
        )}
      </div>

    </nav>
  )
}

export default Navbar
