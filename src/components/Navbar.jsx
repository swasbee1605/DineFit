import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="bg-green-600 text-white px-6 py-4 shadow-md flex items-center justify-between">
      <h1 className="text-lg font-semibold">DineFit</h1>
      <NavLink to="/" className="ml-4 hover:underline">
        Home
      </NavLink>
    </nav>
  )
}

export default Navbar