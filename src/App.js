import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Jumbotron from './components/Jumbotron'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import LoginContext from './LoginContext'
import Login from './components/Login'

function App() {
  const [login, setLogin] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    token && setLogin(jwtDecode(token))
  }, [])

  return (
    <>
      <BrowserRouter>
        <LoginContext.Provider value={{ login, setLogin }}>
          <Jumbotron />
          <Navbar />
          <Routes>
            <Route path="/about" element={<h1>This is our store</h1>} />
            <Route path="/login" element={<Login/>} />
          </Routes>
          <Footer />
        </LoginContext.Provider>
      </BrowserRouter>
    </>
  )
}

export default App
