import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import { DynamicIcon } from '@/components/ui/dynamic-icon'
import { useEffect, useState } from 'react'
import { Spinner } from "@/components/ui/spinner"

interface Facility {
  id: number;
  name: string;
  icon: string;
}

interface Image {
  id: number;
  path: string;
}

interface HotelData {
  id: number;
  name: string;
  description: string;
  images: Image[];
  amenities: string[];
  address: string;
  facilities: Facility[];
  longitude: string;
  latitude: string;
  room_description: string;
  city: {
    id: number;
    name: string;
  };
  image: string;
}

export default function HotelDetail() {
  const { id } = useParams<{ id: string }>()
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  const { data: hotel, isLoading, error } = useQuery<HotelData>({
    queryKey: ['hotel', id],
    queryFn: async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/hotels/${id}`);
        console.log('API Response:', response.data);
        
        if (response.data && response.data.data) {
          return response.data.data;
        } else {
          throw new Error('Invalid data structure received from API');
        }
      } catch (error) {
        console.error('Error fetching hotel:', error);
        throw error;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (!api) {
      return
    }

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  useEffect(() => {
    if (!api) {
      return
    }

    const interval = setInterval(() => {
      if (current === api.scrollSnapList().length - 1) {
        api.scrollTo(0)
      } else {
        api.scrollNext()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [api, current])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ height: "calc(100vh - 64px)" }}>
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    console.error('Error details:', error);
    return (
      <div className="flex items-center justify-center" style={{ height: "calc(100vh - 64px)" }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Error Loading Hotel</h1>
          <p className="text-muted-foreground mb-8">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
          <Button asChild>
            <Link to="/hotels">Back to Hotels</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!hotel) {
    return (
      <div className="flex items-center justify-center" style={{ height: "calc(100vh - 64px)" }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Hotel Not Found</h1>
          <p className="text-muted-foreground mb-8">
            Sorry, we couldn't find the hotel you're looking for.
          </p>
          <Button asChild>
            <Link to="/hotels">Back to Hotels</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image Section */}
      <div className="relative h-[70vh] sm:h-[74vh]">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              {hotel.name}
            </h1>
            <p className="mt-2 text-lg text-white/90">{hotel.address}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-8">
          {/* Top Section: Gallery + Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Photo Gallery */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6 relative">
                  <Carousel
                    setApi={setApi}
                    className="w-full"
                  >
                    <CarouselContent>
                      {hotel.images.map((image, index) => (
                        <CarouselItem key={index}>
                          <img
                            src={image.path}
                            alt={`${hotel.name} - Image ${index + 1}`}
                            className="h-[50vh] w-full rounded-lg object-cover"
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                  
                  {/* Dots Navigation */}
                  <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
                    {hotel.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => api?.scrollTo(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          current === index 
                            ? "bg-white w-4" 
                            : "bg-white/50 hover:bg-white/75"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* About Hotel & Amenities */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">About the Hotel</h2>
                  <p className="text-muted-foreground mb-8">{hotel.description }</p>
                  <h2 className="text-2xl font-bold mb-4">About the Rooms</h2>
                  <p className="text-muted-foreground mb-8">{hotel.room_description }</p>
                  
                  <h3 className="text-xl font-bold mb-4">Amenities</h3>
                  <ul className="grid grid-cols-1 gap-4">
                    {hotel.amenities.map((amenity, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <span className="mr-2">•</span>
                        {amenity}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Facilities, Amenities, and Map Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column (Facilities and Amenities) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Facilities */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-6">Facilities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {hotel.facilities.map((facility: Facility, index: number) => (
                      <div key={index} className="flex items-center space-x-3">
                        <DynamicIcon iconName={facility.icon} />
                        <span className="text-sm">{facility.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-6">Amenities</h3>
                  <ul className="grid grid-cols-1 gap-4">
                    {hotel.amenities.map((amenity, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <span className="mr-2">•</span>
                        {amenity}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Right Column (Map) */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-6">Location</h3>
                  <div className="h-[300px] rounded-lg overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight={0}
                      marginWidth={0}
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(hotel.longitude) - 0.01},${parseFloat(hotel.latitude) - 0.01},${parseFloat(hotel.longitude) + 0.01},${parseFloat(hotel.latitude) + 0.01}&layer=mapnik&marker=${hotel.latitude},${hotel.longitude}`}
                    ></iframe>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    {hotel.address}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

