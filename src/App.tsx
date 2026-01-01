import { BrowserRouter, Routes, Route, useLocation, Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import Hotels from './pages/Hotels'
import HotelDetail from './pages/HotelDetail'
import ContactUs from './pages/ContactUs'
import EditProfile from './pages/EditProfile'
import Footer from './components/Footer'
import SignUp from './pages/Auth/SignUp'
import Login from './pages/Auth/Login'
import VerifyAccount from './pages/Auth/VerifyAccount'
import ForgotPW from './pages/Auth/ForgotPW'
import VerifyResetPassword from './pages/Auth/VerifyResetPassword'
import AdminDashboard from './pages/Analatical'
import AdminTrips from './pages/admin/TripsDB'
import AdminHotels from './pages/admin/HotelsDB'
import AdminAdmins from './pages/admin/AdminsDB'
import ReservationsDB from '@/pages/admin/ReservationsDB'
import ShowProfile from '@/pages/ShowProfile'
import CitiesDB from '@/pages/admin/CitiesDB'
import TripReservationsDB from './pages/admin/TripReservationsDB'
import ProtectedRoute from './components/ProtectedRoute'
import HeroImagesDB from './pages/admin/HeroImagesDB'

interface LayoutProps {
  children: React.ReactNode
} 

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation()
  const isAuthPage = location.pathname.startsWith('/auth')
  const isAdminPage = location.pathname.startsWith('/admin')

  return (
    <>
      {!isAuthPage && !isAdminPage && (
        <div className="bg-black">
          <Navbar />
        </div>
      )}
      {children}
      {!isAuthPage && !isAdminPage && <Footer />}
    </>
  )
}

function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
}

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/hotels/:id" element={<HotelDetail />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/edit-profile" element={
            <ProtectedRoute allowedRoles={['user', 'admin', 'super_admin']}>
              <EditProfile />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['user', 'admin', 'super_admin']}>
              <ShowProfile />
            </ProtectedRoute>
          } />

          <Route path="/auth">
            <Route path="login" element={<Login />} />
            <Route path="forgot-password" element={<ForgotPW />} />
            <Route path="sign-up" element={<SignUp />} />
            <Route path="verify-account" element={<VerifyAccount />} />
            <Route
              path="verify-reset-password"
              element={<VerifyResetPassword />}
            />
          </Route>

          {/* New Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="trips" element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminTrips />
              </ProtectedRoute>
            } />
            <Route path="hotels" element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminHotels />
              </ProtectedRoute>
            } />
            <Route path="reservations" element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <ReservationsDB />
              </ProtectedRoute>
            } />
            <Route path="reservations/:tripId" element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <TripReservationsDB />
              </ProtectedRoute>
            } />
            <Route path="cities" element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <CitiesDB />
              </ProtectedRoute>
            } />
            <Route path="hero-images" element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <HeroImagesDB />
              </ProtectedRoute>
            } />
            
            {/* Super Admin Only Route */}
            <Route path="admins" element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <AdminAdmins />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}


export default App
