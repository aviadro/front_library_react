import React, { useState } from 'react'
import axios from 'axios'

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    city: '',
    age: '',
    phone: '',
    is_active: false,
  })

  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(
        'https://library-django-backend-project.onrender.com/customers/register',
        formData
      )
      setMessage('Registration successful!')
      setFormData({
        username: '',
        email: '',
        password: '',
        city: '',
        age: '',
        phone: '',
        is_active: false,
      })
    } catch (error) {
      setMessage('Registration failed. Please try again.')
      console.error(error)
    }
  }

  return (
    <div className="container mt-5">
      <h2 style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }}>
        Register
      </h2>
      {message && <p className="alert alert-info">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div
          className="mb-3"
          style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }}
        >
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div
          className="mb-3"
          style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }}
        >
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div
          className="mb-3"
          style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }}
        >
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div
          className="mb-3"
          style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }}
        >
          <label htmlFor="city" className="form-label">
            City
          </label>
          <input
            type="text"
            className="form-control"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </div>
        <div
          className="mb-3"
          style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }}
        >
          <label htmlFor="age" className="form-label">
            Age
          </label>
          <input
            type="number"
            className="form-control"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
          />
        </div>
        <div
          className="mb-3"
          style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }}
        >
          <label htmlFor="phone" className="form-label">
            Phone
          </label>
          <input
            type="text"
            className="form-control"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div
          className="form-check mb-3"
          style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }}
        >
          <input
            type="checkbox"
            className="form-check-input"
            id="is_active"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>
    </div>
  )
}

export default Register
