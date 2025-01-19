import axios from 'axios'
import React, { useEffect, useState } from 'react'

const LoansDisplay = ({ loans, onReturn }) => {
  const { active_loans, inactive_loans } = loans

  // Function to fetch Hebrew date from Hebcal API
  const fetchHebrewDate = async (date) => {
    try {
      const response = await axios.get(
        `https://www.hebcal.com/hebcal?v=1&cfg=json&start=${date}&end=${date}&d=on`
      )
      const heDateParts = response.data.items?.[0]?.heDateParts
      if (heDateParts) {
        const { y, m, d } = heDateParts
        return `${d}-${m}-${y}` // Format the Hebrew date as "year-month-day"
      }
      return 'Unavailable'
    } catch (error) {
      console.error('Error fetching Hebrew date:', error)
      return 'Error'
    }
  }

  // State to store Hebrew dates for active and inactive loans
  const [hebrewDates, setHebrewDates] = useState({
    loanDates: {},
    dueDates: {},
    returnDates: {}
  })

  // Fetch Hebrew dates for all loans
  useEffect(() => {
    const fetchDates = async () => {
      const loanDates = {}
      const dueDates = {}
      const returnDates = {}
      for (const loan of [...active_loans, ...inactive_loans]) {
        loanDates[loan.id] = await fetchHebrewDate(loan.loan_date)
        dueDates[loan.id] = await fetchHebrewDate(loan.due_date)
        if (loan.return_date) { // Check if return_date exists
          returnDates[loan.id] = await fetchHebrewDate(loan.return_date)
        }
      }
      setHebrewDates({ loanDates, dueDates, returnDates  })
    }
    fetchDates()
  }, [active_loans, inactive_loans])

  // Handler for returning a book
  const handleReturn = (loanId) => {
    const authToken = localStorage.getItem('token')

    axios
      .post(
        `https://library-django-backend-project.onrender.com/loans/return_book`,
        { loan_id: loanId }, // Request body
        { headers: { Authorization: `Bearer ${authToken}` } } // Headers
      )
      .then(() => {
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
                      <strong>Loan Date (Gregorian):</strong> {loan.loan_date} <br />
                      <strong>Loan Date (Hebrew):</strong>{' '}
                      {hebrewDates.loanDates[loan.id] || 'Loading...'} <br />
                      <strong>Due Date (Gregorian):</strong> {loan.due_date} <br />
                      <strong>Due Date (Hebrew):</strong>{' '}
                      {hebrewDates.dueDates[loan.id] || 'Loading...'} <br />
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
          Inactive Loans records (History)
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
                      <strong>Loan Date (Gregorian):</strong> {loan.loan_date} <br />
                      <strong>Loan Date (Hebrew):</strong>{' '}
                      {hebrewDates.loanDates[loan.id] || 'Loading...'} <br />
                      <strong>Due Date (Gregorian):</strong> {loan.due_date} <br />
                      <strong>Due Date (Hebrew):</strong>{' '}
                      {hebrewDates.dueDates[loan.id] || 'Loading...'} <br />
                      <strong>Return Date (Gregorian):</strong> {loan.return_date || 'N/A'} <br />
                      <strong>Return Date (Hebrew):</strong> {hebrewDates.returnDates[loan.id] || 'Loading...'} <br />
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
