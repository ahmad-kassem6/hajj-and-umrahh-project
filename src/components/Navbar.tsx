import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import BurgerMenu from '@/components/BurgerMenu'
import MobNavBar from '@/components/MobNavBar'
import { FaUserCircle } from 'react-icons/fa'
import logoWhite from '../assets/ICTWHITE.svg'
import logoColor from '../assets/ICT.svg'
import axios from 'axios'

const navigationItems = [
  { label: 'HOME', to: '/' },
  { label: 'HOTELS', to: '/hotels' },
  { label: 'ABOUT US', to: '/about-us' },
  { label: 'CONTACT US', to: '/contact-us' },
]
export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState('')
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen((prev) => !prev)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [location.pathname])

  useEffect(() => {
    // Check if the user is logged in and retrieve their role
    const token = localStorage.getItem('token')
    if (token) {
      setIsLoggedIn(true)
      // Fetch user data from the API
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUserRole(response.data.data.role)
        })
        .catch((error) => {
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
        },
      )
      localStorage.removeItem('token')
      setIsLoggedIn(false)
      setUserRole('')
      setIsProfileMenuOpen(false)
      navigate('/auth/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const displayLogo = isScrolled ? logoColor : logoWhite
  const profileIconColor = isScrolled ? 'text-black' : 'text-white'

  return (
    <>
      <header
        className={cn(
          'hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-150',
          isScrolled ? 'bg-white shadow-md text-black' : 'text-white',
          'w-full',
        )}
        style={{
          boxShadow: isScrolled
            ? '0px 4px 6px rgba(0, 0, 0, 0.1), 4px 0px 6px rgba(0, 0, 0, 0.1)'
            : 'none',
        }}
      >
        <div className="w-full px-4 flex">
          <div className="flex-shrink-0 w-24">
            <Link to="/" className="block h-full">
              <img
                src={displayLogo}
                alt="Logo"
                className="w-full h-full object-contain transition-all duration-150"
              />
            </Link>
          </div>
          <div className="flex-grow flex flex-col justify-between py-4">
            <div className="flex items-center justify-between">
              <div className="flex-grow" />
              <h1
                className="text-lg whitespace-nowrap"
                style={{ fontFamily: 'Times New Roman, serif' }}
              >
                ISLAMIC CULTURAL TOURISM
              </h1>
              <div className="flex-grow flex items-center justify-end">
                {isLoggedIn ? (
                  <div className="relative">
                    <button
                      className="flex items-center gap-2"
                      onClick={toggleProfileMenu}
                    >
                      <FaUserCircle className={`w-8 h-8 ${profileIconColor}`} />
                    </button>
                    {isProfileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                        <ul className="py-1">
                          {(userRole === 'admin' ||
                            userRole === 'super_admin') && (
                            <li>
                              <Link
                                to="/admin"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setIsProfileMenuOpen(false)} // Close the menu on click
                              >
                                Dashboard
                              </Link>
                            </li>
                          )}
                          <li>
                            <Link
                              to="/profile"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setIsProfileMenuOpen(false)} // Close the menu on click
                            >
                              My Profile
                            </Link>
                          </li>
                          <li>
                            <button
                              onClick={handleLogout}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              Logout
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="hidden lg:flex gap-4">
                    <Link to="/auth/login">
                      <Button className="w-24 border border-black text-primary bg-primary-foreground hover:bg-black hover:text-white transition-colors duration-300">
                        Log In
                      </Button>
                    </Link>
                  </div>
                )}
                <BurgerMenu
                  isMenuOpen={isMenuOpen}
                  toggleMenu={toggleMenu}
                  menuItems={navigationItems}
                />
              </div>
            </div>
            <div className="relative flex items-center mt-2">
              <div className="flex-grow h-px bg-current opacity-50" />
            </div>
            <nav className="flex justify-center items-center lg:flex mr-20 lg:justify-center lg:gap-8 pt-4">
              <ul className="flex justify-center lg:justify-start gap-8">
                {navigationItems.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className={cn(
                        'text-base tracking-wider transition-colors duration-300',
                        'hover:text-yellow-500 hover:underline',
                      )}
                      style={{ display: 'inline-block' }}
                      onClick={() => {
                        window.scrollTo({
                          top: 0,
                          behavior: 'smooth',
                        })
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <MobNavBar
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        menuItems={navigationItems}
      />
    </>
  )
}
