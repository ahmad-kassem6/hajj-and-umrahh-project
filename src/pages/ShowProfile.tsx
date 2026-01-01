import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'

// Add interface for the hero images response
interface HeroImage {
  path: string
}

interface ProfileData {
  id: number
  name: string
  contact: string
  role: string
  phone_number?: string
  address?: string
}

interface Reservation {
  id: number
  status: 'pending' | 'confirmed' | 'canceled'
  number_of_tickets: number
  trip_id: number
  canceled_by?: {
    id: number
    name: string
    contact: string
    actor: string
  }
  trip?: {
    id: number
    name: string
    price: number
    start_date: string
    end_date: string
  }
}

interface ReservationDetails {
  id: number
  status: string
  number_of_tickets: number
  trip_id: number
  canceled_by?: {
    id: number
    name: string
    contact: string
    actor: string
  }
  user: {
    id: number
    name: string
    contact: string
    phone_number: string
    address: string
  }
  trip: {
    id: number
    name: string
    price: number
    is_active: number
    start_date: string
    end_date: string
    description: string | null
    image: string | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hotels: any[]
  }
}
interface ReservationDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  details: ReservationDetails | null
}
function ReservationDetailsModal({
  isOpen,
  onClose,
  details,
}: ReservationDetailsModalProps) {
  if (!isOpen || !details) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Reservation Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <div className="space-y-6 p-4">
            {/* Trip Information */}
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold">Trip Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Name:</div>
                <div>{details.trip?.name || 'N/A'}</div>
                <div className="font-medium">Price:</div>
                <div>${details.trip?.price || 'N/A'}</div>
                <div className="font-medium">Start Date:</div>
                <div>{details.trip?.start_date || 'N/A'}</div>
                <div className="font-medium">End Date:</div>
                <div>{details.trip?.end_date || 'N/A'}</div>
              </div>
            </div>
            {/* User Information */}
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold">User Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Name:</div>
                <div>{details.user?.name || 'N/A'}</div>
                <div className="font-medium">Email:</div>
                <div>{details.user?.contact || 'N/A'}</div>
                <div className="font-medium">Phone:</div>
                <div>{details.user?.phone_number || 'N/A'}</div>
                <div className="font-medium">Address:</div>
                <div>{details.user?.address || 'N/A'}</div>
              </div>
            </div>
            {/* Reservation Details */}
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold">Reservation Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Status:</div>
                <div className="capitalize">{details.status}</div>
                <div className="font-medium">Number of Tickets:</div>
                <div>{details.number_of_tickets}</div>
                <div className="font-medium">Total Amount:</div>
                <div>
                  $
                  {(
                    details.number_of_tickets * (details.trip?.price || 0)
                  ).toFixed(2)}
                </div>
              </div>
            </div>
            {/* Cancellation Details */}
            {details.canceled_by && (
              <div className="grid gap-4">
                <h3 className="text-lg font-semibold">Cancellation Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium">Canceled By:</div>
                  <div>{details.canceled_by.name}</div>
                  <div className="font-medium">Actor Type:</div>
                  <div className="capitalize">{details.canceled_by.actor}</div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
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

async function fetchReservations(): Promise<Reservation[]> {
  const token = localStorage.getItem('token')
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/reservations`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  const data = await response.json()
  if (!data.success) {
    throw new Error(data.message)
  }
  return data.data
}

async function fetchReservationDetails(
  id: number,
): Promise<ReservationDetails> {
  const token = localStorage.getItem('token')
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/reservations/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  const data = await response.json()
  if (!data.success) {
    throw new Error(data.message)
  }
  return data.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function updateReservation(id: number, data: any) {
  const token = localStorage.getItem('token')
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/reservations/${id}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  )
  const responseData = await response.json()
  if (!responseData.success) {
    throw new Error(responseData.message)
  }
  return responseData.data
}

interface EditReservationModalProps {
  isOpen: boolean
  onClose: () => void
  reservation: ReservationDetails | null
  onSubmit: (formData: FormData) => Promise<void>
}
function EditReservationModal({
  isOpen,
  onClose,
  reservation,
  onSubmit,
}: EditReservationModalProps) {
  if (!isOpen || !reservation) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Reservation</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            if (reservation && reservation.trip_id) {
              formData.append('trip_id', reservation.trip_id.toString())
            }
            onSubmit(formData)
          }}
        >
          <input type="hidden" name="_method" value="PUT" />
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="number_of_tickets">Number of Tickets</Label>
              <Input
                id="number_of_tickets"
                name="number_of_tickets"
                type="number"
                min="1"
                max="255"
                defaultValue={reservation.number_of_tickets}
              />
            </div>
            {reservation.status !== 'canceled' && (
              <div className="space-y-2">
                <Label htmlFor="status">Cancel Reservation</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox id="cancel" name="status" value="on" />
                  <label
                    htmlFor="cancel"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Cancel this reservation
                  </label>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
export default function ShowProfile() {
  const {
    data: profile,
    error: profileError,
    isLoading: isProfileLoading,
  } = useQuery<ProfileData, Error>({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  })

  const {
    data: reservations,
    error: reservationsError,
    isLoading: isReservationsLoading,
  } = useQuery<Reservation[], Error>({
    queryKey: ['reservations'],
    queryFn: fetchReservations,
  })

  const [selectedReservation, setSelectedReservation] = useState<number | null>(
    null,
  )
  const [reservationDetails, setReservationDetails] =
    useState<ReservationDetails | null>(null)
  const [editingReservation, setEditingReservation] = useState<number | null>(
    null,
  )
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const [currentHeroIndex, setCurrentHeroIndex] = useState(0)
  const [heroImages, setHeroImages] = useState<HeroImage[]>([])

  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/hero-images/profile`,
        )
        setHeroImages(response.data.data)
      } catch (error) {
        console.error('Error fetching hero images:', error)
      }
    }

    fetchHeroImages()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [heroImages.length])

  const handleEdit = async (id: number) => {
    try {
      const details = await fetchReservationDetails(id)
      setReservationDetails(details)
      setEditingReservation(id)
    } catch (error) {
      console.error('Error fetching reservation details for edit:', error)
    }
  }

  const handleEditSubmit = async (formData: FormData) => {
    if (!editingReservation) return

    try {
      const updatedData = {
        trip_id: formData.get('trip_id'),
        number_of_tickets: formData.get('number_of_tickets'),
        status: formData.get('status') === 'on' ? 'canceled' : undefined,
      }

      await updateReservation(editingReservation, updatedData)
      await queryClient.invalidateQueries({ queryKey: ['reservations'] })
      setEditingReservation(null)

      toast({
        title: 'Success',
        description: 'Reservation updated successfully',
      })
    } catch (error) {
      console.error('Error updating reservation:', error)
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to update reservation',
        variant: 'destructive',
      })
    }
  }

  if (profileError || reservationsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-700 p-4">
          {profileError?.message || reservationsError?.message}
        </div>
      </div>
    )
  }

  if (isProfileLoading || isReservationsLoading) {
    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative h-[500px]">
          {heroImages.map((image, index) => (
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
            </div>
          ))}

          {/* Dots navigation */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {heroImages.map((_, index) => (
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
            {/* Profile Section Skeleton */}
            <div>
              <h2 className="text-2xl font-semibold mb-8">Profile Details</h2>
              <div className="grid grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow animate-pulse">
                <div className="space-y-6">
                  <div>
                    <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 w-32 bg-gray-200 rounded"></div>
                  </div>
                  <div>
                    <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 w-40 bg-gray-200 rounded"></div>
                  </div>
                  <div>
                    <div className="h-4 w-16 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 w-48 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 w-56 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-10 w-full bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>

            {/* Reservations Section Skeleton */}
            <div>
              <h2 className="text-2xl font-semibold mb-8">My Reservations</h2>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="bg-white p-6 rounded-lg shadow animate-pulse"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="h-6 w-48 bg-gray-200 rounded"></div>
                      <div className="h-6 w-24 bg-gray-200 rounded"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                        <div className="h-4 w-16 bg-gray-200 rounded"></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
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

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-8">Profile Details</h2>
          <div className="grid grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Name
                </label>
                <div className="text-lg">{profile?.name}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Phone Number
                </label>
                <div className="text-lg">
                  {profile?.phone_number || 'Not provided'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email
                </label>
                <div className="text-lg">{profile?.contact}</div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Address
                </label>
                <div className="text-lg">
                  {profile?.address || 'Not provided'}
                </div>
              </div>
              <div>
                <Link to="/edit-profile">
                  <Button className="w-full bg-[#18181B] text-white hover:bg-[#27272A] hover:text-yellow-600">
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Reservations Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-8">My Reservations</h2>
          <div className="space-y-4">
            {reservations && reservations.length > 0 ? (
              reservations.map((reservation) => (
                <Card key={reservation.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl">
                      {reservation.trip?.name || 'Trip Unavailable'}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className={
                        reservation.status === 'confirmed'
                          ? 'bg-green-50 text-green-700 border-green-300'
                          : reservation.status === 'pending'
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-300'
                            : reservation.status === 'canceled'
                              ? 'bg-red-50 text-red-700 border-red-300'
                              : 'bg-blue-50 text-blue-700 border-blue-300'
                      }
                    >
                      {reservation.status.charAt(0).toUpperCase() +
                        reservation.status.slice(1)}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      <div className="flex justify-between items-center">
                        <CardDescription>Number of Tickets</CardDescription>
                        <span>{reservation.number_of_tickets}</span>
                      </div>
                      {reservation.trip && (
                        <>
                          <div className="flex justify-between items-center">
                            <CardDescription>Price per Ticket</CardDescription>
                            <span>${reservation.trip.price}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <CardDescription>Total Amount</CardDescription>
                            <span className="font-semibold">
                              $
                              {reservation.trip.price *
                                reservation.number_of_tickets}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <CardDescription>Trip Dates</CardDescription>
                            <span>
                              {reservation.trip.start_date} -{' '}
                              {reservation.trip.end_date}
                            </span>
                          </div>
                        </>
                      )}
                      {reservation.canceled_by && (
                        <div className="mt-2 p-3 bg-red-50 rounded-md">
                          <p className="text-sm text-red-600">
                            {reservation.canceled_by.actor === 'admin' ||
                            reservation.canceled_by.actor === 'super_admin'
                              ? 'Cancelled by ICT Admins'
                              : 'You cancelled this reservation'}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <div className="px-6 pb-4 flex justify-end gap-2">
                    {reservation.status === 'pending' && (
                      <Button onClick={() => handleEdit(reservation.id)}>
                        Edit
                      </Button>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <p className="text-muted-foreground">No reservations found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <ReservationDetailsModal
        isOpen={selectedReservation !== null}
        onClose={() => setSelectedReservation(null)}
        details={reservationDetails}
      />
      <EditReservationModal
        isOpen={editingReservation !== null}
        onClose={() => setEditingReservation(null)}
        reservation={reservationDetails}
        onSubmit={handleEditSubmit}
      />
      <Toaster />
    </div>
  )
}
