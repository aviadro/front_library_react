import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginContext from '../LoginContext'
import LateLoans from './LateLoans';

function AllBooks() {
  const navigate = useNavigate()
  const [books, setBooks] = useState([])
  const [searchTitle, setSearchTitle] = useState('')
  const [searchAuthor, setSearchAuthor] = useState('')
  const [allLateLoans, setAllLateLoans] = useState([])
  const [lateLoans, setLateLoans] = useState([])
  const { login, setLogin } = useContext(LoginContext)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const decoded = jwtDecode(token)
      setLogin(decoded)
    }
    getBooks()
  }, [])

  useEffect(() => {
    if (login.is_admin) {
      getAllLateLoans()
    }
    if (login) {
      getLateLoans()
    }
  }, [login])

  function getBooks() {
    axios
      .get(
        'https://library-django-backend-project.onrender.com/loans/display_books'
      )
      .then((response) => {
        setBooks(response.data)
      })
  }
  function getLateLoans() {
    if (!login) return
    const authToken = localStorage.getItem('token')
    axios
      .get(
        `https://library-django-backend-project.onrender.com/loans/late_loans/${login.user_id}`,
        { headers: { Authorization: `Bearer ${authToken}` } } // Headers
      )
      .then((response) => {
        setLateLoans(response.data)
      })
  }

  function getAllLateLoans() {
    if (!login) return
    const authToken = localStorage.getItem('token')
    axios
      .get(
        `https://library-django-backend-project.onrender.com/loans/late_loans`,
        { headers: { Authorization: `Bearer ${authToken}` } } // Headers
      )
      .then((response) => {
        setAllLateLoans(response.data)
      })
  }

  function updatedBooks() {
    return books.filter(
      (book) =>
        book.title &&
        book.title.startsWith(
          searchTitle.charAt(0).toUpperCase() +
            searchTitle.slice(1).toLowerCase()
        ) &&
        book.author &&
        book.author.startsWith(
          searchAuthor.charAt(0).toUpperCase() +
            searchAuthor.slice(1).toLowerCase()
        )
    )
  }
  const handleBookClick = (bookId) => {
    navigate(`/books/${bookId}`)
  }

  return (
    <>
      <div className="container mt-5">
        <h2 className="mb-4">Library Books</h2>
      </div>

      {/* Late Loans Section */}
      <LateLoans login={login} />

      {/* Search Inputs */}
      <div className="mt-4">
        <label>
          &nbsp;&nbsp;&nbsp;Search by Title
          <input
            className="input-field"
            value={searchTitle}
            onChange={(e) => setSearchTitle(String(e.target.value))}
          />
        </label>
        <label>
          &nbsp;&nbsp;&nbsp;Search by Author
          <input
            className="input-field"
            value={searchAuthor}
            onChange={(e) => setSearchAuthor(String(e.target.value))}
          />
        </label>
      </div>

      {/* Books Section */}
      <div className="table-responsive">
        <div className="container mt-4">
          <h1 className="mb-4">Books</h1>
          <div className="row">
            {updatedBooks().map((book) => (
              <div className="col-md-4 mb-4" key={book.id}>
                <div
                  className="card h-100"
                  onClick={() => handleBookClick(book.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={`https://library-django-backend-project.onrender.com/static${book.image}`}
                    className="card-img-top"
                    alt={book.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{book.title}</h5>
                    <p className="card-text">
                      <strong>Author:</strong> {book.author} <br />
                      <strong>Status:</strong>{' '}
                      {book.isActive ? 'Available' : 'Not Available'} <br />
                      <strong>Duration time:</strong>{' '}
                      {book.book_type === 1
                        ? '10 days'
                        : book.book_type === 2
                        ? '5 days'
                        : book.book_type === 3
                        ? '2 days'
                        : 'Not Available'}{' '}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default AllBooks
