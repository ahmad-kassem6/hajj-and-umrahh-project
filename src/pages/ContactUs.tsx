import { useEffect, useState } from 'react'
import { FaTwitter, FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Spinner } from "@/components/ui/spinner"

// Add interface for the hero images response
interface HeroImage {
  path: string;
}

export default function ContactUs() {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Add the query to fetch hero images
  const { data: heroImages, isLoading, error } = useQuery<HeroImage[]>({
    queryKey: ['heroImages', 'contact'],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/hero-images/contact-us`
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

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Check for loading and error states
  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner />
    </div>
  );
  
  if (error) return <p>Error loading hero images.</p>;
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[500px]">
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
              className="w-full h-[500px] object-cover"
            />
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
      </div>
      {/* Content Section */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
          {/* Contact Information */}
          <div className="p-8">
            <h1 className="text-3xl font-timesNewRoman font-bold text-center mb-8 w-full -ml-12">
              Contact Us
            </h1>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Company Information */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Our Office</h2>
                  <p className="text-gray-600 leading-relaxed">
                    Islamic Travel and Cultural LLC<br />
                    10400 Eaton Place Fairfax<br />
                    Virginia, USA
                  </p>
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-4">Contact Details</h2>
                  <p className="text-gray-600">
                    Tel: <a href="tel:+17035865240" className="hover:text-yellow-500">+1 (703) 586-5240</a>
                  </p>
                </div>

                {/* Social Media */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Connect With Us</h2>
                  <div className="flex space-x-6">
                    <a href="#" className="text-gray-600 hover:text-yellow-500 transition-colors">
                      <FaTwitter className="w-6 h-6 ml-1" />
                      <span className="sr-only">Twitter</span>
                    </a>
                    <a href="#" className="text-gray-600 hover:text-yellow-500 transition-colors">
                      <FaFacebook className="w-6 h-6 ml-1" />
                      <span className="sr-only">Facebook</span>
                    </a>
                    <a href="#" className="text-gray-600 hover:text-yellow-500 transition-colors">
                      <FaInstagram className="w-6 h-6 ml-1" />
                      <span className="sr-only">Instagram</span>
                    </a>
                    <a href="#" className="text-gray-600 hover:text-yellow-500 transition-colors">
                      <FaTiktok className="w-6 h-6 ml-1" />
                      <span className="sr-only">TikTok</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Our Services</h2>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                      24/7 Support
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                      We Handle All the Details
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                      Flights with Turkish Airlines
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                      Saudi Airlines, and Qatar Airways
                    </li>
                  </ul>
                </div>

                <div>
                  <br></br>
                  <p className="text-gray-600 font-semibold leading-relaxed">
                    We Are Waiting for You for an Unforgettable
                    Spiritual Journey! Contact us today to start 
                    planning your journey.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
