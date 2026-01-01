import { useQuery } from '@tanstack/react-query';
import { Navigate, useLocation } from 'react-router-dom';
import { Spinner } from "@/components/ui/spinner"

interface User {
  id: number;
  name: string;
  contact: string;
  role: 'user' | 'admin' | 'super_admin';
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

async function fetchUserData(): Promise<User> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');

  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message);
  }
  
  return data.data;
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const location = useLocation();
  
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUserData,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#18181B]">
        <div className="bg-white p-12 rounded-lg shadow-2xl max-w-md w-full text-center">
          <h1 className="text-3xl font-serif font-bold text-[#18181B] mb-6">
            Access Denied
          </h1>
          <div className="w-16 h-1 bg-[#18181B] mx-auto mb-6"></div>
          <p className="text-gray-700 mb-8 font-medium leading-relaxed">
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>
          <button
            onClick={() => window.history.back()}
            className="w-full bg-[#18181B] text-white py-3 px-6 rounded-md hover:bg-[#27272A] transition-colors duration-300 font-medium"
          >
            Return to Previous Page
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 