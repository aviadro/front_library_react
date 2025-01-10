function About() {
  return (
    <div className="container mt-5 library-background">
      <h1
        className="mb-4"
        style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }}
      >
        About This Library Program
      </h1>
      <p style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }}>
        Welcome to our library program! This application is designed to help
        manage books, loans, and members efficiently. It's built using modern
        technologies and aims to provide a seamless user experience.
      </p>
      <p style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }}> 
        <strong>Technologies Used:</strong>
        <ul>
          <li>
            <strong>Frontend:</strong> React
          </li>
          <li>
            <strong>Backend:</strong> Django
          </li>
        </ul>
      </p>
      <p style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }}>
        This project was developed by <strong>Aviad Roichman</strong> as part of
        a Fullstack Python course at <strong>John Bryce</strong> during the year{' '}
        <strong>2024-2025</strong>. The course was led by{' '}
        <strong>Ran Erlich</strong>, who provided adequate guidance throughout
        the program.
      </p>
      <p style={{ color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }}>
        Thank you for exploring our library system. We hope you find it useful
        and easy to use!
      </p>
    </div>
  )
}

export default About
