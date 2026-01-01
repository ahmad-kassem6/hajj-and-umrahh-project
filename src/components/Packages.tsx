'use client'

import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, ArrowLeft, Check, ImageIcon, Loader2, CalendarIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { format } from 'date-fns'
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Types
interface Plan {
  id: number
  name: string
  price: number
  description: string | null
  start_date: string
  end_date: string
  image: { id: number; path: string } | null
  hotels: {
    id: number
    name: string
    city_id: number
    city_name: string
    number_of_nights: number
    description: string
  }[]
}

interface ApiResponse {
  success: boolean
  message: string
  data: Plan[]
}

async function fetchPlans(): Promise<Plan[]> {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/trips`)
  const data: ApiResponse = await response.json()
  if (!data.success) {
    throw new Error(data.message)
  }
  return data.data
}

export default function Packages() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [isFlipped, setIsFlipped] = useState(false)
  const [tickets, setTickets] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [filteredPlans, setFilteredPlans] = useState<Plan[] | null>(null)

  const {
    data: plans,
    error,
    isLoading: plansLoading,
  } = useQuery<Plan[], Error>({
    queryKey: ['plans'],
    queryFn: fetchPlans,
  })

  useEffect(() => {
    if (!selectedDate || !plans) {
      setFilteredPlans(plans || null)
      return
    }

    try {
      const filtered = plans.filter(plan => {
        const planStartDate = new Date(plan.start_date + 'T00:00:00')
        const selectedDateStartOfDay = new Date(selectedDate)
        selectedDateStartOfDay.setHours(0, 0, 0, 0)
        
        const selectedDateStr = format(selectedDateStartOfDay, 'yyyy-MM-dd')
        const planDateStr = format(planStartDate, 'yyyy-MM-dd')
        
        return planDateStr === selectedDateStr
      })

      setFilteredPlans(filtered)
    } catch (error) {
      console.error('Date processing error:', error)
      setFilteredPlans(plans) // Fallback to showing all plans if there's an error
    }
  }, [selectedDate, plans])

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') scrollLeft()
      if (e.key === 'ArrowRight') scrollRight()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleViewDetails = (plan: Plan) => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view trip details and make reservations.",
        variant: "destructive",
      })
      window.location.href = '/auth/login'
      return
    }
    setSelectedPlan(plan)
    setIsFlipped(false)
    setTickets(1)
  }

  const handleCloseModal = () => {
    setSelectedPlan(null)
    setIsFlipped(false)
    setTickets(1)
  }

  const handleConfirm = async () => {
    const token = localStorage.getItem('token')
    if (!token || !selectedPlan) return

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('trip_id', selectedPlan.id.toString())
      formData.append('number_of_tickets', tickets.toString())

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reservations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Reservation Successful",
          description: data.message || "Your reservation has been submitted and is now pending confirmation.",
          variant: "default",
        })
        handleCloseModal()
      } else {
        throw new Error(data.message || "Failed to create reservation. Please try again.")
      }
    } catch (error) {
      toast({
        title: "Reservation Failed",
        description: error instanceof Error ? error.message : "Unable to process your reservation. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (error) {
    toast({
      title: "Error",
      description: `Failed to load packages: ${(error as Error).message}`,
      variant: "destructive",
    })
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          An error occurred. Please try again later or contact support.
        </div>
      </div>
    )
  }

  if (plansLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-sm text-muted-foreground">Loading our packages...</p>
      </div>
    )
  }

  return (
    <div className="relative w-full overflow-hidden bg-background py-12">
      <div className="container mx-auto px-4 md:px-[5%]">
        <div className="mb-8 flex items-center justify-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[240px] justify-start text-left font-normal hover:bg-yellow-600 hover:text-white transition-colors"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(new Date(selectedDate), "PPP")
                ) : (
                  <span>Choose departure date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {selectedDate && (
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedDate(undefined)
                setFilteredPlans(plans || null)
              }}
              className="h-8 px-2 ml-2 hover:bg-yellow-600 hover:text-white transition-colors"
            >
              Reset filter
            </Button>
          )}
        </div>

        {filteredPlans?.length === 0 && selectedDate && (
          <div className="text-center py-8">
            <div className="text-xl font-semibold text-gray-700 mb-2">
              No packages found
            </div>
            <p className="text-gray-500">
              No travel packages are available for {selectedDate ? format(new Date(selectedDate), "PPP") : ''}.
              Please try another date.
            </p>
          </div>
        )}

        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto pb-8 pt-4 hide-scrollbar justify-start md:justify-start"
        >
          {filteredPlans?.map((plan) => (
            <Card
              key={plan.id}
              className="w-[320px] h-[500px] flex-shrink-0 bg-background border-2 border-gray-400 transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105 group relative overflow-hidden rounded-xl flex flex-col"
            >
              <div className="absolute inset-0 z-0 overflow-hidden rounded-xl">
                {plan.image ? (
                  <img
                    src={plan.image.path}
                    alt={`Image for ${plan.name}`}
                    className="w-full h-full object-cover rounded-xl"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-xl">
                    <ImageIcon className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/70 z-10"></div>
              <CardHeader className="relative p-6 pb-2 z-20">
                <CardTitle className="text-2xl font-semibold tracking-wide text-white mb-3">
                  {plan.name}
                </CardTitle>
                <div className="mt-2">
                  <p className="text-sm text-white leading-relaxed">
                    {plan.description || 'No description available'}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="flex-grow z-20 p-4 relative">
                {/* This space is intentionally left empty to push content to top and bottom */}
              </CardContent>
              <CardFooter className="z-20 p-6 mt-auto relative flex flex-col items-start space-y-3">
                <div className="text-2xl font-bold text-white">
                  ${plan.price}
                  <span className="text-base font-normal text-white">
                    /Person
                  </span>
                </div>
                <div className="text-sm text-white">
                  <div className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    Start: {plan.start_date}
                  </div>
                  <div className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    End: {plan.end_date}
                  </div>
                </div>
                {plan.hotels && plan.hotels.length > 0 && (
                  <div className="text-sm text-white">
                    <span className="font-semibold">Featured Hotel:</span>{' '}
                    {plan.hotels[0]?.name ?? 'N/A'} in {plan.hotels[0]?.city_name ?? 'N/A'}
                  </div>
                )}
                <Button 
                  className="w-full bg-white text-black hover:bg-gray-200 transition-colors mt-4"
                  onClick={() => handleViewDetails(plan)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <button
          onClick={scrollLeft}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 rounded-full bg-background p-3 shadow-lg hover:scale-110 transition-transform duration-300"
          aria-label="Scroll left"
        >
          <ArrowLeft className="h-6 w-6 text-foreground" />
        </button>

        <button
          onClick={scrollRight}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 rounded-full bg-background p-3 shadow-lg hover:scale-110 transition-transform duration-300"
          aria-label="Scroll right"
        >
          <ArrowRight className="h-6 w-6 text-foreground" />
        </button>

        <Dialog open={!!selectedPlan} onOpenChange={(open) => {
          if (!open) handleCloseModal();
        }}>
          <DialogContent className="sm:max-w-[700px] h-[90vh] md:h-[600px] w-[95vw] p-0 border-none rounded-none">
            <div className="relative w-full h-full overflow-hidden">
              {selectedPlan && (
                <motion.div
                  initial={false}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6 }}
                  style={{ 
                    position: 'relative',
                    transformStyle: 'preserve-3d',
                    width: '100%',
                    height: '100%',
                    perspective: '1200px'
                  }}
                >
                  {/* Front side */}
                  <motion.div
                    style={{
                      backfaceVisibility: 'hidden',
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      top: 0,
                      left: 0
                    }}
                    animate={{ opacity: isFlipped ? 0 : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative h-full flex flex-col">
                      <div className="absolute inset-0 w-full h-full z-0">
                        {selectedPlan.image ? (
                          <img
                            src={selectedPlan.image.path}
                            alt={selectedPlan.name}
                            className="w-full h-full object-cover object-center"
                          />
                        ) : null}
                        <div className="absolute inset-0 bg-black/60" />
                      </div>
                      
                      {/* Top section - Fixed */}
                      <div className="relative z-10 p-6 border-b border-white/20">
                        <DialogTitle className="text-3xl font-bold text-white mb-4">
                          {selectedPlan.name}
                        </DialogTitle>
                        <p className="text-lg text-white">{selectedPlan.description}</p>
                      </div>

                      {/* Middle section - Scrollable */}
                      <div className="relative z-10 flex flex-col justify-between h-full">
                        {/* Top-to-bottom scrollable area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                          <div>
                            <h4 className="font-semibold text-white text-xl mb-3">Dates</h4>
                            <div className="space-y-2 text-white">
                              <p className="flex items-center">
                                <Check className="mr-2 h-4 w-4 text-primary" />
                                Start: {selectedPlan.start_date}
                              </p>
                              <p className="flex items-center">
                                <Check className="mr-2 h-4 w-4 text-primary" />
                                End: {selectedPlan.end_date}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Bottom-to-top scrollable area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ display: 'flex', flexDirection: 'column-reverse' }}>
                          {selectedPlan.hotels.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-white text-xl mb-3">Hotels</h4>
                              <ul className="list-disc pl-5 space-y-2 text-white">
                                {selectedPlan.hotels.map((hotel) => (
                                  <li key={hotel.id}>
                                    {hotel.name} in {hotel.city_name} ({hotel.number_of_nights} nights)
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Bottom section - Fixed */}
                      <div className="relative z-10 p-6 mt-auto border-t border-white/20 bg-gradient-to-t from-black/80 to-transparent">
                        <Button
                          onClick={() => setIsFlipped(true)}
                          className="w-full"
                          size="lg"
                        >
                          Reserve Now
                        </Button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Back side */}
                  <motion.div
                    style={{
                      backfaceVisibility: 'hidden',
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      top: 0,
                      left: 0,
                      transform: 'rotateY(180deg)'
                    }}
                    animate={{ opacity: isFlipped ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-background h-full flex flex-col">
                      <DialogHeader className="p-6">
                        <DialogTitle>Complete Your Reservation</DialogTitle>
                      </DialogHeader>
                      <div className="px-6 space-y-6 flex-1 overflow-y-auto">
                        <div>
                          <label className="text-sm font-medium">
                            Number of Tickets
                          </label>
                          <div className="flex items-center space-x-4 mt-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setTickets(Math.max(1, tickets - 1))}
                            >
                              -
                            </Button>
                            <span className="text-xl font-semibold min-w-[3ch] text-center">
                              {tickets}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setTickets(Math.min(255, tickets + 1))}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        <div className="border-t pt-4">
                          <div className="flex justify-between text-lg font-semibold">
                            <span>Total Cost:</span>
                            <span>${(selectedPlan.price * tickets).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-6 mt-auto border-t">
                        <div className="flex space-x-4">
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setIsFlipped(false)}
                          >
                            Back
                          </Button>
                          <Button
                            className="w-full"
                            onClick={handleConfirm}
                            disabled={isLoading}
                          >
                            {isLoading ? "Confirming..." : "Confirm Reservation"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </DialogContent>
        </Dialog>
        <Toaster />
      </div>
    </div>
  )
}

