export interface SignUpFormData {
  contact: string
  name: string
  password: string
  phone_number: string
  address: string
}

export interface ApiResponse {
  success: boolean
  message: string | string[]
  data?: {
    contact?: string
  }
}
