import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AdminLayout } from '@/pages/Layout'
import { Button } from '@/components/ui/button'
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import axios, { AxiosError } from 'axios'

interface City {
  id: number
  name: string
}

const citySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
})

type CityFormData = z.infer<typeof citySchema>

const fetchCities = async (): Promise<City[]> => {
  const token = localStorage.getItem('token')
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cities`, {
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

export default function CitiesDB() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: cities, isLoading, isError, error } = useQuery({
    queryKey: ['cities'],
    queryFn: fetchCities,
  })

  const form = useForm<CityFormData>({
    resolver: zodResolver(citySchema),
    defaultValues: {
      name: '',
    },
  })

  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cities`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities'] })
      setIsCreateModalOpen(false)
      toast({
        title: "Success",
        description: "City created successfully",
        variant: "default",
      })
    },
    onError: (error: AxiosError) => {
      toast({
        title: "Error",
        description: `Failed to create city: ${error.message}`,
        variant: "destructive",
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: number; formData: FormData }) => {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cities/${id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities'] })
      setIsEditModalOpen(false)
      setSelectedCity(null)
      toast({
        title: "Success",
        description: "City updated successfully",
        variant: "default",
      })
    },
    onError: (error: AxiosError) => {
      toast({
        title: "Error",
        description: `Failed to update city: ${error.message}`,
        variant: "destructive",
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem('token')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cities/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const result = await response.json()
      if (!result.success) {
        throw new Error(result.message)
      }
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities'] })
      setIsDeleteModalOpen(false)
      setSelectedCity(null)
      toast({
        title: "Success",
        description: "City deleted successfully",
        variant: "default",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete city: ${error.message}`,
        variant: "destructive",
      })
    },
  })

  const handleEdit = (city: City) => {
    setSelectedCity(city)
    form.reset({
      name: city.name,
    })
    setIsEditModalOpen(true)
  }

  const handleDelete = (city: City) => {
    setSelectedCity(city)
    setIsDeleteModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    try {
      await createMutation.mutateAsync(formData)
    } catch (error) {
      console.error('Failed to create city:', error)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedCity) return
    
    const formData = new FormData(e.currentTarget)
    formData.append('_method', 'PUT')
    try {
      await updateMutation.mutateAsync({
        id: selectedCity.id,
        formData,
      })
    } catch (error) {
      console.error('Failed to update city:', error)
    }
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
      title: "Error",
      description: `Failed to load cities: ${(error as Error).message}`,
      variant: "destructive",
    })
    return <AdminLayout>Error loading cities. Please try again.</AdminLayout>
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Cities</h2>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#18181B] text-white hover:bg-[#27272A] hover:text-yellow-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add City
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cities?.map((city: City) => (
                <TableRow key={city.id}>
                  <TableCell className="font-medium">{city.id}</TableCell>
                  <TableCell>{city.name}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(city)}
                      className="hover:text-yellow-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(city)}
                      className="hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Create Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Add New City</DialogTitle>
              <DialogDescription>
                Add a new city to the system. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">City Name</label>
                <Input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter city name"
                  className="h-11"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createMutation.isPending}
                  className="bg-[#18181B] text-white hover:bg-[#27272A] hover:text-yellow-600"
                >
                  {createMutation.isPending ? 'Creating...' : 'Create City'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Edit City</DialogTitle>
              <DialogDescription>
                Make changes to the city name here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">City Name</label>
                <Input
                  type="text"
                  name="name"
                  required
                  defaultValue={selectedCity?.name}
                  placeholder="Enter city name"
                  className="h-11"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="bg-[#18181B] text-white hover:bg-[#27272A] hover:text-yellow-600"
                >
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete City</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedCity?.name}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => selectedCity && deleteMutation.mutate(selectedCity.id)}
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

