import React from 'react'

const Navbar = () => {
  return (
    <nav className="bg-green-600 text-white px-6 py-4 shadow-md">
      <h1 className="text-lg font-semibold">DineFit</h1>
      <a href="/" className="ml-4 hover:underline">
        Home
      </a>
    </nav>
  )
}

export default Navbar