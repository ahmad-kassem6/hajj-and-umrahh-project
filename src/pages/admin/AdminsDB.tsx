import { useState } from 'react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { AdminLayout } from '@/pages/Layout'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import axios, { AxiosError } from 'axios'
import { Spinner } from "@/components/ui/spinner"

// Types
interface Admin {
  id: number
  name: string
  contact: string
  role: string
  created_at: string
}

// API Functions
async function fetchAdmins(): Promise<Admin[]> {
  const token = localStorage.getItem('token')
  const response = await axios.get<{ data: Admin[] }>(`${import.meta.env.VITE_API_URL}/api/admins`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data.data
}

export default function AdminsPage() {
  // State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Queries
  const { data: admins, isLoading, isError } = useQuery({
    queryKey: ['admins'],
    queryFn: fetchAdmins,
  })

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admins`,
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
      queryClient.invalidateQueries({ queryKey: ['admins'] })
      setIsCreateModalOpen(false)
      toast({
        title: "Success",
        description: "Admin created successfully",
        variant: "default",
      })
    },
    onError: (error: AxiosError) => {
      toast({
        title: "Error",
        description: `Failed to create admin: ${error.message}`,
        variant: "destructive",
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: number; formData: FormData }) => {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admins/${id}`,
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
      queryClient.invalidateQueries({ queryKey: ['admins'] })
      setIsEditModalOpen(false)
      setSelectedAdmin(null)
      toast({
        title: "Success",
        description: "Admin updated successfully",
        variant: "default",
      })
    },
    onError: (error: AxiosError) => {
      toast({
        title: "Error",
        description: `Failed to update admin: ${error.message}`,
        variant: "destructive",
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem('token')
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admins/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] })
      setIsDeleteModalOpen(false)
      toast({
        title: "Success",
        description: "Admin deleted successfully",
        variant: "default",
      })
    },
    onError: (error: AxiosError) => {
      toast({
        title: "Error",
        description: `Failed to delete admin: ${error.message}`,
        variant: "destructive",
      })
    },
  })

  // Handlers
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    try {
      await createMutation.mutateAsync(formData)
    } catch (error) {
      console.error('Failed to create admin:', error)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedAdmin) return
    
    const formData = new FormData(e.currentTarget)
    formData.append('_method', 'PUT')
    try {
      await updateMutation.mutateAsync({
        id: selectedAdmin.id,
        formData,
      })
    } catch (error) {
      console.error('Failed to update admin:', error)
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
      description: "Failed to load admins. Please try again.",
      variant: "destructive",
    })
    return <AdminLayout>Error loading admins</AdminLayout>
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Admins Management</h2>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#18181B] text-white hover:bg-[#27272A] hover:text-yellow-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Admin
          </Button>
        </div>

        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead className="w-[200px]">Email</TableHead>
                  <TableHead className="w-[200px]">Created At</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins?.map((admin: Admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>{admin.id}</TableCell>
                    <TableCell>{admin.name}</TableCell>
                    <TableCell>{admin.contact}</TableCell>
                    <TableCell>{admin.created_at}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:text-yellow-600 relative group"
                          onClick={() => {
                            setSelectedAdmin(admin)
                            setIsEditModalOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit Admin</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 relative group"
                          onClick={() => {
                            setSelectedAdmin(admin)
                            setIsDeleteModalOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete Admin</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Create Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Add New Admin</DialogTitle>
              <DialogDescription>
                Add a new admin to the system. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Name</label>
                <Input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter admin name"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <Input
                  type="email"
                  name="contact"
                  required
                  placeholder="Enter admin email"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="Enter password"
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-11 w-11"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
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
                  {createMutation.isPending ? 'Creating...' : 'Create Admin'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Edit Admin</DialogTitle>
              <DialogDescription>
                Make changes to the admin here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Name</label>
                <Input
                  type="text"
                  name="name"
                  required
                  defaultValue={selectedAdmin?.name}
                  placeholder="Enter admin name"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <Input
                  type="email"
                  name="contact"
                  required
                  defaultValue={selectedAdmin?.contact}
                  placeholder="Enter admin email"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Password (Leave blank to keep current)</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter new password"
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-11 w-11"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
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
              <DialogTitle>Delete Admin</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedAdmin?.name}? This action cannot be undone.
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
                onClick={() => selectedAdmin && deleteMutation.mutate(selectedAdmin.id)}
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

