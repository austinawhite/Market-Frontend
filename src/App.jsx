import { useState, useEffect } from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import './App.css'
import Register from './components/Register'
import LogIn from './components/Login'
import Navigations from './components/Navigations'
import Account from './components/Account'
import Products from './components/Products'
import SingleProduct from './components/SingleProduct'
import Orders from './components/Orders';
import Home from './components/home'


function App() {
  const [products, setProducts] = useState([])
  const [product, setProduct] = useState({})
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
      {location.pathname !== '/' && <Navigations token={token} setToken={setToken}/>}
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path='/login' element={<LogIn setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route path='/users/me' element={<Account token={token} />} />
        <Route path='/account' element={token ? <Account token={token} /> : <Navigate to="/login" />} />
        <Route path="/products" element={<Products products={products} setProducts={setProducts} />} />
        <Route path="/products/:id" element={<SingleProduct product={product} setProduct={setProduct} token={token} />} />
        <Route path="/orders" element={<Orders token={token} />} />
      </Routes>
    </div>
    <div>

    </div>
    </>
  )
}

export default App