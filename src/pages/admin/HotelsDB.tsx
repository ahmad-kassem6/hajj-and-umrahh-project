import { useState, useMemo, useRef } from 'react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { AdminLayout } from '@/pages/Layout'
import { Button } from '@/components/ui/button'
import { Trash2, Edit, Eye, Plus, X, Check } from 'lucide-react'
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
import { Spinner } from "@/components/ui/spinner"
import { DynamicIcon } from '@/components/ui/dynamic-icon'

// Types
interface City {
  id: number
  name: string
}

interface Image {
  id: number
  path: string
}

interface Facility {
  id: number
  name: string
  icon: string
}

interface Trip {
  id: number
  name: string
  description: string
  start_date: string
  end_date: string
  price: number
  image: string | null
}

interface Hotel {
  id: number
  name: string
  address: string
  longitude: string
  latitude: string
  room_description: string
  city: City
  description: string
  image: string
  amenities: string[]
  facilities: Facility[]
  trips: Trip[]
  images: Image[]
}

// API Functions
async function fetchHotels(): Promise<Hotel[]> {
  const token = localStorage.getItem('token')
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/hotels`, {
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

async function fetchHotelDetails(id: number): Promise<Hotel> {
  const token = localStorage.getItem('token')
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/hotels/${id}`, {
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

async function createHotel(formData: FormData): Promise<Hotel> {
  const token = localStorage.getItem('token')
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/hotels`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
  const data = await response.json()
  if (!data.success) {
    throw new Error(data.message)
  }
  return data.data
}

async function updateHotel(id: number, formData: FormData): Promise<Hotel> {
  const token = localStorage.getItem('token')
  formData.append('_method', 'PUT') // For Laravel PUT request
  
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/hotels/${id}`, {
    method: 'POST', // Using POST with _method: PUT for FormData
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
  const data = await response.json()
  if (!data.success) {
    throw new Error(data.message)
  }
  return data.data
}

async function fetchCities(): Promise<City[]> {
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

// Table Row Component
interface HotelTableRowProps {
  hotel: Hotel
  onEdit: (hotel: Hotel) => void
  onViewDetails: (hotel: Hotel) => void
  onDelete: (id: number) => void
}

const HotelTableRow = ({ hotel, onEdit, onViewDetails, onDelete }: HotelTableRowProps) => {
  return (
    <TableRow key={hotel.id}>
      <TableCell>{hotel.id}</TableCell>
      <TableCell>{hotel.name}</TableCell>
      <TableCell>{hotel.address}</TableCell>
      <TableCell>{hotel.city.name}</TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-yellow-600 relative group"
            onClick={() => onEdit(hotel)}
          >
            <Edit className="h-4 w-4" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
              Edit Hotel
            </span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-yellow-600 relative group"
            onClick={() => onViewDetails(hotel)}
          >
            <Eye className="h-4 w-4" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
              View Details
            </span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(hotel.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

export default function HotelsPage() {
  // State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
  const [search, setSearch] = useState('')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [hotelToDelete, setHotelToDelete] = useState<Hotel | null>(null)
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([])
  const [selectedFacilities, setSelectedFacilities] = useState<number[]>([])
  const [amenities, setAmenities] = useState<string[]>([])
  const baseImageInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [baseImagePreview, setBaseImagePreview] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  // Query client
  const queryClient = useQueryClient()

  // Queries
  const { data: hotels, isLoading, isError } = useQuery({
    queryKey: ['hotels'],
    queryFn: fetchHotels,
  })

  const { data: hotelDetails } = useQuery({
    queryKey: ['hotel', selectedHotel?.id],
    queryFn: () => selectedHotel ? fetchHotelDetails(selectedHotel.id) : null,
    enabled: !!selectedHotel,
  })

  const { data: cities } = useQuery<City[]>({
    queryKey: ['cities'],
    queryFn: fetchCities,
  })

  const { data: facilities } = useQuery<Facility[]>({
    queryKey: ['facilities'],
    queryFn: async () => {
      const token = localStorage.getItem('token')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/facilities`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (!data.success) {
        throw new Error(data.message)
      }
      return data.data
    },
  })

  // Mutations
  const { toast } = useToast()
  const createMutation = useMutation({
    mutationFn: createHotel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] })
      setIsCreateModalOpen(false)
      toast({
        title: "Success",
        description: "Hotel created successfully",
        variant: "default",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create hotel: ${error.message}`,
        variant: "destructive",
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) => 
      updateHotel(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] })
      setIsEditModalOpen(false)
      toast({
        title: "Success",
        description: "Hotel updated successfully",
        variant: "default",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update hotel: ${error.message}`,
        variant: "destructive",
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem('token')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/hotels/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error('Failed to delete hotel')
      }
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotels'] })
      setIsDeleteModalOpen(false)
      setHotelToDelete(null)
      toast({
        title: "Success",
        description: "Hotel deleted successfully",
        variant: "default",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete hotel: ${error.message}`,
        variant: "destructive",
      })
    },
  })

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }


  const handleEdit = async (hotel: Hotel) => {
    setSelectedHotel(hotel)
    setIsEditModalOpen(true)
  }

  const handleViewDetails = async (hotel: Hotel) => {
    setSelectedHotel(hotel)
    setIsViewModalOpen(true)
  }

  const handleDelete = (hotel: Hotel) => {
    setHotelToDelete(hotel)
    setIsDeleteModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Get the base image from the input and append with correct field name
    const baseImageInput = baseImageInputRef.current;
    if (baseImageInput?.files?.[0]) {
      formData.append('base_image', baseImageInput.files[0]);
    }

    // Add amenities to formData (if any exist)
    if (amenities.length > 0) {
      amenities.forEach((amenity, index) => {
        formData.append(`amenities[${index}]`, amenity);
      });
    }

    // Add facilities to formData (if any exist)
    if (selectedFacilities.length > 0) {
      selectedFacilities.forEach((facilityId, index) => {
        formData.append(`facilities[${index}]`, facilityId.toString());
      });
    }

    // Add gallery images to formData (if any exist)
    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file, index) => {
        formData.append(`images[${index}]`, file);
      });
    }

    try {
      await createMutation.mutateAsync(formData);
      setIsCreateModalOpen(false);
      setSelectedFiles([]);
      setAmenities([]);
      setSelectedFacilities([]);
      setBaseImagePreview(null);
      if (baseImageInputRef.current) {
        baseImageInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Failed to create hotel:', error);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedHotel) return;
    
    const formData = new FormData(e.currentTarget);
    formData.append('_method', 'PUT');
    
    // Add facilities to formData with proper typing
    const finalFacilities = selectedFacilities.length > 0 
      ? selectedFacilities 
      : hotelDetails?.facilities.map(f => f.id) || [];
    
    finalFacilities.forEach((facilityId: number, index: number) => {
      formData.append(`facilities[${index}]`, facilityId.toString());
    });

    // Add new images to formData
    newFiles.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });

    // Add images to delete
    imagesToDelete.forEach((id, index) => {
      formData.append(`deleted_images[${index}]`, id.toString());
    });

    try {
      await updateMutation.mutateAsync({
        id: selectedHotel.id,
        formData,
      });
      setNewFiles([]);
      setImagesToDelete([]);
    } catch (error) {
      console.error('Failed to update hotel:', error);
    }
  };

  // Derived state
  const filteredHotels = useMemo(() => {
    if (!hotels) return []
    
    return hotels.filter((hotel: Hotel) => {
      const searchLower = search.toLowerCase()
      const nameLower = hotel.name.toLowerCase()
      
      if (selectedCity && hotel.city.id.toString() !== selectedCity) {
        return false
      }
      
      if (searchLower) {
        return nameLower.includes(searchLower)
      }
      
      return true
    })
  }, [hotels, selectedCity, search])

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
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-xl text-red-600">Error loading hotels</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Hotel Management</h2>
          <Button 
            className="bg-primary hover:bg-primary/90 text-black hover:text-yellow-600"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Hotel
          </Button>
        </div>

        {/* Search and Filter Section */}
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Search by Name
            </label>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              className="mt-1 block w-full h-12 px-4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base"
              placeholder="Search hotels..."
            />
          </div>
          <div className="w-64">
            <label className="block text-sm font-medium text-gray-700">
              Filter by City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="mt-1 block w-full h-12 px-4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base"
            >
              <option value="">All Cities</option>
              {cities?.map((city: City) => (
                <option key={city.id} value={city.id.toString()}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHotels.length > 0 ? (
                filteredHotels.map((hotel: Hotel) => (
                  <HotelTableRow
                    key={hotel.id}
                    hotel={hotel}
                    onEdit={() => handleEdit(hotel)}
                    onViewDetails={() => handleViewDetails(hotel)}
                    onDelete={() => handleDelete(hotel)}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No hotels found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* View Details Modal */}
      {selectedHotel && (
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Hotel Details for {selectedHotel.name}</DialogTitle>
            </DialogHeader>

            <div className="mt-4 space-y-8 max-h-[70vh] overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold text-lg mb-3">Basic Information</h4>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-gray-500">ID:</dt>
                        <dd>{hotelDetails?.id}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">City:</dt>
                        <dd>{hotelDetails?.city?.name}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Address:</dt>
                        <dd>{hotelDetails?.address}</dd>
                      </div>
                    </dl>
                  </div>

                  {/* Descriptions */}
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold text-lg mb-3">Descriptions</h4>
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-500 mb-1">Hotel Description</h5>
                        <p className="text-gray-700">{hotelDetails?.description}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-500 mb-1">Room Description</h5>
                        <p className="text-gray-700">{hotelDetails?.room_description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold text-lg mb-3">Amenities</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {hotelDetails?.amenities.map((amenity, index) => (
                        <li key={index} className="text-gray-700">{amenity}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Base Image - Added here */}
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold text-lg mb-3">Base Image</h4>
                    <div className="aspect-video relative">
                      <img
                        src={hotelDetails?.image}
                        alt={`${hotelDetails?.name} base image`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Facilities */}
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold text-lg mb-3">Facilities</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {hotelDetails?.facilities.map((facility) => (
                        <div key={facility.id} className="flex items-center space-x-2">
                          <DynamicIcon iconName={facility.icon} className="w-6 h-6" />
                          <span className="text-gray-700">{facility.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hotel Images */}
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold text-lg mb-3">Hotel Images</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {hotelDetails?.images && hotelDetails.images.length > 0 ? (
                        hotelDetails.images.map((image) => (
                          <div key={image.id} className="aspect-video relative">
                            <img
                              src={image.path}
                              alt={`${hotelDetails.name}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 col-span-2">No images available</p>
                      )}
                    </div>
                  </div>

                  {/* Location Map */}
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold text-lg mb-3">Location</h4>
                    <div className="aspect-video w-full rounded-lg overflow-hidden">
                      <iframe
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                          Number(hotelDetails?.longitude) - 0.002
                        }%2C${
                          Number(hotelDetails?.latitude) - 0.002
                        }%2C${
                          Number(hotelDetails?.longitude) + 0.002
                        }%2C${
                          Number(hotelDetails?.latitude) + 0.002
                        }&layer=mapnik&marker=${hotelDetails?.latitude}%2C${hotelDetails?.longitude}`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        className="rounded-lg"
                      />
                    </div>
                    <div className="mt-2 text-sm">
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${hotelDetails?.latitude},${hotelDetails?.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View on Google Maps
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Associated Trips */}
              <div className="p-4 rounded-lg border">
                <h4 className="font-semibold text-lg mb-3">Associated Trips</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  {hotelDetails?.trips.map((trip) => (
                    <div key={trip.id} className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">{trip.name}</h5>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-600">{trip.description}</p>
                        <p className="text-gray-500">
                          {new Date(trip.start_date).toLocaleDateString()} - 
                          {new Date(trip.end_date).toLocaleDateString()}
                        </p>
                        <p className="font-medium">
                          ${trip.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Add New Hotel</DialogTitle>
            <DialogDescription>
              Add a new hotel to the system. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">City</label>
                <select
                  name="city_id"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select a city</option>
                  {cities?.map((city: City) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Hotel Name</label>
                <Input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter hotel name"
                />
              </div>
            </div>

            {/* Address and Coordinates */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Address</label>
              <Input
                type="text"
                name="address"
                required
                placeholder="Enter hotel address"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Longitude</label>
                <Input
                  type="text"
                  name="longitude"
                  required
                  placeholder="Enter longitude"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Latitude</label>
                <Input
                  type="text"
                  name="latitude"
                  required
                  placeholder="Enter latitude"
                />
              </div>
            </div>

            {/* Descriptions */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Hotel Description</label>
              <textarea
                name="description"
                required
                placeholder="Enter hotel description"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Room Description</label>
              <textarea
                name="room_description"
                required
                placeholder="Enter room description"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={4}
              />
            </div>

            {/* Amenities */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Amenities</label>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {amenities.map((amenity: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                    >
                      <span>{amenity}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 rounded-full hover:bg-red-100 hover:text-red-600"
                        onClick={() => {
                          setAmenities(prev => prev.filter((_, i) => i !== index));
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Add new amenity"
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.currentTarget;
                        const value = input.value.trim();
                        if (value) {
                          setAmenities(prev => [...prev, value]);
                          input.value = '';
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      const value = input.value.trim();
                      if (value) {
                        setAmenities(prev => [...prev, value]);
                        input.value = '';
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>

            {/* Facilities */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Facilities</label>
              <div className="grid grid-cols-2 gap-4">
                {facilities?.map((facility) => {
                  const isSelected = selectedFacilities.includes(facility.id);
                  return (
                    <div
                      key={facility.id}
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200
                        ${isSelected 
                          ? 'bg-primary/10 border border-primary/20' 
                          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                        }
                      `}
                      onClick={() => {
                        setSelectedFacilities(prev => 
                          isSelected
                            ? prev.filter(id => id !== facility.id)
                            : [...prev, facility.id]
                        );
                      }}
                    >
                      <DynamicIcon iconName={facility.icon} className="w-5 h-5" />
                      <span className="font-medium">{facility.name}</span>
                      {isSelected && <Check className="ml-auto h-4 w-4 text-primary" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Gallery Images */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Gallery Images</label>
              <Input
                type="file"
                name="images[]"
                accept="image/*"
                multiple
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const files = e.target.files;
                  if (files) {
                    const fileArray = Array.from(files) as File[];
                    setSelectedFiles(prev => [...prev, ...fileArray]);
                  }
                }}
                className="hidden"
                ref={fileInputRef}
              />
              
              <div className="grid grid-cols-2 gap-4">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Gallery preview"
                      className="w-full aspect-video object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          setSelectedFiles(prev => prev.filter((_, i) => i !== index));
                        }}
                        className="h-6 w-6 rounded-full"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {/* Add More Button */}
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-full aspect-video flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                >
                  <Plus className="h-8 w-8 mb-2" />
                  <span className="text-sm">Add Images</span>
                </Button>
              </div>
            </div>

            {/* Base Image */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Base Image</label>
              <Input
                type="file"
                name="image_base"
                accept="image/*"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setBaseImagePreview(URL.createObjectURL(file));
                  }
                }}
                className="hidden"
                ref={baseImageInputRef}
              />
              
              <div className="grid grid-cols-2 gap-4">
                {baseImagePreview && (
                  <div className="relative group">
                    <img
                      src={baseImagePreview}
                      alt="Base image preview"
                      className="w-full aspect-video object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          setBaseImagePreview(null);
                          if (baseImageInputRef.current) {
                            baseImageInputRef.current.value = '';
                          }
                        }}
                        className="h-6 w-6 rounded-full"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                
                {!baseImagePreview && (
                  <Button
                    type="button"
                    onClick={() => baseImageInputRef.current?.click()}
                    className="h-full aspect-video flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                  >
                    <Plus className="h-8 w-8 mb-2" />
                    <span className="text-sm">Add Base Image</span>
                  </Button>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setSelectedFiles([]);
                  setAmenities([]);
                  setSelectedFacilities([]);
                  setBaseImagePreview(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={
                  createMutation.isPending || 
                  selectedFiles.length === 0 || 
                  !baseImagePreview ||
                  selectedFacilities.length === 0 ||
                  amenities.length === 0
                }
                className="bg-[#18181B] text-white hover:bg-[#27272A] hover:text-yellow-600"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Hotel'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      {selectedHotel && (
        <Dialog open={isEditModalOpen} onOpenChange={(open) => {
          setIsEditModalOpen(open)
          if (!open) {
            setNewFiles([])
            setImagesToDelete([])
          }
        }}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Hotel: {hotelDetails?.name}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleEditSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">City</label>
                  <select
                    name="city_id"
                    required
                    defaultValue={hotelDetails?.city?.id}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {cities?.map((city: City) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Hotel Name</label>
                  <Input
                    type="text"
                    name="name"
                    required
                    defaultValue={hotelDetails?.name}
                    placeholder="Enter hotel name"
                  />
                </div>
              </div>

              {/* Address and Coordinates */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Address</label>
                <Input
                  type="text"
                  name="address"
                  required
                  defaultValue={hotelDetails?.address}
                  placeholder="Enter hotel address"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Longitude</label>
                  <Input
                    type="text"
                    name="longitude"
                    required
                    defaultValue={hotelDetails?.longitude}
                    placeholder="Enter longitude"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Latitude</label>
                  <Input
                    type="text"
                    name="latitude"
                    required
                    defaultValue={hotelDetails?.latitude}
                    placeholder="Enter latitude"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Hotel Description</label>
                <textarea
                  name="description"
                  required
                  defaultValue={hotelDetails?.description}
                  placeholder="Enter hotel description"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Room Description</label>
                <textarea
                  name="room_description"
                  required
                  defaultValue={hotelDetails?.room_description}
                  placeholder="Enter room description"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={4}
                />
              </div>

              {/* Base Image */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Base Image</label>
                <div className="relative">
                  <Input
                    type="file"
                    name="base_image"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        const url = URL.createObjectURL(file);
                        setBaseImagePreview(url);
                      }
                    }}
                    className="hidden"
                    ref={baseImageInputRef}
                  />
                  
                  <div 
                    onClick={() => baseImageInputRef.current?.click()}
                    className="cursor-pointer group relative w-full aspect-video rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors"
                  >
                    {(baseImagePreview || hotelDetails?.image) ? (
                      <img
                        src={baseImagePreview || hotelDetails?.image}
                        alt="Base image"
                        className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <Plus className="h-8 w-8 mb-2" />
                        <span className="text-sm">Click to add base image</span>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm font-medium">Click to change image</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Amenities</label>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {(amenities.length > 0 ? amenities : hotelDetails?.amenities)?.map((amenity: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                      >
                        <span>{amenity}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 rounded-full hover:bg-red-100 hover:text-red-600"
                          onClick={() => {
                            setAmenities((prev: string[]) => prev.length > 0 
                              ? prev.filter((_: string, i: number) => i !== index)
                              : hotelDetails?.amenities.filter((_: string, i: number) => i !== index) || []
                            );
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Add new amenity"
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.currentTarget;
                          const value = input.value.trim();
                          if (value) {
                            setAmenities((prev: string[]) => prev.length > 0 
                              ? [...prev, value]
                              : [...(hotelDetails?.amenities || []), value]
                            );
                            input.value = '';
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        const value = input.value.trim();
                        if (value) {
                          setAmenities((prev: string[]) => prev.length > 0 
                            ? [...prev, value]
                            : [...(hotelDetails?.amenities || []), value]
                          );
                          input.value = '';
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              {/* Facilities */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Current Facilities</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {hotelDetails?.facilities.map((facility) => {
                      const isRemoved = selectedFacilities.length > 0 && 
                        !selectedFacilities.includes(facility.id);

                      return (
                        <div
                          key={facility.id}
                          className={`
                            flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
                            ${isRemoved 
                              ? 'bg-red-50 text-red-600 border border-red-200' 
                              : 'bg-primary/10 border border-primary/20'
                            }
                          `}
                        >
                          <DynamicIcon 
                            iconName={facility.icon} 
                            className={`w-5 h-5 transition-opacity ${isRemoved ? 'opacity-50' : ''}`}
                          />
                          <span className="font-medium">{facility.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className={`
                              h-6 w-6 rounded-full ml-1
                              ${isRemoved 
                                ? 'hover:bg-red-100 hover:text-red-700' 
                                : 'hover:bg-primary/20'
                              }
                            `}
                            onClick={() => {
                              setSelectedFacilities(prev => {
                                const current = prev.length > 0 
                                  ? prev 
                                  : hotelDetails.facilities.map(f => f.id);
                                return isRemoved
                                  ? [...current, facility.id]
                                  : current.filter(id => id !== facility.id);
                              });
                            }}
                          >
                            {isRemoved ? (
                              <Plus className="h-4 w-4" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      );
                    })}

                    {/* Show newly added facilities */}
                    {facilities?.filter(facility => 
                      !hotelDetails?.facilities.some(f => f.id === facility.id) &&
                      selectedFacilities.includes(facility.id)
                    ).map((facility) => (
                      <div
                        key={facility.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
                          bg-green-50 text-green-600 border border-green-200"
                      >
                        <DynamicIcon iconName={facility.icon} className="w-5 h-5" />
                        <span className="font-medium">{facility.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full ml-1 hover:bg-green-100"
                          onClick={() => {
                            setSelectedFacilities(prev => 
                              prev.filter(id => id !== facility.id)
                            );
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Available Facilities</label>
                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {facilities?.filter(facility => 
                      !hotelDetails?.facilities.some(f => f.id === facility.id) &&
                      !selectedFacilities.includes(facility.id)
                    ).map((facility) => (
                      <div
                        key={facility.id}
                        onClick={() => {
                          setSelectedFacilities(prev => {
                            const current = prev.length > 0 
                              ? prev 
                              : hotelDetails?.facilities.map(f => f.id) || [];
                            return [...current, facility.id];
                          });
                        }}
                        className="flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer
                          transition-all duration-200 hover:shadow-md
                          bg-gray-50 border-gray-200 hover:border-green-300 hover:bg-green-50/50"
                      >
                        <div className="relative">
                          <DynamicIcon iconName={facility.icon} className="w-6 h-6" />
                          <Plus className="absolute -top-1 -right-1 h-3 w-3 text-green-600 bg-white rounded-full opacity-0 group-hover:opacity-100" />
                        </div>
                        <span className="text-sm font-medium">{facility.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Gallery Images */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Gallery Images</label>
                
                {/* Existing Images */}
                <div className="grid grid-cols-2 gap-4">
                  {hotelDetails?.images.map((img) => {
                    const isMarkedForDeletion = imagesToDelete.includes(img.id);
                    return (
                      <div key={img.id} className="relative group">
                        <img
                          src={img.path}
                          alt="Gallery"
                          className={`w-full aspect-video object-cover rounded-lg transition-opacity ${
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
                                setImagesToDelete(prev => [...prev, img.id]);
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

                {/* New Images */}
                <div className="space-y-2">
                  <Input
                    type="file"
                    name="images[]"
                    accept="image/*"
                    multiple
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const files = e.target.files;
                      if (files) {
                        const fileArray = Array.from(files) as File[];
                        setNewFiles(prev => [...prev, ...fileArray]);
                      }
                    }}
                    className="hidden"
                    ref={fileInputRef}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    {newFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="New gallery"
                          className="w-full aspect-video object-cover rounded-lg"
                        />
                        <div className="absolute top-2 right-2">
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                              setNewFiles(prev => prev.filter((_, i) => i !== index));
                            }}
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
                      onClick={() => fileInputRef.current?.click()}
                      className="h-full aspect-video flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                    >
                      <Plus className="h-8 w-8 mb-2" />
                      <span className="text-sm">Add More</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="mt-4 flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Confirmation</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {hotelToDelete?.name}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (hotelToDelete?.id) {
                    deleteMutation.mutate(hotelToDelete.id)
                  }
                }}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <Toaster />
    </AdminLayout>
  )
}
