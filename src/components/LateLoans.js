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
      .then(async (response) => {
        const lateLoans = response.data

        // Fetch Hebcal data for loan_date and due_date
        const enrichedLoans = await Promise.all(
          lateLoans.map(async (loan) => {
            try {
              // Fetch for loan_date
              const loanDateUrl = `https://www.hebcal.com/hebcal?v=1&cfg=json&start=${loan.loan_date}&end=${loan.loan_date}&d=on`
              const loanDateResponse = await fetch(loanDateUrl)
              const loanDateData = await loanDateResponse.json()
              const loanDateParts = loanDateData.items?.[0]?.heDateParts || {}

              // Fetch for due_date
              const dueDateUrl = `https://www.hebcal.com/hebcal?v=1&cfg=json&start=${loan.due_date}&end=${loan.due_date}&d=on`
              const dueDateResponse = await fetch(dueDateUrl)
              const dueDateData = await dueDateResponse.json()
              const dueDateParts = dueDateData.items?.[0]?.heDateParts || {}

              return {
                ...loan,
                hebcal: {
                  loanDate: {
                    y: loanDateParts.y,
                    m: loanDateParts.m,
                    d: loanDateParts.d,
                  },
                  dueDate: {
                    y: dueDateParts.y,
                    m: dueDateParts.m,
                    d: dueDateParts.d,
                  },
                },
              }
            } catch (error) {
              console.error(
                `Failed to fetch Hebcal data for loan or due date:`,
                error
              )
              return { ...loan, hebcal: null } // Include loan without Hebcal data on failure
            }
          })
        )

        setLateLoans(enrichedLoans)
      })
      .catch((error) => {
        console.error('Error fetching late loans:', error)
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
      .then(async (response) => {
        const lateLoans = response.data

        // Fetch Hebcal data for loan_date and due_date for all loans
        const enrichedLoans = await Promise.all(
          lateLoans.map(async (loan) => {
            try {
              // Fetch for loan_date
              const loanDateUrl = `https://www.hebcal.com/hebcal?v=1&cfg=json&start=${loan.loan_date}&end=${loan.loan_date}&d=on`
              const loanDateResponse = await fetch(loanDateUrl)
              const loanDateData = await loanDateResponse.json()
              const loanDateParts = loanDateData.items?.[0]?.heDateParts || {}

              // Fetch for due_date
              const dueDateUrl = `https://www.hebcal.com/hebcal?v=1&cfg=json&start=${loan.due_date}&end=${loan.due_date}&d=on`
              const dueDateResponse = await fetch(dueDateUrl)
              const dueDateData = await dueDateResponse.json()
              const dueDateParts = dueDateData.items?.[0]?.heDateParts || {}

              return {
                ...loan,
                hebcal: {
                  loanDate: {
                    y: loanDateParts.y,
                    m: loanDateParts.m,
                    d: loanDateParts.d,
                  },
                  dueDate: {
                    y: dueDateParts.y,
                    m: dueDateParts.m,
                    d: dueDateParts.d,
                  },
                },
              }
            } catch (error) {
              console.error(
                `Failed to fetch Hebcal data for loan or due date:`,
                error
              )
              return { ...loan, hebcal: null } // Include loan without Hebcal data on failure
            }
          })
        )

        setAllLateLoans(enrichedLoans)
      })
      .catch((error) => {
        console.error('Error fetching all late loans:', error)
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
                    &nbsp;<strong>Hebrew Date:</strong> {loan.hebcal.loanDate.d}{' '}
                    {loan.hebcal.loanDate.m} {loan.hebcal.loanDate.y}
                  </div>
                  <div>
                    <strong>Due Date:</strong> {loan.due_date}
                    &nbsp;<strong>Hebrew Date:</strong> {loan.hebcal.dueDate.d}{' '}
                    {loan.hebcal.dueDate.m} {loan.hebcal.dueDate.y}
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
                  <strong>Loan Date:</strong> {loan.loan_date}{' '}
                  &nbsp;<strong>Hebrew Date:</strong> {loan.hebcal.loanDate.d}{' '}
                  {loan.hebcal.loanDate.m} {loan.hebcal.loanDate.y}
                </div>
                <div>
                  <strong>Due Date:</strong> {loan.due_date}{' '}
                  &nbsp;<strong>Hebrew Date:</strong> {loan.hebcal.dueDate.d}{' '}
                  {loan.hebcal.dueDate.m} {loan.hebcal.dueDate.y}
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
