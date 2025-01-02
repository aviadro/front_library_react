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
        <Link className="navbar-brand" to="/">
          Logo
        </Link>
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
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                <i className="bi bi-person-fill"></i> Login
              </Link>
            </li>
            {login && (
              <button onClick={logout} className="btn btn-dark">
                Logout
              </button>
            )}
            {/* Uncomment this if you add the cart feature */}
            {/* <li className="nav-item">
              <Link className="nav-link" to="/cart">
                <i className="bi bi-cart-fill"></i> Cart
              </Link>
            </li> */}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
