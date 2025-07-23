import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import './index.css'

function App() {
  console.log('App component rendering...');
  
  return (
    <div className="App">
      <AuthProvider>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={ <Home /> } />
            <Route path="/signup" element={ <Signup /> } />
            <Route path="/login" element={ <Login /> } />
            <Route path="/dashboard" element={ <Dashboard /> } />
            <Route path="*" element={ <div className="p-8 text-center">404 - Page Not Found</div> } />
          </Routes>
        </main>
      </AuthProvider>
    </div>
  )
}

export default App
