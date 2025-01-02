import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import LoginContext from '../LoginContext'
import {jwtDecode} from 'jwt-decode'

function Login() {
  const [username, setName] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { login, setLogin } = useContext(LoginContext)

  async function handleLogin(event) {
    event.preventDefault(); // Prevent page refresh
  
    try {
      const response = await axios.post('https://library-django-backend-project.onrender.com/login', {
        username,
        password,
      });
  
      console.log('Response Data:', response.data); // Debugging
  
      if (response.status === 200) {
        const token = response.data.access;
        if (!token || typeof token !== 'string') {
          console.error('Invalid token:', token);
          alert('Login failed. Invalid token received.');
          return;
        }
  
        const decodedToken = jwtDecode(token); // Decode the JWT
        console.log('Decoded Token:', decodedToken);
  
        localStorage.setItem('token', token); // Save token to localStorage
        setLogin(decodedToken); // Update LoginContext
        navigate('/'); // Redirect to home page
      } else {
        console.error('Login failed');
        alert('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again.');
    }
  }
  

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Name:</label>
          <input
            type="text"
            id="username"
            className="form-control"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            className="form-control"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  )
}

export default Login
