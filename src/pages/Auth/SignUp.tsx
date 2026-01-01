import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import hero01 from '../../assets/hero01.jpg'
import logo from '../../assets/ICT.svg'
import axios, { AxiosError } from 'axios'

interface FormData {
  name: string
  contact: string
  password: string
  phone_number: string
  address: string
}

interface ApiResponse {
  success: boolean
  message: string | string[]
  data?: {
    contact: string
  }
}

const apiUrl = import.meta.env.VITE_API_URL + '/api/auth/register'

const registerUser = async (formData: FormData): Promise<ApiResponse> => {
  const response = await axios.post<ApiResponse>(apiUrl, formData)
  return response.data
}

export default function SignUp() {
  const location = useLocation()
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    contact: location.state?.email || '',
    password: '',
    phone_number: '',
    address: '',
  })

  const mutation = useMutation<ApiResponse, AxiosError, FormData>({
    mutationFn: registerUser,
    onSuccess: (data: ApiResponse) => {
      console.log('Success:', data)
      if (data.success) {
        navigate('/auth/verify-account', { state: { email: formData.contact } })
      }
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Column */}
      <div className="flex-1 p-8 lg:pt-16 lg:pb-8 xl:pt-20 xl:pb-4 xl:px-16 relative">
        <Link to="/" className="absolute top-4 left-4">
          <img src={logo} alt="Logo" className="w-24 h-auto" />
        </Link>
        <div className="mx-auto max-w-md mt-32 lg:mt-0">
          <h1 className="text-3xl font-bold text-gray-900">Sign Up</h1>
          <p className="mt-2 text-gray-600">
            {' '}
            Create your account to get started.{' '}
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="contact"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="john.doe@example.com"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="phone_number"
                className="block text-sm font-medium text-gray-700"
              >
                Phone number
              </label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main St, City, Country"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
            >
              {mutation.isPending ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                'Create an account'
              )}
            </button>
            {mutation.error && (
              <div className="text-red-500 text-sm mt-2">
                {Array.isArray(
                  (mutation.error.response?.data as ApiResponse)?.message,
                )
                  ? (
                      (mutation.error.response?.data as ApiResponse)
                        ?.message as string[]
                    ).join(', ')
                  : (mutation.error.response?.data as ApiResponse)?.message}
              </div>
            )}
          </form>
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-blue-600 hover:underline hover:text-yellow-600">
              Login
            </Link>
          </p>
        </div>
      </div>
      {/* Right Column */}
      <div
        className="hidden lg:block lg:flex-1 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${hero01})` }}
      >
        <div className="h-full p-12 xl:p-16 flex flex-col justify-end bg-black bg-opacity-50 text-white">
          <h2 className="text-4xl font-bold">
            Start growing your skills quickly
          </h2>
          <p className="mt-4 text-lg">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minus
            assumenda aliquam deserunt dolores velit sapiente praesentium
            aperiam sint.
          </p>
        </div>
      </div>
    </div>
  )
}
