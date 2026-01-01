import * as React from 'react'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import axios from 'axios'

interface MenuItem {
  label: string
  to: string
}

interface BurgerMenuProps {
  isMenuOpen: boolean
  toggleMenu: () => void
  menuItems: MenuItem[]
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({
  isMenuOpen,
  toggleMenu,
  menuItems,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsLoggedIn(true)
      // Fetch user role
      axios.get(`${import.meta.env.VITE_API_URL}/api/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => {
        setUserRole(response.data.data.role)
      })
      .catch(error => {
        console.error('Failed to get user role:', error)
      })
    }
  }, [])

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      localStorage.removeItem('token')
      setIsLoggedIn(false)
      setUserRole('')
      toggleMenu()
      navigate('/auth/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="lg:hidden">
      <button
        onClick={toggleMenu}
        className="sm:block"
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isMenuOpen}
      >
        {isMenuOpen ? (
          <X className="h-6 w-6 text-black" />
        ) : (
          <Menu className="h-6 w-6 text-black" />
        )}
      </button>
      <div
        className={`
          sm:block 
          fixed top-0 left-0 w-[70%] h-full bg-white shadow-md
          transition-transform duration-700 ease-in-out transform
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <nav className="flex flex-col p-4 text-black">
          <button
            onClick={toggleMenu}
            className="self-end mb-4"
            aria-label="Close menu"
          >
            <X className="h-6 w-6 text-black" />
          </button>

          {/* Navigation Links */}
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="py-3 ml-1  text-base tracking-wider hover:text-yellow-500 hover:underline transition-colors duration-300"
              onClick={toggleMenu}
            >
              {item.label}
            </Link>
          ))}

          {/* Auth Section */}
          {isLoggedIn ? (
            <div className="mt-4 pt-4 border-t border-gray-200">
              {(userRole === 'admin' || userRole === 'super_admin') && (
                <Link
                  to="/admin"
                  className="block py-3 text-base tracking-wider hover:text-yellow-500 hover:underline transition-colors duration-300"
                  onClick={toggleMenu}
                >
                  DASHBOARD
                </Link>
              )}
              <Link
                to="/profile"
                className="block py-3 text-base tracking-wider hover:text-yellow-500 hover:underline transition-colors duration-300"
                onClick={toggleMenu}
              >
                MY PROFILE
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left py-3 text-base tracking-wider text-red-600 hover:text-red-700 hover:underline transition-colors duration-300"
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <Link 
              to="/auth/login" 
              onClick={toggleMenu}
              className="mt-4 block"
            >
              <Button className="w-full border border-black text-primary bg-primary-foreground hover:bg-black hover:text-white transition-colors duration-300">
                Log In
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </div>
  )
}

export default BurgerMenu
