'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Logo } from "@/components/logo"
import { AuthForm, AuthInput, AuthButton, AuthLink } from "@/components/auth-form"

export default function Login() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      localStorage.setItem('token', data.token)
      router.push('/dashboard')
    } catch (err) {
      console.error(err)
      setError('Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-black">
      <div className="w-full max-w-[400px] space-y-6">
        <Logo />
        <AuthForm 
          title="Login" 
          description="Enter your credentials to access your account"
          onSubmit={handleSubmit}
        >
          <AuthInput
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={isLoading}
          />
          <AuthInput
            id="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            disabled={isLoading}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <AuthButton type="submit" isLoading={isLoading}>
            Login
          </AuthButton>
          <div className="text-sm text-center text-neutral-400">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#FFD700] hover:text-[#FFD700]/90">
              Sign up
            </Link>
          </div>
        </AuthForm>
      </div>
    </main>
  )
}

