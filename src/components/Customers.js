import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import LoginContext from '../LoginContext'
import { jwtDecode } from 'jwt-decode'

function Customers() {
  const [customers, setCustomers] = useState([])
  const { login, setLogin } = useContext(LoginContext)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const decoded = jwtDecode(token)
      setLogin(decoded)
    }
  }, [])

  useEffect(() => {
    if (login) {
      getCustomers()
    }
  }, [login])

  function getCustomers() {
    const authToken = localStorage.getItem('token')
    axios
      .get(
        'https://library-django-backend-project.onrender.com/customers/display_customers',
        { headers: { Authorization: `Bearer ${authToken}` } } // Headers
      )
      .then((response) => {
        setCustomers(response.data)
      })
  }
  // Handle Remove customer
  const handleRemove = async (customerId) => {
    try {
      await axios.delete(
        `https://library-django-backend-project.onrender.com/customers/remove_customer/${customerId}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      alert('Customer removed successfully.')
      getCustomers() // Refresh the list
    } catch (error) {
      alert('Failed to remove customer.')
      console.error(error)
    }
  }

  // Handle Update customer
  const handleUpdate = async (customer) => {
    const updatedCity =
      prompt('Enter new city:', customer.city) || customer.city
    const updatedAge =
      parseInt(prompt('Enter new age:', customer.age)) || customer.age
    const updatedPhone =
      prompt('Enter new phone:', customer.phone) || customer.phone
    const updatedEmail =
      prompt('Enter new email:', customer.email) || customer.email
    // eslint-disable-next-line no-restricted-globals
    const updatedIsActive = confirm('Is the customer active?') ? true : false

    const updatedCustomer = {
      ...customer,
      city: updatedCity,
      age: updatedAge,
      phone: updatedPhone,
      email: updatedEmail,
      is_active: updatedIsActive,
    }

    try {
      await axios.put(
        `https://library-django-backend-project.onrender.com/customers/update_customer/${customer.id}/`,
        updatedCustomer,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      alert('Customer updated successfully.')
      getCustomers() // Refresh the list
    } catch (error) {
      alert('Failed to update customer.')
      console.error(error)
    }
  }
  return (
    <div className="container mt-5 admin-background">
      <h2
        className="mb-4"
        style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }}
      >
        Customers List
      </h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Is Staff</th>
            <th>City</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Date Joined</th>
            <th>Last Login</th>
            <th>Is Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.username}</td>
              <td>{customer.is_staff ? 'Yes' : 'No'}</td>
              <td>{customer.city || 'N/A'}</td>
              <td>{customer.age || 'N/A'}</td>
              <td>{customer.phone || 'N/A'}</td>
              <td>{customer.email || 'N/A'}</td>
              <td>{new Date(customer.date_joined).toLocaleDateString()}</td>
              <td>
                {customer.last_login
                  ? new Date(customer.last_login).toLocaleDateString()
                  : 'N/A'}
              </td>
              <td>{customer.is_active ? 'Yes' : 'No'}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm me-2"
                  onClick={() => handleRemove(customer.id)}
                >
                  Remove
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleUpdate(customer)}
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Customers
