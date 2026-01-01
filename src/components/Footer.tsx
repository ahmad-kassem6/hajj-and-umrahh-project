import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaTwitter, FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import logo from '../assets/ICTWHITE.svg'

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  ...props
}) => (
  <button
    {...props}
    className={`px-4 py-2 rounded ${props.className} font-['Times_New_Roman']`}
  >
    {children}
  </button>
)

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
  props,
) => (
  <input
    {...props}
    className={`px-3 py-2 rounded ${props.className} font-['Times_New_Roman']`}
  />
)

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry && entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      {
        threshold: 0.1,
      },
    )

    if (footerRef.current) {
      observer.observe(footerRef.current)
    }

    return () => {
      if (footerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(footerRef.current)
      }
    }
  }, [])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      navigate('/auth/sign-up', { state: { email } })
    } else {
      toast.error('Please enter a valid email address.')
    }
  }

  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleExplorePackagesClick = () => {
    navigate('/', { state: { scrollToPackages: true } })
  }

  return (
    <footer
      ref={footerRef}
      className={`relative bg-black text-white transition-all duration-1000 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
      style={{ fontFamily: 'Times New Roman' }}
    >
      {/* Newsletter Section */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 L100 50 L50 100 L0 50 Z' fill='white'/%3E%3C/svg%3E")`,
            backgroundSize: 'cover',
          }}
        />
        <div className="container mx-auto px-6 py-16 text-center relative z-10">
          <h2 className="text-2xl font-semibold mb-2">JOIN OUR JOURNEY</h2>
          <p className="text-lg mb-6">
            SIGN UP TO GO TO THE HAJJ AND UMRAH WITH US
          </p>
          <form
            onSubmit={handleFormSubmit}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
            aria-labelledby="newsletter-signup"
          >
            <label htmlFor="email-input" className="sr-only">
              Email Address
            </label>
            <Input
              id="email-input"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border border-white text-white placeholder-gray-300 w-full sm:w-64"
            />
            <Button
              type="submit"
              className="border border-white text-white hover:bg-white hover:text-black w-full sm:w-auto"
            >
              SIGN UP
            </Button>
          </form>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-12 flex flex-wrap justify-between gap-8">
        {/* Logo */}
        <div className="flex-1 min-w-[150px]">
          <Link
            to="/"
            className="flex items-center h-full w-full"
            onClick={handleLinkClick}
          >
            <img
              src={logo}
              alt="Logo"
              className="h-40"
              style={{ objectFit: 'contain' }}
            />
          </Link>
        </div>

        {/* Pages */}
        <div className="flex-1 min-w-[150px]">
          <h3 className="font-semibold mb-4">PAGES</h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                onClick={handleLinkClick}
                className="hover:text-yellow-500 hover:underline"
              >
                HOME
              </Link>
            </li>
            <li>
              <Link
                to="/hotels"
                onClick={handleLinkClick}
                className="hover:text-yellow-500 hover:underline"
              >
                HOTELS
              </Link>
            </li>
            <li>
              <Link
                to="/about-us"
                onClick={handleLinkClick}
                className="hover:text-yellow-500 hover:underline"
              >
                ABOUT US
              </Link>
            </li>
            <li>
              <Link
                to="/contact-us"
                onClick={handleLinkClick}
                className="hover:text-yellow-500 hover:underline"
              >
                CONTACT US
              </Link>
            </li>
          </ul>
        </div>

        {/* Our Services */}
        <div className="flex-1 min-w-[150px]">
          <h3 className="font-semibold mb-4">OUR SERVICES</h3>
          <ul className="space-y-2">
            <li>24/7 Support</li>
            <li>We Handle All the Details</li>
            <li>Flights with Turkish Airlines</li>
            <li>Saudi Airlines, and Qatar Airways</li>
          </ul>
        </div>

        {/* Contact Us */}
        <div className="flex-1 min-w-[150px]">
          <h3 className="font-semibold mb-4">CONTACT US</h3>
          <ul className="space-y-2">
            <li>
              Islamic Travel and Cultural LLC <br />
              10400 Eaton Place Fairfax <br />
              Virginia, USA <br />
              Tel: +1 (703) 586-5240
            </li>
          </ul>
        </div>

        {/* Waiting for You */}
        <div className="flex-1 min-w-[150px]">
          <h3 className="font-semibold mb-4">WAITING FOR YOU</h3>
          <p className="text-sm">
            We Are Waiting for You for an Unforgettable Spiritual Journey!
          </p>
          <button
            onClick={handleExplorePackagesClick}
            className="mt-4 inline-block text-white hover:text-yellow-500 hover:underline transition"
          >
            Explore Packages
          </button>
        </div>

        {/* Connect With Us */}
        <div className="flex-1 min-w-[150px]">
          <h3 className="font-semibold mb-4">CONNECT WITH US</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-yellow-500 hover:underline">
              <FaTwitter className="w-5 h-5 ml-1" />
              <span className="sr-only">Twitter</span>
            </a>
            <a href="#" className="hover:text-yellow-500 hover:underline">
              <FaFacebook className="w-5 h-5 ml-1" />
              <span className="sr-only">Facebook</span>
            </a>
            <a href="#" className="hover:text-yellow-500 hover:underline">
              <FaInstagram className="w-5 h-5 ml-1" />
              <span className="sr-only">Instagram</span>
            </a>
            <a href="#" className="hover:text-yellow-500 hover:underline">
              <FaTiktok className="w-5 h-5 ml-1" />
              <span className="sr-only">TikTok</span>
            </a>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </footer>
  )
}
