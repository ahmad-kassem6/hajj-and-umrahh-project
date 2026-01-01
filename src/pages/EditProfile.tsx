import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Types
interface ProfileData {
  id: number
  name: string
  contact: string
  role: string
  phone_number?: string
  address?: string
}

interface HeroImage {
  path: string;
}

// API functions
async function fetchProfile(): Promise<ProfileData> {
  const token = localStorage.getItem('token')
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const data = await response.json()
  if (!data.success) {
    throw new Error(data.message)
  }
  return data.data
}

async function updateProfile(
  profileData: Partial<ProfileData>,
): Promise<{ success: boolean; message: string | string[] }> {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('No authorization token found')
  }

  const formData = new FormData()
  formData.append('_method', 'PUT')
  if (profileData.name) formData.append('name', profileData.name)
  if (profileData.address) formData.append('address', profileData.address)
  if (profileData.phone_number)
    formData.append('phone_number', profileData.phone_number)

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/me/profile`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
  )

  const data = await response.json()
  return data
}

async function changePassword(
  oldPassword: string,
  newPassword: string,
): Promise<{ success: boolean; message: string }> {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('No authorization token found')
  }

  const formData = new FormData()
  formData.append('_method', 'PUT')
  formData.append('old_password', oldPassword)
  formData.append('new_password', newPassword)

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/me/password`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
  )

  const data = await response.json()
  return data
}
// Main component
export default function EditProfile() {
  const [profileMessage, setProfileMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [passwordMessage, setPasswordMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  const {
    data: profile,
    error: queryError,
    isLoading,
  } = useQuery<ProfileData, Error>({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  })

  const { data: heroImages, isLoading: isHeroImagesLoading, error: heroImagesError } = useQuery<HeroImage[]>({
    queryKey: ['heroImages', 'editProfile'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/hero-images/edit-profile`)
      return response.data.data
    },
  });

  useEffect(() => {
    if (!heroImages?.length) return;

    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => 
        prev === heroImages.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [heroImages]);

  const updateProfileMutation = useMutation<
    { success: boolean; message: string | string[] },
    Error,
    Partial<ProfileData>
  >({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      if (data.success) {
        setProfileMessage({
          type: 'success',
          text: 'Profile updated successfully',
        })
      } else {
        setProfileMessage({
          type: 'error',
          text: Array.isArray(data.message)
            ? data.message.join(', ')
            : data.message,
        })
      }
    },
    onError: (error: Error) => {
      setProfileMessage({
        type: 'error',
        text: error.message || 'Failed to update profile',
      })
      console.error('Failed to update profile', error)
    },
  })

  const changePasswordMutation = useMutation<
    { success: boolean; message: string },
    Error,
    { oldPassword: string; newPassword: string }
  >({
    mutationFn: ({ oldPassword, newPassword }) =>
      changePassword(oldPassword, newPassword),
    onSuccess: (data) => {
      if (data.success) {
        setPasswordMessage({
          type: 'success',
          text: 'Password changed successfully',
        })
      } else {
        setPasswordMessage({ type: 'error', text: data.message })
      }
    },
    onError: (error: Error) => {
      setPasswordMessage({
        type: 'error',
        text: error.message || 'Failed to change password',
      })
      console.error('Failed to change password', error)
    },
  })

  const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setProfileMessage(null)

    const formData = new FormData(e.currentTarget)
    const profileData: Partial<ProfileData> = {
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      phone_number: formData.get('phone_number') as string,
    }

    updateProfileMutation.mutate(profileData)
  }

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPasswordMessage(null)

    const formData = new FormData(e.currentTarget)
    const oldPassword = formData.get('old_password') as string
    const newPassword = formData.get('new_password') as string
    const confirmPassword = formData.get('confirm_password') as string

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' })
    } else {
      changePasswordMutation.mutate({ oldPassword, newPassword })
    }
  }

  if (queryError || heroImagesError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-700 p-4">
          {queryError?.message || heroImagesError?.message}
        </div>
      </div>
    )
  }

  if (isLoading || isHeroImagesLoading) {
    return (
      <div className="min-h-screen">
        <div className="relative h-[500px]">
          {heroImages?.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentHeroIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img 
                src={image.path} 
                alt={`Hero ${index + 1}`} 
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent z-0"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-transparent z-0"></div>
              <div className="absolute inset-0 bg-gradient-to-l from-black/10 via-black/10 to-transparent z-0"></div>
            </div>
          ))}

          {/* Dots navigation */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {heroImages?.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentHeroIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentHeroIndex 
                    ? 'bg-white w-4' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold mb-8">Edit Profile</h2>
            <div className="bg-white p-8 rounded-lg shadow animate-pulse">
              <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                    <div className="h-10 w-full bg-gray-200 rounded"></div>
                  </div>
                ))}
                <div className="h-10 w-32 bg-gray-200 rounded mt-8"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen">
      <div className="relative h-[500px]">
        {heroImages?.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentHeroIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={image.path} 
              alt={`Hero ${index + 1}`} 
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent z-0"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-transparent z-0"></div>
            <div className="absolute inset-0 bg-gradient-to-l from-black/10 via-black/10 to-transparent z-0"></div>
          </div>
        ))}

        {/* Dots navigation */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {heroImages?.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentHeroIndex 
                  ? 'bg-white w-4' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-center mb-8">
          Edit Profile
        </h2>

        <form onSubmit={handleProfileSubmit} className="space-y-6 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <label htmlFor="name" className="block text-sm mb-2">
                Name
              </label>
              <Input
                type="text"
                name="name"
                id="name"
                defaultValue={profile?.name}
                minLength={3}
                maxLength={30}
                required
              />
            </div>

            <div>
              <label htmlFor="phone_number" className="block text-sm mb-2">
                Phone Number
              </label>
              <Input
                type="tel"
                name="phone_number"
                id="phone_number"
                defaultValue={profile?.phone_number}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm mb-2">
              Address
            </label>
            <Input
              type="text"
              name="address"
              id="address"
              defaultValue={profile?.address}
              minLength={3}
              maxLength={255}
              required
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="w-full bg-[#18181B] text-white hover:bg-[#27272A]"
            >
              {updateProfileMutation.isPending
                ? 'Updating Profile...'
                : 'Update Profile'}
            </Button>
          </div>

          {profileMessage && (
            <div
              className={`mt-4 p-2 rounded ${profileMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
            >
              {profileMessage.text}
            </div>
          )}
        </form>

        <div className="border-t pt-8">
          <h3 className="text-xl font-semibold mb-6">Change Password</h3>
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label htmlFor="old_password" className="block text-sm mb-2">
                Current Password
              </label>
              <Input
                type="password"
                name="old_password"
                id="old_password"
                minLength={6}
                required
              />
            </div>

            <div>
              <label htmlFor="new_password" className="block text-sm mb-2">
                New Password
              </label>
              <Input
                type="password"
                name="new_password"
                id="new_password"
                minLength={6}
                required
              />
            </div>

            <div>
              <label htmlFor="confirm_password" className="block text-sm mb-2">
                Confirm New Password
              </label>
              <Input
                type="password"
                name="confirm_password"
                id="confirm_password"
                minLength={6}
                required
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={changePasswordMutation.isPending}
                className="w-full bg-[#18181B] text-white hover:bg-[#27272A]"
              >
                {changePasswordMutation.isPending
                  ? 'Changing Password...'
                  : 'Change Password'}
              </Button>
            </div>

            {passwordMessage && (
              <div
                className={`mt-4 p-2 rounded ${passwordMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
              >
                {passwordMessage.text}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
