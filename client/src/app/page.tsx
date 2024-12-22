import Link from 'next/link'
import { Logo } from "@/components/logo"


export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-card p-8 rounded-lg shadow-lg w-[400px]">
        <div className="mb-8">
          <Logo />
        </div>
        <div className="space-y-4">
          <Link
            href="/login"
            className="block w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition-colors text-center"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="block w-full bg-secondary text-secondary-foreground py-2 rounded-lg border border-input hover:bg-secondary/80 transition-colors text-center"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  )
}

