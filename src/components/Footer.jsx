import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-bottom">
          <p>&copy; {currentYear} Faris Eltayib. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
