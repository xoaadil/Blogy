import './App.css'
import Landing from './page/LandingPage'
import Signup from './page/signup'
import Login from "./page/Login"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from './page/Home'
import Post from "./page/Post"
function App() {
 

  return (
    <>
  
    <BrowserRouter>
    <Routes>
      <Route  path='/Landing' element={<Landing/>} />
      <Route  path='/Signup' element={<Signup/>}/>
      <Route path='/Login' element={<Login/>} />
      <Route path='/Home' element={<HomePage/>} />
      <Route path='/Post/:id' element={<Post/>} />
      
    </Routes>
    </BrowserRouter>
      
    </>
  )
}

export default App
