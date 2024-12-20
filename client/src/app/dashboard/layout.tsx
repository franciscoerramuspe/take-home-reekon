'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Logo } from "@/components/logo";
import { LogOut, BarChart2, Briefcase, BarChart3, AlertCircle, Menu } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const NavLink = ({ href, icon: Icon, children }: { href: string; icon: React.ElementType; children: React.ReactNode }) => (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 text-sm transition-colors",
        pathname === href 
          ? "text-[#FFD700] font-medium" 
          : "text-neutral-400 hover:text-neutral-200"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </Link>
  );

  const MobileNavLink = ({ href, icon: Icon, children }: { href: string; icon: React.ElementType; children: React.ReactNode }) => (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 py-3 text-base transition-colors",
        pathname === href 
          ? "text-[#FFD700] font-medium" 
          : "text-neutral-400 hover:text-neutral-200"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{children}</span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="fixed top-0 left-0 right-0 z-10 border-b border-neutral-800/50 backdrop-blur-sm">
        <div className="h-14 bg-black/95">
          <div className="mx-auto h-full px-4">
            <div className="flex h-full items-center justify-between">
              <div className="flex items-center gap-8">
                <Link 
                  href="/dashboard"
                  className="flex items-center gap-2"
                >
                  <Logo />
                  <span className={cn(
                    "text-base font-semibold",
                    pathname === '/dashboard' ? "text-[#FFD700]" : "text-white"
                  )}>
                    Dashboard
                  </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-2">
                  <NavLink href="/dashboard/jobs" icon={Briefcase}>
                    Jobs
                  </NavLink>
                  <NavLink href="/dashboard/errors" icon={BarChart2}>
                    Error Reports
                  </NavLink>
                  <NavLink href="/dashboard/errors/analytics" icon={BarChart3}>
                    Error Analytics
                  </NavLink>
                  <NavLink href="/dashboard/errors/logs" icon={AlertCircle}>
                    Error Logs
                  </NavLink>
                </nav>
              </div>

              {/* Desktop Logout */}
              <button 
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden text-neutral-400 hover:text-neutral-200">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0 bg-black/95 border-neutral-800/50 backdrop-blur-sm">
                  <SheetHeader className="p-6 border-b border-neutral-800/50">
                    <SheetTitle>
                      <div className="flex items-center gap-2">
                        <Logo />
                        <span className="text-base font-semibold text-white">
                          Dashboard
                        </span>
                      </div>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col px-4 py-6">
                    <nav className="flex flex-col space-y-1">
                      <MobileNavLink href="/dashboard/jobs" icon={Briefcase}>
                        Jobs
                      </MobileNavLink>
                      <MobileNavLink href="/dashboard/errors" icon={BarChart2}>
                        Error Reports
                      </MobileNavLink>
                      <MobileNavLink href="/dashboard/errors/analytics" icon={BarChart3}>
                        Error Analytics
                      </MobileNavLink>
                      <MobileNavLink href="/dashboard/errors/logs" icon={AlertCircle}>
                        Error Logs
                      </MobileNavLink>
                    </nav>
                    <div className="mt-auto pt-6 border-t border-neutral-800/50">
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 py-3 w-full text-base text-neutral-400 hover:text-neutral-200 transition-colors"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

