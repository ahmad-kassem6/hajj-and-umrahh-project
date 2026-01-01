import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import logo from '../../assets/ICT.svg'
import hero01 from '../../assets/hero01.jpg'

interface ForgotPasswordFormData {
  contact: string
}

interface ForgotPasswordApiResponse {
  success: boolean
  message: string | string[]
  data?: {
    contact: string
  }
}

const apiUrl = import.meta.env.VITE_API_URL + '/api/auth/forget-password'

const forgotPassword = async (
  formData: ForgotPasswordFormData,
): Promise<ForgotPasswordApiResponse> => {
  const response = await axios.post<ForgotPasswordApiResponse>(apiUrl, formData)
  return response.data
}

export default function ForgotPW() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  const mutation = useMutation<
    ForgotPasswordApiResponse,
    AxiosError,
    ForgotPasswordFormData
  >({
    mutationFn: forgotPassword,
    onSuccess: (data: ForgotPasswordApiResponse) => {
      console.log('Success:', data)
      if (data.success) {
        // Navigate to the verify reset password page
        navigate('/auth/verify-reset-password')
      }
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({ contact: email })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Column */}
      <div className="flex-1 flex flex-col justify-center p-8 lg:py-12 xl:py-16 relative">
        <Link to="/" className="absolute top-4 left-4">
          <img src={logo} alt="Logo" className="w-24 h-auto" />
        </Link>
        <div className="mx-auto max-w-md">
          <h1 className="text-3xl font-bold text-gray-900">Forgot Password</h1>
          <p className="mt-2 text-gray-600">
            Enter your email address and we'll send you instructions to reset
            your password.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="john.doe@example.com"
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
                  Sending instructions...
                </>
              ) : (
                'Send Reset Instructions'
              )}
            </button>
            {mutation.error && (
              <div className="text-red-500 text-sm mt-2">
                {Array.isArray(
                  (mutation.error.response?.data as ForgotPasswordApiResponse)
                    ?.message,
                )
                  ? (
                      (
                        mutation.error.response
                          ?.data as ForgotPasswordApiResponse
                      )?.message as string[]
                    ).join(', ')
                  : (mutation.error.response?.data as ForgotPasswordApiResponse)
                      ?.message}
              </div>
            )}
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            Remembered your password?{' '}
            <Link to="/auth/login" className="text-blue-600 hover:underline hover:text-yellow-600">
              Log In
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
