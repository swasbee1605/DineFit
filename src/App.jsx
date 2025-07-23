import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<div className="p-6">Welcome to DineFit!</div>} />
      </Routes>
    </>
  )
}

export default App
