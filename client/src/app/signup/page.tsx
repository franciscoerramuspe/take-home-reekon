'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Logo } from "@/components/logo"

export default function SignUp() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    organizationId: '9c147b50-f35f-443d-ad83-c10fee7645ec'
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Signup failed')
      }

      const data = await response.json()
      localStorage.setItem('token', data.token)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-card p-8 rounded-lg shadow-lg w-[400px]">
        <div className="mb-8">
          <Logo />
        </div>
        <h1 className="text-2xl font-semibold mb-2 text-card-foreground">Sign Up</h1>
        <p className="text-muted-foreground mb-6">Create your account to get started</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 text-card-foreground">First Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-secondary text-secondary-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-card-foreground">Last Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-secondary text-secondary-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-2 text-card-foreground">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 bg-secondary text-secondary-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm mb-2 text-card-foreground">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 bg-secondary text-secondary-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm mb-2 text-card-foreground">Confirm Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 bg-secondary text-secondary-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Sign Up
          </button>
          <p className="text-center text-muted-foreground text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </main>
  )
}

