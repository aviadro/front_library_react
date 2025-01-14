import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import LoginContext from '../LoginContext'
import { jwtDecode } from 'jwt-decode'
import LoansDisplay from './LoansDisplay'

function LoanManagment() {
  const [loans, setLoans] = useState([])
  const [myLoans, setMyLoans] = useState([])
  const { login, setLogin } = useContext(LoginContext)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const decoded = jwtDecode(token)
      setLogin(decoded)
    }
  }, [])

  useEffect(() => {
    if (login?.is_admin) {
      getLoans()
    }
    if (login && !login.is_admin) {
      getMyLoans()
    }
  }, [login])

  function getLoans() {
    console.log('login', login)
    if (!login) return
    const authToken = localStorage.getItem('token')
    axios
      .get(
        `https://library-django-backend-project.onrender.com/loans/display_loans`,
        { headers: { Authorization: `Bearer ${authToken}` } } // Headers
      )
      .then((response) => {
        setLoans(response.data)
      })
  }
  function getMyLoans() {
    console.log("******")
    console.log('login', login)
    if (!login) return
    const authToken = localStorage.getItem('token')
    axios
      .get(
        `https://library-django-backend-project.onrender.com/loans/customer/${login.user_id}`,
        { headers: { Authorization: `Bearer ${authToken}` } } // Headers
      )
      .then((response) => {
        setMyLoans(response.data)
      })
  }
  return (
    <div className="container mt-5 ">
      <h2
        className="mb-4"
        style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }}
      >
        Loan Management
      </h2>

      {/* Display admin loans if the user is an admin */}
      {login?.is_admin && loans.active_loans && (
        <div>
          <h3 style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }}>
            All Loans
          </h3>
          <LoansDisplay loans={loans} />
        </div>
      )}

      {/* Display customer-specific loans if the user is not an admin */}
      {!login?.is_admin && myLoans.active_loans && (
        <div>
          <h3 style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }}>
            My Loans
          </h3>
          <LoansDisplay loans={myLoans} />
        </div>
      )}
    </div>
  )
}

export default LoanManagment
