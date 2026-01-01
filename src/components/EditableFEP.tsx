import React from 'react'
import { Link } from 'react-router-dom'
import alaqeeq00 from '../assets/hotels/alaqeeq00.jpg'
import almadinah00 from '../assets/hotels/almadinah00.jpg'
import hajjVideo from '../assets/hajj.mp4'
import { Button } from '../components/ui/button'

const EditableFEP: React.FC = () => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col items-center w-[75vw]">
        <h2 className="text-3xl font-semibold text-yellow-600 tracking-tight">
          TAWAFAN RITUAL
        </h2>
        <p
          className="text-center text-lg font-normal py-4"
          style={{ fontFamily: 'Times New Roman, serif' }}
        >
          Experience the sacred Tawafan Ritual, an integral part of your
          pilgrimage. This ritual symbolizes the unity of believers in the
          worship of the One God, as they move in harmony around the Kaaba, the
          house of God, seeking His blessings and forgiveness.
        </p>
      </div>
      <div className="flex justify-center items-center w-full py-12">
        <div className="relative w-[75vw] h-[75vh] rounded-lg overflow-hidden shadow-lg">
          <video
            src={hajjVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative h-[400px] overflow-hidden rounded-lg">
            <img
              src={alaqeeq00}
              alt="Luxury Resort View"
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="relative h-[400px] overflow-hidden rounded-lg">
            <img
              src={almadinah00}
              alt="Luxury Private Home Interior"
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>
        <div className="flex flex-col items-center text-center mt-8">
          <h2 className="text-3xl text-yellow-600 font-semibold tracking-tight">OUR HOTELS</h2>
          <p className="text-gray-600 max-w-prose mt-4">
            Discover luxury and comfort with our top-rated hotels:
          </p>
          <h3 className="text-2xl font-semibold text-yellow-600 mt-4">
            Swissotel Al Maqam Makkah
          </h3>
          <p className="text-gray-600 max-w-prose mt-2">
            Located in the Abraj Al Bait complex, offering stunning views of the
            Kaaba.
          </p>
          <h3 className="text-2xl font-semibold mt-4 text-yellow-600">Al Aqeeq Madinah Hotel</h3>
          <p className="text-gray-600 max-w-prose mt-2">
            Situated near Masjid Al-Nabawi, providing comfort and convenience.
          </p>
          <Button
            variant="outline"
            className="mt-4 bg-black text-white border-black hover:bg-yellow-600 hover:border-yellow-600 hover:text-white transition-all duration-300 hover:scale-105"
            onClick={handleScrollToTop}
            asChild
          >
            <Link to="/hotels">
              Discover Hotels
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EditableFEP
