'use client'

import { useState, useRef } from 'react'
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
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import axios, { AxiosError } from 'axios'

interface HeroImage {
  id: number
  name: string
  image: string  // For list view
}

interface HeroImageDetail {
  id: number
  name: string
  images: Array<{
    id: number
    path: string
  }>
}



export default function HeroImagesDB() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<HeroImageDetail | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([])
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputEditRef = useRef<HTMLInputElement>(null);

  const { data: heroImages, isLoading, isError, error } = useQuery({
    queryKey: ['heroImages'],
    queryFn: async () => {
      const token = localStorage.getItem('token')
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/hero-images`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return response.data.data
    },
  })

  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/hero-images`,
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
      queryClient.invalidateQueries({ queryKey: ['heroImages'] })
      setIsCreateModalOpen(false)
      toast({
        title: "Success",
        description: "Hero image created successfully",
        variant: "default",
      })
    },
    onError: (error: AxiosError) => {
      toast({
        title: "Error",
        description: `Failed to create hero image: ${error.message}`,
        variant: "destructive",
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: number; formData: FormData }) => {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/hero-images/${id}`,
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
      queryClient.invalidateQueries({ queryKey: ['heroImages'] })
      setIsEditModalOpen(false)
      setSelectedImage(null)
      toast({
        title: "Success",
        description: "Hero image updated successfully",
        variant: "default",
      })
    },
    onError: (error: AxiosError) => {
      toast({
        title: "Error",
        description: `Failed to update hero image: ${error.message}`,
        variant: "destructive",
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem('token')
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/hero-images/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroImages'] })
      setIsDeleteModalOpen(false)
      setSelectedImage(null)
      toast({
        title: "Success",
        description: "Hero image deleted successfully",
        variant: "default",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete hero image: ${error.message}`,
        variant: "destructive",
      })
    },
  })

  const handleEdit = async (image: HeroImage) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/hero-images/${image.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedImage(response.data.data);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch image details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch image details",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (image: HeroImage) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/hero-images/${image.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedImage(response.data.data);
      setIsDeleteModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch image details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch image details",
        variant: "destructive",
      });
    }
  };

  const handleShow = async (image: HeroImage) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/hero-images/${image.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedImage(response.data.data);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch image details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch image details",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    
    const nameInput = e.currentTarget.querySelector('input[name="name"]') as HTMLInputElement;
    formData.append('name', nameInput.value);
    
    selectedFiles.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });

    try {
      await createMutation.mutateAsync(formData);
      setSelectedFiles([]);
    } catch (error) {
      console.error('Failed to create hero image:', error);
    }
  };

  const handleEditFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewFiles(prev => [...prev, ...filesArray]);
    }
  };

  const handleDeleteExistingImage = (imageId: number) => {
    if (selectedImage && selectedImage.images.length - imagesToDelete.length <= 1) {
      toast({
        title: "Error",
        description: "You must keep at least one image",
        variant: "destructive",
      });
      return;
    }
    setImagesToDelete(prev => [...prev, imageId]);
  };

  const handleRemoveNewFile = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append('_method', 'PUT');
    
    const nameInput = e.currentTarget.querySelector('input[name="name"]') as HTMLInputElement;
    formData.append('name', nameInput.value);
    
    newFiles.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });

    imagesToDelete.forEach((id, index) => {
      formData.append(`deleted_images[${index}]`, id.toString());
    });

    try {
      await updateMutation.mutateAsync({
        id: selectedImage.id,
        formData,
      });
      setNewFiles([]);
      setImagesToDelete([]);
    } catch (error) {
      console.error('Failed to update hero image:', error);
    }
  };

  const { data: imageDetails } = useQuery<HeroImageDetail>({
    queryKey: ['heroImage', selectedImage?.id],
    queryFn: async () => {
      if (!selectedImage) return null;
      const token = localStorage.getItem('token')
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/hero-images/${selectedImage.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return response.data.data
    },
    enabled: !!selectedImage,
  })

  const handleAddMoreClick = () => {
    fileInputRef.current?.click();
  };

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
      description: `Failed to load hero images: ${(error as Error).message}`,
      variant: "destructive",
    })
    return <AdminLayout>Error loading hero images. Please try again.</AdminLayout>
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Hero Image Management</h2>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#18181B] text-white hover:bg-[#27272A] hover:text-yellow-600"
          >
            Add New Route
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Preview</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {heroImages?.map((image: HeroImage) => (
                <TableRow key={image.id}>
                  <TableCell className="font-medium">{image.id}</TableCell>
                  <TableCell>{image.name}</TableCell>
                  <TableCell>
                    <img
                      src={`${import.meta.env.VITE_API_URL}/storage/${image.image}`}
                      alt={image.name}
                      className="w-24 h-16 object-cover rounded-md"
                      onError={(e) => console.error('Image load error:', e)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleShow(image)}
                        className="hover:text-yellow-600"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(image)}
                        className="hover:text-yellow-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(image)}
                        className="hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
              <DialogTitle className="text-2xl font-bold">Add New Hero Image</DialogTitle>
              <DialogDescription>
                Add a new hero image to the system. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Name</label>
                <Input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter name"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Images</label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className={`h-11 ${selectedFiles.length > 0 ? 'hidden' : ''}`}
                  ref={fileInputRef}
                />
                
                {selectedFiles.length > 0 && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full aspect-video object-cover rounded-lg"
                          />
                          <div className="absolute top-2 right-2">
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => handleRemoveFile(index)}
                              className="h-6 w-6 rounded-full"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      <Button
                        type="button"
                        onClick={handleAddMoreClick}
                        className="h-full aspect-video flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                      >
                        <Plus className="h-8 w-8 mb-2" />
                        <span className="text-sm">Add More</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setSelectedFiles([]);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createMutation.isPending || selectedFiles.length === 0}
                  className="bg-[#18181B] text-white hover:bg-[#27272A] hover:text-yellow-600"
                >
                  {createMutation.isPending ? 'Creating...' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={(open) => {
          setIsEditModalOpen(open);
          if (!open) {
            setNewFiles([]);
            setImagesToDelete([]);
          }
        }}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Edit Hero Image</DialogTitle>
              <DialogDescription>
                Make changes to the hero image here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Name</label>
                <Input
                  type="text"
                  name="name"
                  required
                  defaultValue={selectedImage?.name}
                  placeholder="Enter name"
                  className="h-11"
                />
              </div>

              {/* Existing Images */}
              {selectedImage && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Current Images</label>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedImage.images.map((img: { id: number; path: string }) => {
                      const isMarkedForDeletion = imagesToDelete.includes(img.id);
                      return (
                        <div key={img.id} className="relative group">
                          <img
                            src={img.path}
                            alt={selectedImage.name}
                            className={`w-full aspect-video object-cover rounded-lg ${
                              isMarkedForDeletion ? 'opacity-50' : ''
                            }`}
                          />
                          <div className="absolute top-2 right-2">
                            <Button
                              type="button"
                              variant={isMarkedForDeletion ? "outline" : "destructive"}
                              size="icon"
                              onClick={() => {
                                if (isMarkedForDeletion) {
                                  setImagesToDelete(prev => prev.filter(id => id !== img.id));
                                } else {
                                  handleDeleteExistingImage(img.id);
                                }
                              }}
                              className="h-6 w-6 rounded-full"
                            >
                              {isMarkedForDeletion ? (
                                <Plus className="h-4 w-4" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* New Images */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Add New Images</label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleEditFileSelect}
                  className="hidden"
                  ref={fileInputEditRef}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  {newFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`New preview ${index + 1}`}
                        className="w-full aspect-video object-cover rounded-lg"
                      />
                      <div className="absolute top-2 right-2">
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => handleRemoveNewFile(index)}
                          className="h-6 w-6 rounded-full"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Always visible Add More Button */}
                  <Button
                    type="button"
                    onClick={() => fileInputEditRef.current?.click()}
                    className="h-full aspect-video flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                  >
                    <Plus className="h-8 w-8 mb-2" />
                    <span className="text-sm">Add More</span>
                  </Button>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setNewFiles([]);
                    setImagesToDelete([]);
                  }}
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
              <DialogTitle>Delete Hero Image</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedImage?.name}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => selectedImage && deleteMutation.mutate(selectedImage.id)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Hero Image Details</DialogTitle>
            </DialogHeader>
            {imageDetails ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Name</h3>
                  <p>{imageDetails.name}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Images</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {imageDetails.images.map((img) => (
                      <div key={img.id} className="relative">
                        <img
                          src={img.path}
                          alt={`${imageDetails.name} - ${img.id}`}
                          className="w-full aspect-video object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <Spinner size="lg" />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <Toaster />
    </AdminLayout>
  )
}
