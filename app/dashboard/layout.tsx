'use client'

import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.replace('/signin')
  }

  return (
    <div className='min-h-screen flex bg-gradient-to-br from-blue-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800'>
      {/* Sidebar */}
      <aside className='w-64 bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-800 flex flex-col p-6 gap-6 shadow-lg'>
        <div className='mb-8'>
          <span className='text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-700 to-blue-400 bg-clip-text text-transparent select-none'>
            PayrollPro
          </span>
        </div>
        <nav className='flex flex-col gap-3'>
          <Link
            href='/dashboard'
            className='px-4 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-neutral-800 text-blue-900 dark:text-blue-200 font-medium transition'
          >
            Dashboard
          </Link>

          <Link
            href='/dashboard/profile'
            className='px-4 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-neutral-800 text-blue-900 dark:text-blue-200 font-medium transition'
          >
            Profile
          </Link>

          <Link
            href='/dashboard/timelogs'
            className='px-4 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-neutral-800 text-blue-900 dark:text-blue-200 font-medium transition'
          >
            Time Logs
          </Link>
          <Link
            href='/dashboard/payroll'
            className='px-4 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-neutral-800 text-blue-900 dark:text-blue-200 font-medium transition'
          >
            Payroll
          </Link>
        </nav>
        <div className='mt-auto'>
          <button
            onClick={handleSignOut}
            className='w-full px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition'
          >
            Sign Out
          </button>
        </div>
      </aside>
      {/* Main Content */}
      <main className='flex-1 p-10 flex flex-col items-center justify-center'>
        {children}
      </main>
    </div>
  )
}
