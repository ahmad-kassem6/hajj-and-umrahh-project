import { useQuery } from '@tanstack/react-query'
import { AdminLayout } from '@/pages/Layout'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from 'sonner'
import { Spinner } from "@/components/ui/spinner"

interface Trip {
  id: number
  name: string
  price: number
  is_active: boolean
  start_date: string
  end_date: string
  reservations_count: number
}

const fetchTrips = async (): Promise<Trip[]> => {
  const token = localStorage.getItem('token')
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/trips`, {
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

export default function ReservationsDB() {
  const navigate = useNavigate()
  const { data: trips, isLoading, isError, error } = useQuery({
    queryKey: ['trips'],
    queryFn: fetchTrips,
  })

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
    toast.error(`Error loading trips: ${(error as Error).message}`)
    return <AdminLayout>Error loading trips. Please try again.</AdminLayout>
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">
            Packages
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trips?.map((trip: Trip) => (
            <div
              key={trip.id}
              onClick={() => navigate(`/admin/reservations/${trip.id}`)}
              className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer p-6"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {trip.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      ID: {trip.id}
                    </p>
                    <p className="text-sm mt-2">
                      <span className="text-gray-500">Price: </span>
                      <span className="font-medium">${trip.price}</span>
                    </p>
                  </div>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      trip.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {trip.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className="hover:bg-gray-100 hover:text-yellow-600"
                        >
                          View Reservations
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View all reservations for this package</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
