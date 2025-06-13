import { useState } from 'react'
import {Route, Routes} from 'react-router-dom'
import './App.css'

function App() {
  const [products, setProducts] = useState(0)

  return (
    <>
    <div>
      <Routes>
      <Route path="/" element={<h1>Welome</h1>}/>
      </Routes>
    </div>
    <div>
      <h1>This will be our homepage where our products will be displayed to the customers.</h1>
    </div>
    </>
  )
}

export default App
