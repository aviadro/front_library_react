import React, { useContext, useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom' // Import Link and useNavigate
import axios from 'axios'
import LoginContext from '../LoginContext'

const Book = () => {
  const { bookId } = useParams() // Get the bookId from the URL
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null) // For success or error messages
  const { login } = useContext(LoginContext)
  const navigate = useNavigate() // For programmatic navigation

  useEffect(() => {
    // Fetch the book details from the backend
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(
          `https://library-django-backend-project.onrender.com/loans/display_book/${bookId}/`
        )
        setBook(response.data)
      } catch (err) {
        setError('Failed to fetch book details.')
      } finally {
        setLoading(false)
      }
    }

    fetchBookDetails()
  }, [bookId])
  if (loading) return <p>Loading book details...</p>
  if (error) return <p>{error}</p>

  const handleLoanBook = async () => {
    try {
      const authToken = localStorage.getItem('token');
      console.log(authToken);
      
      const response = await axios.post(
        `https://library-django-backend-project.onrender.com/loans/loan_book`,
        { book_id: bookId, customer_id: login.user_id }, // Request body
        { headers: { Authorization: `Bearer ${authToken}` } } // Headers
      );
      
      setMessage('Book loaned successfully!');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setMessage('Failed to loan the book. Need to login first.');
      } else {
        setMessage('Failed to loan the book. Please try again.');
      }
    }
  }
  

  return (
    <div className="container mt-4">
      <h1 style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }}>
        {book.title}
      </h1>
      <div className="row">
        <div className="col-md-4">
          <img
            src={`https://library-django-backend-project.onrender.com/static${book.image}`}
            alt={book.title}
            className="img-fluid"
            style={{ height: '300px', objectFit: 'cover' }}
          />
        </div>
        <div className="col-md-8">
          <h5 style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }}>
            Author: {book.author}
          </h5>
          <p style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }}>
            {book.description}
          </p>
          <p style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }}>
            <strong>Published Year:</strong> {book.published_year}
          </p>
          <p style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }}>
            <strong>Status:</strong>{' '}
            {book.isActive ? 'Available' : 'Not Available'}
          </p>
          <p style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }}>
            <strong>Duration time:</strong>{' '}
            {book.book_type === 1
              ? '10 days'
              : book.book_type === 2
              ? '5 days'
              : book.book_type === 3
              ? '2 days'
              : 'Not Available'}
          </p>
          <div className="d-flex gap-3 mt-3">
            {book.isActive && (
              <button className="btn btn-primary" onClick={handleLoanBook}>
                Loan this Book
              </button>
            )}
            <button className="btn btn-secondary" onClick={() => navigate('/')}>
              Back to Book List
            </button>
          </div>
          {message && (
            <p
              className={`mt-3 ${
                message.includes('successfully')
                  ? 'text-success'
                  : 'text-danger'
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Book
