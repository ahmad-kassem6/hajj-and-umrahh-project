import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Spinner } from "@/components/ui/spinner"

interface Hotel {
  id: number;
  name: string;
  address: string;
  longitude: string;
  latitude: string;
  room_description: string;
  city: {
    id: number;
    name: string;
  };
  description: string;
  amenities: string[] | null;
  image: string;
}

interface HotelsResponse {
  success: boolean;
  message: string;
  data: Hotel[];
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

interface HeroImage {
  path: string;
}

export default function Hotels() {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  const { data: heroImages, isLoading: heroImagesLoading, error: heroImagesError } = useQuery<HeroImage[]>({
    queryKey: ['heroImages', 'hotels'],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/hero-images/hotels`
      );
      return response.data.data;
    },
  });

  const { data: hotelsData, isLoading: hotelsLoading, error: hotelsError } = useQuery<HotelsResponse>({
    queryKey: ['hotels'],
    queryFn: async () => {
      const response = await axios.get<HotelsResponse>(
        `${import.meta.env.VITE_API_URL}/api/hotels`
      );
      return response.data;
    },
  });

  useEffect(() => {
    if (!heroImages?.length) return;

    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => 
        prev === heroImages.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [heroImages]);

  if (heroImagesLoading || hotelsLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner />
    </div>
  );
  if (heroImagesError || hotelsError) return <p>Error loading data.</p>;

  const hotels = hotelsData?.data || [];

  const getImageUrl = (imageUrl: string) => {
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return `${import.meta.env.VITE_API_URL}${imageUrl}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[70vh] sm:h-[74vh] bg-black">
        {heroImages?.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentHeroIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={getImageUrl(image.path)}
              alt={`Hero ${index + 1}`} 
              className="h-full w-full object-cover opacity-70"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />

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

        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="space-y-4 text-white">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
              Our Hotels
            </h1>
            <p className="text-xl">
              Experience luxury and comfort during your spiritual journey
            </p>
          </div>
        </div>
      </div>

      {/* Hotels Listing */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          {hotels.map((hotel) => (
            <Card
              key={hotel.id}
              className="relative overflow-hidden flex flex-col justify-between"
            >
              <div className="h-64 w-full relative">
                <img
                  src={getImageUrl(hotel.image)}
                  alt={hotel.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallbackElement = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallbackElement) {
                      fallbackElement.style.display = 'flex';
                    }
                  }}
                />
                <div 
                  className="absolute inset-0 bg-gray-200 items-center justify-center text-gray-500 hidden"
                  style={{display: 'none'}}
                >
                  Image not available
                </div>
              </div>
              <CardContent className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <h2 className="mb-2 text-2xl font-bold">{hotel.name}</h2>
                  <p className="mb-4 text-muted-foreground">
                    {hotel.description || hotel.room_description}
                  </p>
                  <ul className="mb-6 space-y-2">
                    <li className="flex items-center text-sm">
                      <span className="mr-2">•</span>
                      {hotel.address}
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="mr-2">•</span>
                      {hotel.city.name}
                    </li>
                    {hotel.amenities && hotel.amenities.map((amenity, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <span className="mr-2">•</span>
                        {amenity}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-auto">
                  <Button asChild className="w-full">
                    <Link to={`/hotels/${hotel.id}`} onClick={scrollToTop}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

