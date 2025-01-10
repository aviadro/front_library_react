import axios from 'axios'
import React from 'react'

const LoansDisplay = ({ loans, onReturn }) => {
  const { active_loans, inactive_loans } = loans

  // Handler for returning a book
  const handleReturn = (loanId) => {
    const authToken = localStorage.getItem('token')

    axios
      .post(
        `https://library-django-backend-project.onrender.com/loans/return_book`,
        { loan_id: loanId }, // Request body
        { headers: { Authorization: `Bearer ${authToken}` } } // Headers
      )
      .then((response) => {
        alert('Book returned successfully!')
        window.location.reload() // Refresh the page to update the loan list
      })
      .catch((error) => {
        console.error('Error returning book:', error)
        alert('Failed to return the book. Please try again.')
      })
  }

  return (
    <div className="container mt-5">
      <h2
        className="mb-4"
        style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }}
      >
        Loans
      </h2>

      {/* Active Loans Section */}
      <div className="mb-5">
        <h3 style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }}>
          Active Loans
        </h3>
        {active_loans.length > 0 ? (
          <div className="row">
            {active_loans.map((loan) => (
              <div className="col-md-6 mb-4" key={loan.id}>
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{loan.book.title}</h5>
                    <p className="card-text">
                      <strong>Author:</strong> {loan.book.author} <br />
                      <strong>Borrower:</strong> {loan.customer.username} <br />
                      <strong>Loan Date:</strong> {loan.loan_date} <br />
                      <strong>Due Date:</strong>{' '}
                      <span
                        style={{
                          color:
                            new Date(loan.due_date) < new Date()
                              ? 'red'
                              : 'inherit',
                        }}
                      >
                        {loan.due_date}
                      </span>{' '}
                      <br />
                      <strong>Status:</strong>{' '}
                      {loan.is_active ? 'Active' : 'Returned'} <br />
                    </p>
                    <button
                      className="btn btn-primary mt-2"
                      onClick={() => handleReturn(loan.id)}
                    >
                      Return Book
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No active loans available.</p>
        )}
      </div>

      {/* Inactive Loans Section */}
      <div>
        <h3 style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }}>
          Inactive Loans
        </h3>
        {inactive_loans.length > 0 ? (
          <div className="row">
            {inactive_loans.map((loan) => (
              <div className="col-md-6 mb-4" key={loan.id}>
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{loan.book.title}</h5>
                    <p className="card-text">
                      <strong>Author:</strong> {loan.book.author} <br />
                      <strong>Borrower:</strong> {loan.customer.username} <br />
                      <strong>Loan Date:</strong> {loan.loan_date} <br />
                      <strong>Due Date:</strong> {loan.due_date} <br />
                      <strong>Return Date:</strong> {loan.return_date} <br />
                      <strong>Status:</strong>{' '}
                      {loan.is_active ? 'Active' : 'Returned'} <br />
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No inactive loans available.</p>
        )}
      </div>
    </div>
  )
}

export default LoansDisplay
