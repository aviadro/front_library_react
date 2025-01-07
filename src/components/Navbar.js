import { useContext } from 'react'
import { Link } from 'react-router-dom'
import LoginContext from '../LoginContext'

function Navbar() {
  const { login, setLogin } = useContext(LoginContext)

  function logout() {
    setLogin(null)
    localStorage.removeItem('token')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Left-aligned links */}
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link no-wrap" aria-current="page" to="/loans">
                Loan Managment
              </Link>
            </li>
            {login?.is_admin && (
              <li className="nav-item">
                <Link className="nav-link no-wrap" to="/booksM">
                  <i className="bi bi-person-fill"></i> Book Managment (Admin)
                </Link>
              </li>
            )}
            {login?.is_admin && (
              <li className="nav-item">
                <Link className="nav-link no-wrap" to="/customers">
                  <i className="bi bi-person-fill"></i> Customer Managment (Admin)
                </Link>
              </li>
            )}
          </ul>
          {/* Centered Welcome Message */}
          {login && (
            <div className="d-flex justify-content-center w-100">
              <span className="navbar-text text-white">
                Welcome, {login.username || 'User'}!{' '}
                {login.is_admin ? ', (admin)' : ''}
              </span>
            </div>
          )}

          {/* Right-aligned Login/Logout */}
          <ul className="navbar-nav ms-auto">
            {login?.is_admin && (
              <li className="nav-item">
                <Link className="nav-link" to="/register">
                  <i className="bi bi-person-fill"></i> Register
                </Link>
              </li>
            )}

            {login ? (
              <li className="nav-item">
                <button onClick={logout} className="btn btn-dark">
                  Logout
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  <i className="bi bi-person-fill"></i> Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
