import { Fragment, useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, useFieldArray } from 'react-hook-form'
import { AdminLayout } from '@/pages/Layout'
import { Button } from '@/components/ui/button'
import { Dialog, Transition } from '@headlessui/react'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Trash2, Edit, Eye } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { Spinner } from '@/components/ui/spinner'

// Types
interface BaseHotel {
  id: number
  number_of_nights: number
  description: string
}

interface DisplayHotel extends BaseHotel {
  name: string
  city_id: number
  city_name: string
}

interface Reservation {
  id: number
  status: string
  number_of_tickets: number
  canceled_by: string | null
  user: {
    id: number
    name: string
    contact: string
    phone_number: string
    address: string
  }
}

interface Trip {
  id: number
  name: string
  description: string
  price: number
  is_active: number
  start_date: string
  end_date: string
  image?: {
    id: number
    path: string
  }
  hotels: DisplayHotel[]
  reservations: Reservation[]
}

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

interface UpdateTripPayload {
  name: string
  description: string
  price: number
  image?: File
  start_date: string
  end_date: string
  is_active: number
  hotels: BaseHotel[]
}

// Removed unused HotelData interface

// API Functions
async function fetchTrips(): Promise<Trip[]> {
  const token = localStorage.getItem('token')
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/trips`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const data: ApiResponse<Trip[]> = await response.json()
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch trips. Please try again.')
  }
  return data.data
}

async function fetchTripDetails(tripId: number): Promise<Trip> {
  const token = localStorage.getItem('token')
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/trips/${tripId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  const data: ApiResponse<Trip> = await response.json()
  if (!data.success) {
    throw new Error(
      data.message || 'Failed to fetch trip details. Please try again.',
    )
  }
  return data.data
}

async function updateTrip(
  tripId: number,
  payload: UpdateTripPayload,
): Promise<Trip> {
  const token = localStorage.getItem('token')
  const formData = new FormData()

  // Add _method for PUT request
  formData.append('_method', 'PUT')

  // Add basic fields
  formData.append('name', payload.name)
  formData.append('description', payload.description)
  formData.append('price', payload.price.toString())
  formData.append('start_date', payload.start_date)
  formData.append('end_date', payload.end_date)
  formData.append('is_active', payload.is_active.toString())

  // Add image if provided
  if (payload.image instanceof File) {
    formData.append('image', payload.image)
  }

  // Add hotels data
  payload.hotels.forEach((hotel, index) => {
    formData.append(`hotels[${index}][id]`, hotel.id.toString())
    formData.append(
      `hotels[${index}][number]`,
      hotel.number_of_nights.toString(),
    )
    formData.append(`hotels[${index}][description]`, hotel.description)
  })

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/trips/${tripId}`,
    {
      method: 'POST', // Using POST with _method: PUT for form-data
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
  )

  const data: ApiResponse<Trip> = await response.json()
  if (!data.success) {
    throw new Error(data.message || 'Failed to update trip. Please try again.')
  }
  return data.data
}

async function createTrip(formData: FormData): Promise<Trip> {
  const token = localStorage.getItem('token')
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/trips`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
  const data: ApiResponse<Trip> = await response.json()
  if (!data.success) {
    throw new Error(data.message || 'Failed to create trip. Please try again.')
  }
  return data.data
}

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  tripName,
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  tripName: string
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Delete Trip
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete the trip "{tripName}"? This
                    action cannot be undone.
                  </p>
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="hover:bg-gray-100"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={onConfirm}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Delete
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

// Delete Button Component
const DeleteTripButton = ({
  tripId,
  tripName,
}: {
  tripId: number
  tripName: string
}) => {
  const queryClient = useQueryClient()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/trips/${tripId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      const data = await response.json()
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['trips'] })
        toast({
          title: 'Success',
          description: 'Trip deleted successfully',
          variant: 'default',
        })
      } else {
        toast({
          title: 'Error',
          description:
            data.message || 'Failed to delete trip. Please try again.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      })
      console.error(error)
    } finally {
      setIsDeleting(false)
      setIsModalOpen(false)
    }
  }
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="hover:text-red-600 relative group"
        onClick={() => setIsModalOpen(true)}
        disabled={isDeleting}
      >
        <Trash2 className="h-4 w-4" />
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
          Delete Trip
        </span>
      </Button>
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        tripName={tripName}
      />
    </>
  )
}

// Main Component
export default function TripsPage() {
  const queryClient = useQueryClient()
  const { data: trips, isLoading } = useQuery({
    queryKey: ['trips'],
    queryFn: fetchTrips,
  })

  const { toast } = useToast()

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false)
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Form schema type
  interface FormSchema {
    name: string
    description: string
    price: number
    start_date: string
    end_date: string
    is_active: number
    image?: File
    hotels: {
      id: number
      number_of_nights: number
      description: string
    }[]
  }

  // Update the useForm hook
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
  } = useForm<FormSchema>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      start_date: '',
      end_date: '',
      is_active: 1,
      hotels: [
        {
          id: 0,
          number_of_nights: 1,
          description: '',
        },
      ],
    },
  })

  // Update the field array
  const { fields, append, remove } = useFieldArray<FormSchema>({
    control,
    name: 'hotels',
  })

  const mutation = useMutation({
    mutationFn: (data: FormSchema) => {
      if (!selectedTrip) throw new Error('No trip selected')

      // Create the payload that matches UpdateTripPayload
      const payload: UpdateTripPayload = {
        name: data.name,
        description: data.description,
        price: data.price,
        start_date: String(data.start_date || ''),
        end_date: String(data.end_date || ''),
        is_active: data.is_active,
        hotels: data.hotels.map((hotel) => ({
          id: hotel.id,
          number_of_nights: hotel.number_of_nights,
          description: hotel.description,
        })),
      }

      // Add image if it exists
      if (data.image instanceof File) {
        payload.image = data.image
      }

      return updateTrip(selectedTrip.id, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      closeEditModal()
      toast({
        title: 'Success',
        description: 'Trip updated successfully',
        variant: 'default',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description:
          error.message || 'Failed to update trip. Please try again.',
        variant: 'destructive',
      })
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: FormSchema) => {
      // Validate required fields
      if (
        !data.name ||
        !data.price ||
        !data.start_date ||
        !data.end_date ||
        !data.description
      ) {
        throw new Error('Please fill in all required fields')
      }

      // Validate hotels
      if (!data.hotels || data.hotels.length === 0) {
        throw new Error('At least one hotel is required')
      }

      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('description', data.description)
      formData.append('price', data.price.toString())
      formData.append('start_date', data.start_date)
      formData.append('end_date', data.end_date)
      formData.append('is_active', data.is_active.toString())

      // Add image if provided
      if (data.image instanceof File) {
        formData.append('image', data.image)
      }

      // Add hotels data
      data.hotels.forEach((hotel, index) => {
        formData.append(`hotels[${index}][id]`, hotel.id.toString())
        formData.append(
          `hotels[${index}][number]`,
          hotel.number_of_nights.toString(),
        )
        formData.append(`hotels[${index}][description]`, hotel.description)
      })

      return createTrip(formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      closeCreateModal()
      toast({
        title: 'Success',
        description: 'Trip created successfully',
        variant: 'default',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description:
          error.message || 'Failed to create trip. Please try again.',
        variant: 'destructive',
      })
    },
  })

  const openEditModal = async (trip: Trip) => {
    try {
      const detailedTrip = await fetchTripDetails(trip.id)
      setSelectedTrip(detailedTrip)
      setCurrentImage(detailedTrip.image?.path || null)
      reset({
        name: detailedTrip.name,
        description: detailedTrip.description,
        price: detailedTrip.price,
        start_date: detailedTrip.start_date,
        end_date: detailedTrip.end_date,
        is_active: detailedTrip.is_active,
        hotels: detailedTrip.hotels,
      })
      setIsEditModalOpen(true)
    } catch (error) {
      console.error('Failed to fetch trip details:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch trip details. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const closeEditModal = () => {
    setSelectedTrip(null)
    setCurrentImage(null)
    reset()
    setIsEditModalOpen(false)
  }

  const openPackageModal = async (trip: Trip) => {
    try {
      const detailedTrip = await fetchTripDetails(trip.id)
      setSelectedTrip(detailedTrip)
      setIsPackageModalOpen(true)
    } catch (error) {
      console.error('Failed to fetch trip details:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch trip details. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const closePackageModal = () => {
    setSelectedTrip(null)
    setIsPackageModalOpen(false)
  }

  const onSubmit = async (data: FormSchema) => {
    // Validate dates
    const startDate = new Date(data.start_date)
    const endDate = new Date(data.end_date)
    const today = new Date()

    if (startDate < today) {
      toast({
        title: 'Error',
        description: 'Start date must be after today',
        variant: 'destructive',
      })
      return
    }

    if (endDate <= startDate) {
      toast({
        title: 'Error',
        description: 'End date must be after start date',
        variant: 'destructive',
      })
      return
    }

    mutation.mutate(data)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setValue('image', file)
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file)
      setCurrentImage(previewUrl)
    }
  }

  const openCreateModal = () => {
    reset({
      name: '',
      description: '',
      price: 0,
      start_date: '',
      end_date: '',
      is_active: 1,
      hotels: [
        {
          id: 0,
          number_of_nights: 1,
          description: '',
        },
      ],
    })
    setCurrentImage(null)
    setIsCreateModalOpen(true)
  }

  const closeCreateModal = () => {
    reset()
    setCurrentImage(null)
    setIsCreateModalOpen(false)
  }

  const handleCreate = async (data: FormSchema) => {
    // Validate dates
    const startDate = new Date(data.start_date)
    const endDate = new Date(data.end_date)
    const today = new Date()

    if (startDate < today) {
      toast({
        title: 'Error',
        description: 'Start date must be after today',
        variant: 'destructive',
      })
      return
    }

    if (endDate <= startDate) {
      toast({
        title: 'Error',
        description: 'End date must be after start date',
        variant: 'destructive',
      })
      return
    }

    createMutation.mutate(data)
  }

  useEffect(() => {
    if (selectedTrip) {
      reset({
        name: selectedTrip.name,
        description: selectedTrip.description,
        price: selectedTrip.price,
        start_date: selectedTrip.start_date,
        end_date: selectedTrip.end_date,
        is_active: selectedTrip.is_active,
        hotels: selectedTrip.hotels,
      })
    }
  }, [selectedTrip, reset])

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="min-h-[400px] flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Trip Management</h2>
          <Button
            onClick={openCreateModal}
            className="bg-primary hover:bg-primary/90 text-black hover:text-yellow-600 transition-colors"
          >
            Create Trip
          </Button>
        </div>
        <div className="rounded-md border">
          <div className="min-w-full">
            <div className="relative w-full">
              <Table className="table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead className="w-[200px]">Name</TableHead>
                    <TableHead className="w-[100px]">Price</TableHead>
                    <TableHead className="w-[120px]">Start Date</TableHead>
                    <TableHead className="w-[120px]">End Date</TableHead>
                    <TableHead className="w-[100px]">Active</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trips?.map((trip: Trip) => (
                    <TableRow key={trip.id}>
                      <TableCell className="font-medium">{trip.id}</TableCell>
                      <TableCell>{trip.name}</TableCell>
                      <TableCell>${trip.price}</TableCell>
                      <TableCell>{trip.start_date}</TableCell>
                      <TableCell>{trip.end_date}</TableCell>
                      <TableCell>
                        <Badge
                          variant={trip.is_active ? 'default' : 'secondary'}
                        >
                          {trip.is_active ? 'Yes' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-2">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:text-yellow-600 relative group"
                            onClick={() => openEditModal(trip)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              Update Trip
                            </span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:text-yellow-600 relative group"
                            onClick={() => openPackageModal(trip)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              View Details
                            </span>
                          </Button>
                          <DeleteTripButton
                            tripId={trip.id}
                            tripName={trip.name}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {selectedTrip && (
          <Transition appear show={isEditModalOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeEditModal}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Edit Trip
                      </Dialog.Title>
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="mt-2 space-y-4"
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Name
                          </label>
                          <Input
                            {...register('name')}
                            className={errors.name ? 'border-red-500' : ''}
                          />
                          {errors.name && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors.name.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Price
                          </label>
                          <Input
                            type="number"
                            step="0.01"
                            {...register('price', { valueAsNumber: true })}
                            className={errors.price ? 'border-red-500' : ''}
                          />
                          {errors.price && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors.price.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Image
                          </label>
                          {currentImage && (
                            <div className="mt-2 mb-4">
                              <img
                                src={currentImage}
                                alt="Current trip"
                                className="w-32 h-32 object-cover rounded-lg"
                              />
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="mt-1 block w-full text-sm text-gray-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-full file:border-0
                              file:text-sm file:font-semibold
                              file:bg-violet-50 file:text-violet-700
                              hover:file:bg-violet-100"
                          />
                          {errors.image && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors.image.message?.toString()}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Start Date
                          </label>
                          <Input
                            type="date"
                            {...register('start_date')}
                            className={
                              errors.start_date ? 'border-red-500' : ''
                            }
                          />
                          {errors.start_date && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors.start_date.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            End Date
                          </label>
                          <Input
                            type="date"
                            {...register('end_date')}
                            className={errors.end_date ? 'border-red-500' : ''}
                          />
                          {errors.end_date && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors.end_date.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <Textarea
                            {...register('description', { required: true })}
                            defaultValue={selectedTrip?.description}
                            placeholder="Enter trip description"
                            className="min-h-[100px] resize-none w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm"
                            onChange={(e) =>
                              console.log(
                                'Description changed:',
                                e.target.value,
                              )
                            }
                          />
                          {errors.description && (
                            <p className="mt-1 text-sm text-red-500">
                              {errors.description.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Active
                          </label>
                          <select
                            {...register('is_active', { valueAsNumber: true })}
                            className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          >
                            <option value={1}>Yes</option>
                            <option value={0}>No</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Hotels
                          </label>
                          {fields.map((field, index) => (
                            <div
                              key={field.id}
                              className="grid grid-cols-3 gap-2 mt-2"
                            >
                              <div>
                                <label className="block text-xs text-gray-600">
                                  Hotel ID
                                </label>
                                <Input
                                  {...register(`hotels.${index}.id` as const, {
                                    valueAsNumber: true,
                                    required: 'Hotel ID is required',
                                  })}
                                  defaultValue={field.id}
                                  type="number"
                                  className="mt-1"
                                  readOnly
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600">
                                  Nights
                                </label>
                                <Input
                                  {...register(
                                    `hotels.${index}.number_of_nights` as const,
                                    {
                                      valueAsNumber: true,
                                      required: 'Number of nights is required',
                                    },
                                  )}
                                  defaultValue={field.number_of_nights}
                                  type="number"
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600">
                                  Description
                                </label>
                                <Input
                                  {...register(
                                    `hotels.${index}.description` as const,
                                    {
                                      required: 'Description is required',
                                    },
                                  )}
                                  defaultValue={field.description}
                                  className="mt-1"
                                />
                              </div>
                              {/* Only show remove button if there's more than one hotel */}
                              {fields.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => remove(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 flex justify-end space-x-2">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={closeEditModal}
                            className="hover:text-yellow-600"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            variant="default"
                            className="hover:text-yellow-600"
                            disabled={mutation.isPending}
                          >
                            {mutation.isPending ? 'Saving...' : 'Save'}
                          </Button>{' '}
                        </div>
                      </form>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        )}

        {/* Create Modal */}
        <Transition appear show={isCreateModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeCreateModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Create New Trip
                    </Dialog.Title>
                    <form
                      onSubmit={handleSubmit(handleCreate)}
                      className="mt-2 space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <Input
                          {...register('name')}
                          className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Price
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          {...register('price', { valueAsNumber: true })}
                          className={errors.price ? 'border-red-500' : ''}
                        />
                        {errors.price && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.price.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Image
                        </label>
                        {currentImage && (
                          <div className="mt-2 mb-4">
                            <img
                              src={currentImage}
                              alt="Current trip"
                              className="w-32 h-32 object-cover rounded-lg"
                            />
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="mt-1 block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-violet-50 file:text-violet-700
                            hover:file:bg-violet-100"
                        />
                        {errors.image && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.image.message?.toString()}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Start Date
                        </label>
                        <Input
                          type="date"
                          {...register('start_date')}
                          className={errors.start_date ? 'border-red-500' : ''}
                        />
                        {errors.start_date && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.start_date.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          End Date
                        </label>
                        <Input
                          type="date"
                          {...register('end_date')}
                          className={errors.end_date ? 'border-red-500' : ''}
                        />
                        {errors.end_date && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.end_date.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <Textarea
                          {...register('description', { required: true })}
                          placeholder="Enter trip description"
                          className="min-h-[100px] resize-none w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm"
                        />
                        {errors.description && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.description.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Active
                        </label>
                        <select
                          {...register('is_active', { valueAsNumber: true })}
                          className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value={1}>Yes</option>
                          <option value={0}>No</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Hotels
                        </label>
                        {fields.map((field, index) => (
                          <div
                            key={field.id}
                            className="grid grid-cols-3 gap-2 mt-2"
                          >
                            <div>
                              <label className="block text-xs text-gray-600">
                                Hotel ID
                              </label>
                              <Input
                                {...register(`hotels.${index}.id` as const, {
                                  valueAsNumber: true,
                                  required: 'Hotel ID is required',
                                })}
                                type="number"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600">
                                Nights
                              </label>
                              <Input
                                {...register(
                                  `hotels.${index}.number_of_nights` as const,
                                  {
                                    valueAsNumber: true,
                                    required: 'Number of nights is required',
                                  },
                                )}
                                type="number"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600">
                                Description
                              </label>
                              <Input
                                {...register(
                                  `hotels.${index}.description` as const,
                                  {
                                    required: 'Description is required',
                                  },
                                )}
                                className="mt-1"
                              />
                            </div>
                            {/* Only show remove button if there's more than one hotel */}
                            {fields.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          onClick={() =>
                            append({
                              id: 0,
                              number_of_nights: 1,
                              description: '',
                            })
                          }
                          className="mt-2"
                        >
                          Add Hotel
                        </Button>
                      </div>

                      <div className="mt-4 flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={closeCreateModal}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={createMutation.isPending}
                          className="bg-primary hover:bg-primary/90 text-black hover:text-yellow-600 transition-colors"
                        >
                          {createMutation.isPending
                            ? 'Creating...'
                            : 'Create Trip'}
                        </Button>
                      </div>
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        {/* Package Modal */}
        {selectedTrip && (
          <Transition appear show={isPackageModalOpen} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-10"
              onClose={closePackageModal}
            >
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title
                        as="div"
                        className="flex items-center justify-between mb-6"
                      >
                        <h3 className="text-2xl font-semibold text-gray-900">
                          Package Details for {selectedTrip.name}
                        </h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={closePackageModal}
                        >
                          Close
                        </Button>
                      </Dialog.Title>

                      <div className="mt-4 space-y-8 max-h-[70vh] overflow-y-auto">
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <div className="p-4 rounded-lg border">
                              <h4 className="font-semibold text-lg mb-3">
                                Trip Information
                              </h4>
                              <dl className="space-y-2">
                                <div className="flex justify-between">
                                  <dt className="text-gray-500">ID:</dt>
                                  <dd>{selectedTrip.id}</dd>
                                </div>
                                <div className="flex justify-between">
                                  <dt className="text-gray-500">Price:</dt>
                                  <dd>${selectedTrip.price}</dd>
                                </div>
                                <div className="flex justify-between">
                                  <dt className="text-gray-500">Start Date:</dt>
                                  <dd>{selectedTrip.start_date}</dd>
                                </div>
                                <div className="flex justify-between">
                                  <dt className="text-gray-500">End Date:</dt>
                                  <dd>{selectedTrip.end_date}</dd>
                                </div>
                                <div className="flex justify-between">
                                  <dt className="text-gray-500">Status:</dt>
                                  <dd>
                                    <Badge
                                      variant={
                                        selectedTrip.is_active
                                          ? 'default'
                                          : 'secondary'
                                      }
                                    >
                                      {selectedTrip.is_active
                                        ? 'Active'
                                        : 'Inactive'}
                                    </Badge>
                                  </dd>
                                </div>
                              </dl>
                            </div>

                            {selectedTrip.description && (
                              <div className="p-4 rounded-lg border">
                                <h4 className="font-semibold text-lg mb-3">
                                  Description
                                </h4>
                                <p className="text-gray-600 whitespace-pre-wrap break-words overflow-auto max-h-[200px]">
                                  {selectedTrip.description}
                                </p>
                              </div>
                            )}
                          </div>

                          {selectedTrip.image && (
                            <div className="p-4 rounded-lg border">
                              <h4 className="font-semibold text-lg mb-3">
                                Trip Image
                              </h4>
                              <img
                                src={selectedTrip.image.path}
                                alt={selectedTrip.name}
                                className="w-full rounded-lg object-cover"
                              />
                            </div>
                          )}
                        </div>

                        <div className="p-4 rounded-lg border">
                          <h4 className="font-semibold text-lg mb-4">Hotels</h4>
                          <div className="grid gap-4">
                            {selectedTrip.hotels.map((hotel) => (
                              <div
                                key={hotel.id}
                                className="p-4 rounded-lg bg-gray-50"
                              >
                                <div className="flex justify-between items-start">
                                  <h5 className="font-medium">{hotel.name}</h5>
                                  <Badge variant="outline">
                                    {hotel.number_of_nights} nights
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                  {hotel.city_name}
                                </p>
                                <p className="text-sm mt-2">
                                  {hotel.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        )}
      </div>
      <Toaster />
    </AdminLayout>
  )
}
