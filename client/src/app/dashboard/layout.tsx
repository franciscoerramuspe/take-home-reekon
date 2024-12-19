'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Logo } from "@/components/logo";
import { LogOut, BarChart3, AlertCircle } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className={`fixed top-0 left-0 right-0 z-10 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-sm' : 'bg-black'}`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <Logo className="w-8 h-8" />
              <Link href="/dashboard" className="text-xl font-semibold text-white hover:text-yellow-400 transition-colors">
                Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex space-x-4">
                <Link 
                  href="/dashboard/errors" 
                  className={`flex items-center text-sm ${pathname === '/dashboard/errors' ? 'text-yellow-400' : 'text-gray-400'} hover:text-yellow-400 transition-colors duration-200`}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Error Analytics
                </Link>
                <Link 
                  href="/dashboard/errors/log" 
                  className={`flex items-center text-sm ${pathname === '/dashboard/errors/log' ? 'text-yellow-400' : 'text-gray-400'} hover:text-yellow-400 transition-colors duration-200`}
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Error Logs
                </Link>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 text-sm font-medium text-gray-400 hover:text-yellow-400 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </nav>
      </header>
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

