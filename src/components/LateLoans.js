import axios from 'axios'
import { useEffect, useState } from 'react'

function LateLoans({ login }) {
  const [allLateLoans, setAllLateLoans] = useState([])
  const [lateLoans, setLateLoans] = useState([])

  useEffect(() => {
    if (login?.is_admin) {
      getAllLateLoans()
    }
    if (login) {
      getLateLoans()
    }
  }, [login])

  function getLateLoans() {
    if (!login) return
    const authToken = localStorage.getItem('token')
    axios
      .get(
        `https://library-django-backend-project.onrender.com/loans/late_loans/${login.user_id}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
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
        { headers: { Authorization: `Bearer ${authToken}` } }
      )
      .then((response) => {
        setAllLateLoans(response.data)
      })
  }

  return (
    <div className="mt-4">
      {/* All Late Loans Section for Admins */}
      {login?.is_admin && (
        <div>
          <h3 style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }}>
            All Late Loans:
          </h3>
          {allLateLoans.length > 0 ? (
            <ul className="list-group">
              {allLateLoans.map((loan) => (
                <li
                  className="list-group-item"
                  key={loan.id}
                  style={{
                    backgroundColor: 'transparent', // Transparent background
                    border: '1px solid rgba(0, 0, 0, 0.1)', // Optional light border
                  }}
                >
                  <div>
                    <strong>Book:</strong> {loan.book.title} by{' '}
                    {loan.book.author}
                  </div>
                  <div>
                    <strong>Borrower:</strong> {loan.customer.username}
                  </div>
                  <div>
                    <strong>Loan Date:</strong> {loan.loan_date}
                  </div>
                  <div>
                    <strong>Due Date:</strong> {loan.due_date}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }}>
              No late loans available.
            </p>
          )}
        </div>
      )}

      {/* Your Late Loans Section */}
      <div>
        <h3 style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }}>
          Your Late Loans:
        </h3>
        {lateLoans.length > 0 ? (
          <ul className="list-group">
            {lateLoans.map((loan) => (
              <li className="list-group-item" key={loan.id}>
                <div>
                  <strong>Book:</strong> {loan.book.title} by {loan.book.author}
                </div>
                <div>
                  <strong>Loan Date:</strong> {loan.loan_date}
                </div>
                <div>
                  <strong>Due Date:</strong> {loan.due_date}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }}>
            You have no late loans.
          </p>
        )}
      </div>
    </div>
  )
}

export default LateLoans
