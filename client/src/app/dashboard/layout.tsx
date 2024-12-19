'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Logo } from "@/components/logo";
import { LogOut, BarChart2 } from 'lucide-react';

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
      <header className={`fixed top-0 left-0 right-0 z-10 transition-all duration-300 ${isScrolled ? 'bg-yellow-900/20 backdrop-blur-sm' : 'bg-transparent'}`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <Logo />
              <Link href="/dashboard">
                <span className="text-xl font-semibold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  Dashboard
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              <Link 
                href="/dashboard/errors" 
                className={`flex items-center space-x-2 text-sm font-medium transition-colors duration-200
                  ${pathname === '/dashboard/errors' 
                    ? 'text-yellow-400' 
                    : 'text-neutral-400 hover:text-yellow-200'
                  }`}
              >
                <BarChart2 className="w-4 h-4" />
                <span>Error Reports</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 text-sm font-medium text-neutral-400 hover:text-yellow-200 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </nav>
      </header>
      <main className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

