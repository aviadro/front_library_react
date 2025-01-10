import { useContext, useEffect, useState } from 'react'
import LoginContext from '../LoginContext'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

function BookManagment() {
  const [books, setBooks] = useState([])
  const { login, setLogin } = useContext(LoginContext)
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    description: '',
    published_year: '',
    book_type: '',
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const decoded = jwtDecode(token)
      setLogin(decoded)
    }
  }, [])

  useEffect(() => {
    if (login) {
      getBooks()
    }
  }, [login])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewBook({ ...newBook, [name]: value })
  }
  const handleAddBook = () => {
    if (
      !newBook.title ||
      !newBook.author ||
      !newBook.description ||
      !newBook.published_year ||
      !newBook.book_type
    ) {
      alert('Please fill in all fields.')
      return
    }
    handleAdd(newBook) // Pass the new book data to the parent
    setNewBook({
      title: '',
      author: '',
      description: '',
      published_year: '',
      book_type: '',
    })
  }
  function getBooks() {
    axios
      .get(
        'https://library-django-backend-project.onrender.com/loans/display_books'
      )
      .then((response) => {
        setBooks(response.data)
      })
  }
  const handleUpdateBook = (bookId) => {
    const authToken = localStorage.getItem('token')

    // Fetch the book details to prefill the prompts
    axios
      .get(
        `https://library-django-backend-project.onrender.com/loans/display_book/${bookId}/`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      )
      .then((response) => {
        const book = response.data

        // Prompt the user for each field, prefilled with current values
        const updatedTitle = prompt('Update Title:', book.title) || book.title
        const updatedAuthor =
          prompt('Update Author:', book.author) || book.author
        const updatedDescription =
          prompt('Update Description:', book.description) || book.description
        const updatedPublishedYear =
          parseInt(prompt('Update Published Year:', book.published_year)) ||
          book.published_year
        const updatedBookType =
          parseInt(
            prompt(
              'Update Book Type (1: 10 days, 2: 5 days, 3: 2 days):',
              book.book_type
            )
          ) || book.book_type

        const updatedBook = {
          title: updatedTitle,
          author: updatedAuthor,
          description: updatedDescription,
          published_year: updatedPublishedYear,
          book_type: updatedBookType,
        }

        // Send updated data to the backend
        axios
          .put(
            `https://library-django-backend-project.onrender.com/loans/update_book/${bookId}/ `,
            updatedBook,
            { headers: { Authorization: `Bearer ${authToken}` } }
          )
          .then(() => {
            alert('Book updated successfully!')
            getBooks() // Refresh the book list
          })
          .catch((error) => {
            console.error('Error updating book:', error)
            alert('Failed to update book.')
          })
      })
      .catch((error) => {
        console.error('Error fetching book details:', error)
        alert('Failed to fetch book details.')
      })
  }

  async function onDelete(book_id) {
    try {
      const authToken = localStorage.getItem('token')
      const response = await axios.delete(
        `https://library-django-backend-project.onrender.com/loans/remove_book/${book_id}/ `,
        { headers: { Authorization: `Bearer ${authToken}` } } // Headers as the second argument
      )
      alert('Book deleted successfully!')
    } catch (err) {
      alert('Failed to delete the book. Please try again.')
    }
    getBooks() // Refresh the list of books
  }
  const handleAdd = (newBook) => {
    const authToken = localStorage.getItem('token')
    axios
      .post(
        'https://library-django-backend-project.onrender.com/loans/add_book',
        newBook,
        { headers: { Authorization: `Bearer ${authToken}` } } // Include headers here
      )
      .then(() => {
        alert('Book added successfully!')
        getBooks() // Refresh the list of books
      })
      .catch((error) => {
        console.error('Error adding book:', error)
        alert('Failed to add book.')
      })
  }

  return (
    <div className="container my-4 admin-background">
      <h1
        className="text-center mb-4"
        style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }}
      >
        Book List
      </h1>
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Published Year</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.id}</td>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.published_year}</td>
              <td>{book.isActive ? 'Yes' : 'No'}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm me-2"
                  onClick={() => onDelete(book.id)}
                >
                  Delete
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleUpdateBook(book.id)}
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Book Section */}
      <div className="card mt-4">
        <div className="card-header">Add a New Book</div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                name="title"
                placeholder="Title"
                value={newBook.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                name="author"
                placeholder="Author"
                value={newBook.author}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-12">
              <textarea
                className="form-control"
                name="description"
                placeholder="Description"
                rows="3"
                value={newBook.description}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <div className="col-md-6">
              <input
                type="number"
                className="form-control"
                name="published_year"
                placeholder="Published Year"
                value={newBook.published_year}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-6">
              <select
                className="form-control"
                name="book_type"
                value={newBook.book_type}
                onChange={handleInputChange}
              >
                <option value="">Select Loan Type</option>
                <option value="1">1- 10 days</option>
                <option value="2">2- 5 days</option>
                <option value="3">3- 2 days</option>
                {/* Add more types as needed */}
              </select>
            </div>
            <div className="col-md-12 text-end">
              <button className="btn btn-success" onClick={handleAddBook}>
                Add Book
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookManagment
