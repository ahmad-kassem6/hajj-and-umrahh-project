import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BarChart3, Package, Hotel, UserCog, LogOut, CalendarDays, Building2, Image } from 'lucide-react'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import Logo from '@/assets/ICT.svg'
import { useQuery } from '@tanstack/react-query'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: BarChart3 },
  { name: 'Trips', href: '/admin/trips', icon: Package },
  { name: 'Hotels', href: '/admin/hotels', icon: Hotel },
  { name: 'Cities', href: '/admin/cities', icon: Building2 },
  { name: 'Reservations', href: '/admin/reservations', icon: CalendarDays },
  { name: 'Hero Images', href: '/admin/hero-images', icon: Image },
  { 
    name: 'Admins', 
    href: '/admin/admins', 
    icon: UserCog,
    role: 'super_admin'
  },
]

const fetchUserData = async () => {
  const token = localStorage.getItem('token')
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data.data
}

export function Sidebar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const { data: userData } = useQuery({
    queryKey: ['userData'],
    queryFn: fetchUserData,
  })

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      localStorage.removeItem('token')
      navigate('/auth/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const filteredNavigation = navigation.filter(item => 
    !item.role || item.role.toLowerCase() === userData?.role?.toLowerCase()
  )

  return (
    <div className="flex flex-col h-full">
      {/* Ensure full height */}
      <div className="flex flex-col items-center justify-center h-35 bg-white">
        <Link to="/" className="block h-full">
          <img src={Logo} alt="Logo" className="h-20 w-auto mb-2 mt-2" />
        </Link>
        <span className="text-2xl font-semibold">Admin Panel</span>
      </div>
      <nav className="flex-1 overflow-y-auto bg-white">
        {/* Grow to take up remaining space */}
        <ul className="p-4 space-y-2 mt-4">
          {filteredNavigation.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-gray-200 text-yellow-600'
                      : 'text-gray-600 hover:bg-gray-200 hover:text-yellow-600'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200 bg-white">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-red-600 hover:text-red-500 hover:bg-gray-200"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  )
}
