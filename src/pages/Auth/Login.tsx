import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import logo from '../../assets/ICT.svg'
import hero01 from '../../assets/hero01.jpg'

interface LoginFormData {
  contact: string
  password: string
}

interface LoginApiResponse {
  success: boolean
  message: string | string[]
  data?: {
    user: {
      id: number
      name: string
      contact: string
      role: string
      phone_number?: string
      address?: string
    }
    token: string
  }
}

const apiUrl = import.meta.env.VITE_API_URL + '/api/auth/login'

const loginUser = async (
  formData: LoginFormData,
): Promise<LoginApiResponse> => {
  const response = await axios.post<LoginApiResponse>(apiUrl, formData)
  return response.data
}
export default function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<LoginFormData>({
    contact: '',
    password: '',
  })

  const mutation = useMutation<LoginApiResponse, AxiosError, LoginFormData>({
    mutationFn: loginUser,
    onSuccess: (data: LoginApiResponse) => {
      console.log('Success:', data)
      if (data.success) {
        // Store the token and user data
        localStorage.setItem('token', data.data?.token ?? '')
        localStorage.setItem('user', JSON.stringify(data.data?.user))

        // Navigate based on the user role
        if (
          data.data?.user.role === 'admin' ||
          data.data?.user.role === 'super_admin'
        ) {
          navigate('/admin')
        } else {
          navigate('/')
        }
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
      <div className="flex-1 flex flex-col justify-center p-8 lg:py-12 xl:py-16 relative">
        <Link to="/" className="absolute top-4 left-4">
          <img src={logo} alt="Logo" className="w-24 h-auto" />
        </Link>
        <div className="mx-auto max-w-md">
          <h1 className="text-3xl font-bold text-gray-900">Log In</h1>
          <p className="mt-2 text-gray-600">
            Welcome back! Please enter your credentials to login.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link
                  to="/auth/forgot-password"
                  className="font-medium text-blue-600 hover:text-yellow-600 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
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
                  Logging in...
                </>
              ) : (
                'Log in'
              )}
            </button>
            {mutation.error && (
              <div className="text-red-500 text-sm mt-2">
                {Array.isArray(
                  (mutation.error.response?.data as LoginApiResponse)?.message,
                )
                  ? (
                      (mutation.error.response?.data as LoginApiResponse)
                        ?.message as string[]
                    ).join(', ')
                  : (mutation.error.response?.data as LoginApiResponse)
                      ?.message}
              </div>
            )}
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{' '}
            <Link to="/auth/sign-up" className="text-blue-600 hover:underline hover:text-yellow-600">
              Sign up
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
            Welcome to Islamic Cultural Tourism
          </h2>
          <p className="mt-4 text-lg">
            Explore the rich heritage and cultural wonders of Islamic
            civilization.
          </p>
        </div>
      </div>
    </div>
  )
}
