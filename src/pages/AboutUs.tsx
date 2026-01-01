import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'
import { ContactModal } from '../components/ContactModal'
import { Spinner } from "@/components/ui/spinner"
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useState, useEffect } from 'react'

// Add interface for the hero images response
interface HeroImage {
  path: string;
}

export default function AboutUs() {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Add the query to fetch hero images
  const { data: heroImages, isLoading, error } = useQuery<HeroImage[]>({
    queryKey: ['heroImages', 'about'],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/hero-images/about-us`
      );
      return response.data.data;
    },
  });

  // Add effect for auto-rotation
  useEffect(() => {
    if (!heroImages?.length) return;

    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => 
        prev === heroImages.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [heroImages]);

  // Check for loading and error states
  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner />
    </div>
  );
  
  if (error) return <p>Error loading hero images.</p>;
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[70vh] bg-black">
        {heroImages?.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentHeroIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={image.path} 
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
              About Us
            </h1>
            <p className="text-xl">
              Your Trusted Partner for Hajj and Umrah Tours
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold">Hajj and Umrah Tours</h2>
          <p className="text-xl text-muted-foreground">
            Are You Ready for a Spiritual Journey of Purity?
          </p>
        </div>
        <div className="mb-16">
          <h3 className="mb-4 text-2xl font-semibold">
            We Take Care of Everything for Your Comfortable and Spiritual
            Journey with All Inclusive!
          </h3>
          <p className="text-lg text-muted-foreground">
            We organize your Hajj and Umrah visits to the holy lands in the best
            possible way. With years of experience, we offer you a peaceful and
            comfortable experience during your spiritual journey. Every detail
            is carefully considered to ensure that you perform your acts of
            worship in the most beautiful way.
          </p>
        </div>
        <div className="mb-16">
          <h3 className="mb-8 text-2xl font-semibold">Why Choose Us?</h3>
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardContent className="flex flex-col items-center p-6 text-center">
                <CheckCircle className="mb-4 h-12 w-12 text-primary" />
                <h4 className="mb-2 text-xl font-semibold">
                  Luxury Accommodation
                </h4>
                <p>
                  Stay in comfort at 5-star hotels with All inclusive
                  Breakfast-Dinner at the finest hotels in Mecca and Medina.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center p-6 text-center">
                <CheckCircle className="mb-4 h-12 w-12 text-primary" />
                <h4 className="mb-2 text-xl font-semibold">
                  VIP Transfer Shuttle Service
                </h4>
                <p>
                  Enjoy safe and comfortable transfers with private vehicles
                  from the airport to the hotel and to the holy sites.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center p-6 text-center">
                <CheckCircle className="mb-4 h-12 w-12 text-primary" />
                <h4 className="mb-2 text-xl font-semibold">
                  Experienced Guides
                </h4>
                <p>
                  Our knowledgeable and experienced guides will help you perform
                  your Hajj and Umrah rituals in the correct manner.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center p-6 text-center">
                <CheckCircle className="mb-4 h-12 w-12 text-primary" />
                <h4 className="mb-2 text-xl font-semibold">
                  Worship and Educational Programs
                </h4>
                <p>
                  Experience peaceful worship with educational and spiritual
                  programs that guide you throughout your journey.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="mb-16">
          <h3 className="mb-8 text-2xl font-semibold">Our Services</h3>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <li className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-primary" />
              <span>24/7 Support throughout your journey</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-primary" />
              <span>Comprehensive travel arrangements</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-primary" />
              <span>Flights with leading airlines</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-primary" />
              <span>Visa processing assistance</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-primary" />
              <span>Hotel reservations</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-primary" />
              <span>Travel insurance arrangements</span>
            </li>
          </ul>
        </div>

        <div className="mb-16">
          <h3 className="mb-8 text-2xl font-semibold">
            Tour and Excursion Program
          </h3>
          <p className="mb-4 text-lg text-muted-foreground">
            During your spiritual journey, you can visit important holy sites in
            the sacred cities with the guidance of our experienced tour leaders.
            Our program includes visits to blessed locations in both Medina and
            Mecca.
          </p>
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <h4 className="mb-4 text-xl font-semibold">
                  Sites to Visit in Medina
                </h4>
                <ul className="space-y-2">
                  <li>Cemetery of Baqi</li>
                  <li>Mosque of Ghamama (Musalla)</li>
                  <li>Mosque of Abu Bakr as-Siddiq</li>
                  <li>Mount Uhud</li>
                  <li>Mosque of the Two Qiblas (Qiblatain)</li>
                  <li>Mosque of Quba</li>
                  <li>Al-Ghars Water Well</li>
                  <li>Site of the Battle of the Trench</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h4 className="mb-4 text-xl font-semibold">
                  Sites to Visit in Mecca
                </h4>
                <ul className="space-y-2">
                  <li>The House Where Prophet Muhammad (PBUH) Was Born</li>
                  <li>Mount Thawr and Cave</li>
                  <li>Arafat</li>
                  <li>Mount Nur and Cave of Hira</li>
                  <li>Cemetery of Ma'la</li>
                  <li>Mosque of the Jinn</li>
                  <li>Mosque of the Tree (Shajara)</li>
                  <li>Mount of Mercy and Mosque of Sahrat</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center">
          <h3 className="mb-8 text-2xl font-semibold">
            We Are Waiting for You for an Unforgettable Spiritual Journey!
          </h3>
          <p className="mb-8 text-lg text-muted-foreground">
            For Reservations and Detailed Information:
          </p>
          <div className="flex justify-center space-x-4">
            <ContactModal />
          </div>
        </div>
      </div>
    </div>
  )
}
