import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { AdminLayout } from './Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Overview } from '@/components/admin/Overview'
import { RecentSales } from '@/components/admin/RecentSales'

interface DashboardData {
  total_users: {
    total: number
    increasing_from_last_month: number
  }
  total_trips: {
    total: number
    increasing_from_last_month: number
  }
  active_trips: {
    total: number
    increasing_from_last_week: number
  }
  active_hotels: {
    total: number
    increasing_from_last_month: number
  }
  earnings_overview: Array<{
    month: string
    earnings: number
  }>
  recent_reservations: Array<{
    reservation_id: number
    user_name: string
    user_email: string
    total_amount: number
  }>
}

export default function AdminDashboard() {
  const { data, isLoading, error } = useQuery<{ data: DashboardData }>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    }
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading dashboard data</div>
  if (!data?.data) return <div>No data available</div>

  const dashboardData = data.data

  return (
    <AdminLayout>
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.total_users.total}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.total_users.increasing_from_last_month > 0 
                  ? `+${dashboardData.total_users.increasing_from_last_month} from last month`
                  : 'No increase from last month'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.total_trips.total}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.total_trips.increasing_from_last_month > 0 
                  ? `+${dashboardData.total_trips.increasing_from_last_month} from last month`
                  : 'No increase from last month'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Packages
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.active_trips.total}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.active_trips.increasing_from_last_week > 0 
                  ? `+${dashboardData.active_trips.increasing_from_last_week} since last week`
                  : 'No increase from last week'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Hotels
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.active_hotels.total}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.active_hotels.increasing_from_last_month > 0 
                  ? `+${dashboardData.active_hotels.increasing_from_last_month} since last month`
                  : 'No increase from last month'}
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview data={dashboardData.earnings_overview} />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentSales data={dashboardData.recent_reservations} />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
