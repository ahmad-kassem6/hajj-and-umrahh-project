import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import logo from '../../assets/ICT.svg'
import hero01 from '../../assets/hero01.jpg'

interface VerifyResetPasswordFormData {
  contact: string
  code: string
  password: string
}

interface VerifyResetPasswordApiResponse {
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

interface ResendCodeApiResponse {
  success: boolean
  message: string
}

const verifyResetPasswordApiUrl =
  import.meta.env.VITE_API_URL + '/api/auth/verify-reset-password'
const resendCodeApiUrl = import.meta.env.VITE_API_URL + '/api/auth/resend-code'

const verifyResetPassword = async (
  formData: VerifyResetPasswordFormData,
): Promise<VerifyResetPasswordApiResponse> => {
  const response = await axios.post<VerifyResetPasswordApiResponse>(
    verifyResetPasswordApiUrl,
    formData,
  )
  return response.data
}

const resendResetCode = async (
  email: string,
): Promise<ResendCodeApiResponse> => {
  const response = await axios.post<ResendCodeApiResponse>(resendCodeApiUrl, {
    contact: email,
  })
  return response.data
}

export default function VerifyResetPassword() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<VerifyResetPasswordFormData>({
    contact: '',
    code: '',
    password: '',
  })
  const [errorMessages, setErrorMessages] = useState<string[]>([])

  const verifyMutation = useMutation<
    VerifyResetPasswordApiResponse,
    AxiosError<VerifyResetPasswordApiResponse>,
    VerifyResetPasswordFormData
  >({
    mutationFn: verifyResetPassword,
    onSuccess: (data) => {
      console.log('Success:', data)
      if (data.success) {
        alert(
          'Password has been reset successfully. You can now log in with your new password.',
        )
        navigate('/auth/login')
      } else {
        setErrorMessages(
          Array.isArray(data.message) ? data.message : [data.message],
        )
      }
    },
    onError: (error) => {
      console.error('Error during verification:', error)
      const errorMessage =
        error.response?.data?.message ?? 'An error occurred. Please try again.'
      setErrorMessages(
        Array.isArray(errorMessage) ? errorMessage : [errorMessage],
      )
    },
  })

  const resendMutation = useMutation<
    ResendCodeApiResponse,
    AxiosError<ResendCodeApiResponse>,
    string
  >({
    mutationFn: resendResetCode,
    onSuccess: (data) => {
      console.log('Resend Success:', data)
      if (data.success) {
        alert('Verification code resent to your email.')
      } else {
        setErrorMessages([data.message])
      }
    },
    onError: (error) => {
      console.error('Error resending verification code:', error)
      const errorMessage =
        error.response?.data?.message ?? 'An error occurred. Please try again.'
      setErrorMessages(
        Array.isArray(errorMessage) ? errorMessage : [errorMessage],
      )
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    verifyMutation.mutate(formData)
  }

  const handleResendCode = () => {
    resendMutation.mutate(formData.contact)
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
          <h1 className="text-3xl font-bold text-gray-900">
            Verify Reset Password
          </h1>
          <p className="mt-2 text-gray-600">
            Enter the code sent to your email along with your new password.
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
                htmlFor="code"
                className="block text-sm font-medium text-gray-700"
              >
                Verification Code
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="123456"
                className="mt-1 block w-full px-3 px-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="mt-1 block w-full px-3 px-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={verifyMutation.isPending}
              className="w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
            >
              {verifyMutation.isPending ? (
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
                  Verifying...
                </>
              ) : (
                'Verify and Reset Password'
              )}
            </button>
            {errorMessages.length > 0 && (
              <div className="text-red-500 text-sm mt-2">
                {errorMessages.join(', ')}
              </div>
            )}
          </form>
          <div className="text-center text-sm text-gray-600 mt-4">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendMutation.isPending}
              className="text-blue-600 hover:underline hover:text-yellow-600 flex items-center justify-center"
            >
              {resendMutation.isPending ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600"
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
                  Sending...
                </>
              ) : (
                'Resend Code'
              )}
            </button>
          </div>
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
