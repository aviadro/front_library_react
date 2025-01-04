import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginContext from '../LoginContext'

function AllBooks() {
  const navigate = useNavigate()
  const [books, setBooks] = useState([])
  const [searchTitle, setSearchTiltle] = useState('')
  const [searchAuthor, setSearchAuthor] = useState('')
  const {login, setLogin} = useContext(LoginContext)

  useEffect(() => {
    const token = localStorage.getItem('token')
    token && setLogin(jwtDecode(token))
    getBooks()
  }, [])

  function getBooks() {
    axios
      .get(
        'https://library-django-backend-project.onrender.com/loans/display_books'
      )
      .then((response) => {
        setBooks(response.data)
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
      <div class="container mt-5">
        <h2 className="mb-4">Library Books</h2>
      </div>
      <label>
        &nbsp;&nbsp;&nbsp;Search by Title
        <input
          className="input-field"
          value={searchTitle}
          onChange={(e) => setSearchTiltle(String(e.target.value))}
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
      <div className="table-responsive">
        <div className="container mt-4">
          <h1 className="mb-4">Books</h1>
          <div className="row">
            {updatedBooks().map((book) => (
              <div className="col-md-4 mb-4" key={book.id}>
                <div
                  className="card h-100"
                  onClick={() => handleBookClick(book.id)} // Add click handler
                  style={{ cursor: 'pointer' }} // Change cursor to indicate clickability
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
  )
}

export default AllBooks
