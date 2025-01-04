import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Jumbotron from './components/Jumbotron'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import LoginContext from './LoginContext'
import Login from './components/Login'
import AllBooks from './components/AllBooks'
import Book from './components/Book'

function App() {
  const [login, setLogin] = useState('')

  return (
    <>
      <BrowserRouter>
        <LoginContext.Provider value={{ login, setLogin }}>
          <Jumbotron />
          <Navbar />
          <Routes>
            <Route path="/" element={<AllBooks />} />
            <Route path="/about" element={<h1>This is our library</h1>} />
            <Route path="/login" element={<Login />} />
            <Route path="/books/:bookId" element={<Book />} />
          </Routes>
          <Footer />
        </LoginContext.Provider>
      </BrowserRouter>
    </>
  )
}

export default App
