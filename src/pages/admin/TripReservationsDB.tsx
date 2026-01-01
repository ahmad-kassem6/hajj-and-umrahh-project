import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AdminLayout } from '@/pages/Layout'
import { Button } from '@/components/ui/button'
import { useParams } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Eye, Trash2, Pencil, Plus } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { Badge } from '@/components/ui/badge'
import { Spinner } from "@/components/ui/spinner"

interface User {
  id: number
  name: string
  contact: string
  phone_number: string
  address: string
}

interface Trip {
  id: number
  name: string
  price: number
  start_date: string
  end_date: string
}

interface Reservation {
  id: number
  status: 'canceled' | 'pending' | 'in_progress' | 'confirmed'
  number_of_tickets: number
  user: User
  trip: Trip
}

const reservationSchema = z.object({
  user_id: z.number().min(1, 'User ID is required'),
  trip_id: z.number().min(1, 'Trip ID is required'),
  number_of_tickets: z
    .number()
    .min(1)
    .max(255, 'Number of tickets must be between 1 and 255'),
  status: z.enum(['canceled', 'pending', 'in_progress', 'confirmed']),
})

type ReservationFormData = z.infer<typeof reservationSchema>

const fetchReservations = async (tripId: string): Promise<Reservation[]> => {
  const token = localStorage.getItem('token')
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/reservations?trip_id=${tripId}`,
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

// Helper function to get badge style
const getStatusBadgeStyle = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'in_progress':
      return 'bg-blue-100 text-blue-800'
    case 'confirmed':
      return 'bg-green-100 text-green-800'
    case 'canceled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function TripReservationsDB() {
  const { tripId } = useParams<{ tripId: string }>()
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const {
    data: reservations,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['reservations', tripId],
    queryFn: () => fetchReservations(tripId!),
    enabled: !!tripId,
  })

  const form = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      user_id: 0,
      trip_id: Number(tripId),
      number_of_tickets: 1,
      status: 'pending',
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: ReservationFormData) => {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reservations`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        },
      )
      const result = await response.json()
      if (!result.success) {
        throw new Error(result.message)
      }
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations', tripId] })
      setIsCreateModalOpen(false)
      form.reset()
      toast({
        title: 'Success',
        description: 'Reservation created successfully',
        variant: 'default',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to create reservation: ${error.message}`,
        variant: 'destructive',
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (data: ReservationFormData) => {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reservations/${selectedReservation?.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        },
      )
      const result = await response.json()
      if (!result.success) {
        throw new Error(result.message)
      }
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations', tripId] })
      setIsEditModalOpen(false)
      setSelectedReservation(null)
      toast({
        title: 'Success',
        description: 'Reservation updated successfully',
        variant: 'default',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to update reservation: ${error.message}`,
        variant: 'destructive',
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reservations/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      const result = await response.json()
      if (!result.success) {
        throw new Error(result.message)
      }
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations', tripId] })
      setIsDeleteModalOpen(false)
      setSelectedReservation(null)
      toast({
        title: 'Success',
        description: 'Reservation deleted successfully',
        variant: 'default',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to delete reservation: ${error.message}`,
        variant: 'destructive',
      })
    },
  })

  const handleView = (reservation: Reservation) => {
    setSelectedReservation(reservation)
    setIsViewModalOpen(true)
  }

  const handleEdit = (reservation: Reservation) => {
    setSelectedReservation(reservation)
    form.reset({
      user_id: reservation.user.id,
      trip_id: reservation.trip.id,
      number_of_tickets: reservation.number_of_tickets,
      status: reservation.status,
    })
    setIsEditModalOpen(true)
  }

  const handleDelete = (reservation: Reservation) => {
    setSelectedReservation(reservation)
    setIsDeleteModalOpen(true)
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="min-h-[400px] flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </AdminLayout>
    )
  }

  if (isError) {
    toast({
      title: 'Error',
      description: `Failed to load reservations: ${(error as Error).message}`,
      variant: 'destructive',
    })
    return (
      <AdminLayout>Error loading reservations. Please try again.</AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Package Reservations
          </h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-[#18181B] text-white hover:bg-[#27272A] hover:text-yellow-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Reservation
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create New Reservation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Tickets</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations?.map((reservation: Reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell className="font-medium">
                    {reservation.id}
                  </TableCell>
                  <TableCell>{reservation.user.name}</TableCell>
                  <TableCell>{reservation.user.contact}</TableCell>
                  <TableCell>{reservation.number_of_tickets}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${getStatusBadgeStyle(reservation.status)}`}
                    >
                      {reservation.status.charAt(0).toUpperCase() +
                        reservation.status.slice(1).replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(reservation)}
                            className="hover:bg-gray-100 hover:text-yellow-600"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View Details</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(reservation)}
                            className="hover:bg-gray-100 hover:text-yellow-600"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit Reservation</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(reservation)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete Reservation</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* View Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">
                Reservation Details
              </DialogTitle>
            </DialogHeader>
            {selectedReservation && (
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* User Information Card */}
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold text-lg mb-3">
                      User Information
                    </h4>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Name:</dt>
                        <dd>{selectedReservation.user.name}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Contact:</dt>
                        <dd>{selectedReservation.user.contact}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Phone:</dt>
                        <dd>{selectedReservation.user.phone_number}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Address:</dt>
                        <dd>{selectedReservation.user.address}</dd>
                      </div>
                    </dl>
                  </div>

                  {/* Trip Information Card */}
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold text-lg mb-3">
                      Trip Information
                    </h4>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Package Name:</dt>
                        <dd>{selectedReservation.trip.name}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Price per Person:</dt>
                        <dd>${selectedReservation.trip.price}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Start Date:</dt>
                        <dd>{selectedReservation.trip.start_date}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">End Date:</dt>
                        <dd>{selectedReservation.trip.end_date}</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Reservation Details Card */}
                <div className="p-4 rounded-lg border">
                  <h4 className="font-semibold text-lg mb-3">
                    Reservation Details
                  </h4>
                  <div className="grid md:grid-cols-2 gap-8">
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Reservation ID:</dt>
                        <dd>#{selectedReservation.id}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Number of Tickets:</dt>
                        <dd>{selectedReservation.number_of_tickets}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Total Price:</dt>
                        <dd className="font-semibold text-lg">
                          $
                          {selectedReservation.number_of_tickets *
                            selectedReservation.trip.price}
                        </dd>
                      </div>
                    </dl>
                    <div className="flex flex-col items-end justify-center">
                      <div className="text-right">
                        <span className="text-gray-500 mb-2 block">Status</span>
                        <Badge
                          className={`text-sm px-3 py-1 ${getStatusBadgeStyle(selectedReservation.status)}`}
                        >
                          {selectedReservation.status.charAt(0).toUpperCase() +
                            selectedReservation.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Create Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Reservation</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) =>
                  createMutation.mutate(data),
                )}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="user_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User ID</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="number_of_tickets"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Tickets</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="canceled">Canceled</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in_progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? 'Creating...' : 'Create'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Reservation</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) =>
                  updateMutation.mutate(data),
                )}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="user_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User ID</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="number_of_tickets"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Tickets</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="canceled">Canceled</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in_progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Delete Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Confirmation</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this reservation? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (selectedReservation) {
                    deleteMutation.mutate(selectedReservation.id)
                  }
                }}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Toaster />
    </AdminLayout>
  )
}
