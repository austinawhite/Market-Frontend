import { useState, useEffect } from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import './App.css'
import Products from './components/Products'

function App() {
  const [products, setProducts] = useState([]);

  return (
    <>
    <div>
      <Navigations token={token} setToken={setToken}/>
      <Routes>
      <Route path="/" element={<Products products={products} setProducts={setProducts}/>}/>
      </Routes>
    </div>
    </>
  )
}

export default App
