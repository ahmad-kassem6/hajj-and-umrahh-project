'use client'

import * as React from 'react'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useState, useEffect, useRef } from 'react'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import Navbar from '../components/Navbar'
import Packages from '../components/Packages'
import EditableFEP from '../components/EditableFEP'

// Add interface for the hero images response
interface HeroImage {
  path: string
}

export default function Home() {
  const packagesRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0)

  // Add the query to fetch hero images
  const {
    data: heroImages,
    isLoading,
    error,
  } = useQuery<HeroImage[]>({
    queryKey: ['heroImages', 'home'],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/hero-images/home`,
      )
      return response.data.data
    },
  })

  // Add effect for auto-rotation
  useEffect(() => {
    if (!heroImages?.length) return

    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) =>
        prev === heroImages.length - 1 ? 0 : prev + 1,
      )
    }, 5000)

    return () => clearInterval(timer)
  }, [heroImages])

  React.useEffect(() => {
    if (location.state?.scrollToPackages && packagesRef.current) {
      packagesRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [location])

  const scrollToPackages = () => {
    if (packagesRef.current) {
      packagesRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Check for loading and error states
  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    )

  if (error) return <p>Error loading hero images.</p>

  return (
    <>
      <Navbar />
      <div className="relative h-[70vh] sm:h-[74vh] w-full">
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
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent z-0"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-transparent z-0"></div>
            <div className="absolute inset-0 bg-gradient-to-l from-black/10 via-black/10 to-transparent z-0"></div>
          </div>
        ))}

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

        {/* Content overlay */}
        <div className="absolute inset-0 z-10">
          <div className="container mx-auto h-full flex items-center px-4 sm:px-0">
            <div className="max-w-lg text-white">
              <h2 className="text-3xl sm:text-6xl font-serif tracking-wide mb-4 ml-10 sm:ml-15">
                Hajj and Umrah Tours
              </h2>
              <p className="text-lg sm:text-2xl font-light tracking-wider mb-8 ml-10 sm:ml-15">
                Are You Ready for a Spiritual Journey of Purity?
              </p>
              <div className="ml-10 sm:ml-15">
                <Button
                  size="lg"
                  className="bg-white/90 text-black hover:bg-yellow-600 hover:text-white transform-all duration-300 hover:scale-105 text-base tracking-wide font-medium px-8 py-6"
                  onClick={scrollToPackages}
                >
                  Explore Packages
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Packages Section */}
      <div ref={packagesRef} className="bg-[#f8f9fa] py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-center mx-auto space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl sm:text-4xl font-serif text-gray-800 leading-relaxed">
                We Take Care of Everything for Your
                <span className="block mt-2">
                  Comfortable and Spiritual Journey
                </span>
                <span className="block mt-2">with All Inclusive!</span>
              </h3>
            </div>

            <div className="pt-8">
              <h2 className="text-4xl sm:text-6xl font-serif text-yellow-600 mb-6 tracking-tight">
                Our Packages
              </h2>

              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                Discover our range of thoughtfully crafted packages designed to
                cater to all your needs for a peaceful and enlightening
                pilgrimage. Our services ensure a smooth and memorable journey,
                allowing you to focus entirely on the spiritual experience.
              </p>
            </div>
          </div>
          <Packages />
          <EditableFEP />
        </div>
      </div>
    </>
  )
}
