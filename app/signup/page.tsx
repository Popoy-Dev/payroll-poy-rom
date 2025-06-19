"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [emailConfirmationRequired, setEmailConfirmationRequired] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (success && !emailConfirmationRequired) {
      router.push('/dashboard')
    }
  }, [success, router, emailConfirmationRequired])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)
    setEmailConfirmationRequired(false)
    if (!email || !password) {
      setError('Email and password are required.')
      setLoading(false)
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      setLoading(false)
      return
    }
    const { error, data } = await supabase.auth.signUp({ email, password })
    if (error) setError(error.message)
    else {
      setSuccess(true)
      // If email confirmation is required, show message, else redirect
      if (data.user && data.user.confirmed_at === null) {
        setEmailConfirmationRequired(true)
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800 flex items-center justify-center">
      <div className="w-full max-w-md p-10 rounded-2xl shadow-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800">
        <h2 className="text-3xl mb-6 font-extrabold text-center text-blue-900 dark:text-blue-300">Create your account</h2>
        <form onSubmit={handleSignup} className="flex flex-col gap-5">
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 pr-10"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-sm text-gray-500 dark:text-gray-300 focus:outline-none"
                onClick={() => setShowPassword(v => !v)}
                tabIndex={-1}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold p-2 rounded-lg transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
          {error && <div className="text-red-600 text-center">{error}</div>}
          {success && emailConfirmationRequired && <div className="text-green-600 text-center">Check your email for confirmation!</div>}
        </form>
        <div className="mt-6 text-center text-gray-600 dark:text-gray-300">
          Already have an account?{' '}
          <Link href="/signin" className="text-blue-700 hover:underline dark:text-blue-300">Sign in</Link>
        </div>
      </div>
    </div>
  )
} 