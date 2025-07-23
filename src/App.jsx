import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import './index.css'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="/signup" element={ <Signup /> } />
        <Route path="/login" element={ <Login /> } />
      </Routes>
    </>
  )
}

export default App
