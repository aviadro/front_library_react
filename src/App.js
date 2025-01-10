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
import LoanManagment from './components/LoanManagment'
import Register from './components/Register'
import BookManagment from './components/BookManagment'
import About from './components/About'
import Customers from './components/Customers'

function App() {
  const [login, setLogin] = useState('')

  return (
    <>
      <BrowserRouter>
        <LoginContext.Provider value={{ login, setLogin }}>
          <Jumbotron />
          <div className="library-background">
            <Navbar />
            <Routes>
              <Route path="/" element={<AllBooks />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/books/:bookId" element={<Book />} />
              <Route path="/loans" element={<LoanManagment />} />
              <Route path="/register" element={<Register />} />
              <Route path="/booksM" element={<BookManagment />} />
              <Route path="/customers" element={<Customers />} />
            </Routes>
            <Footer />
          </div>
        </LoginContext.Provider>
      </BrowserRouter>
    </>
  )
}

export default App
