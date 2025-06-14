import { useState, useEffect } from 'react'
import {Route, Routes} from 'react-router-dom'
import './App.css'
import Register from './components/Register'
import LogIn from './components/Login'

function App() {
  const [products, setProducts] = useState(0)
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  return (
    <>
    <div>
      <Routes>
        <Route path="/" element={<h1>Welome</h1>}/>
        <Route path='/login' element={<LogIn setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
    <div>

    </div>
    </>
  )
}

export default App
