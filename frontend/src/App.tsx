import './App.css'
import Landing from './page/LandingPage'
import Signup from './page/signup'
import Login from "./page/Login"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from './page/Home'
import Post from "./page/Post"
import { ThemeProvider } from 'next-themes'
import { Profile } from './page/Profile'
import Layout from "./components/Layout"
function App() {
 

  return (
    <>
    <ThemeProvider attribute="class">
    <BrowserRouter>
   <Routes>
    <Route path ='/' element={<Landing/>} />
 

  <Route path="/Signup" element={<Signup/>} />
  <Route path="/Login"  element={<Login/>} />
 <Route path="/Landing" element={<Layout><Landing/></Layout>} />
  {/* All pages that need Header + Footer */}
  <Route path="/Home"    element={<Layout><HomePage/></Layout>} />
  <Route path="/Post/:id"    element={<Layout><Post/></Layout>} />
  <Route path="/Profile/:id" element={<Layout><Profile/></Layout>} />
</Routes>
    </BrowserRouter>
    </ThemeProvider>
      
    </>
  )
}

export default App
