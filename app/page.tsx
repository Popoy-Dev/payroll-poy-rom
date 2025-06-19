import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-neutral-800 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-700 to-blue-400 bg-clip-text text-transparent">
              ZenithPay
            </span>
            <div className="flex gap-4">
              <Link
                href="/signin"
                className="px-4 py-2 rounded-lg text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-neutral-800 transition"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-blue-900 dark:text-blue-300 mb-6">
            Modern Payroll Management Made Simple
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Streamline your payroll process with our comprehensive solution. Time tracking,
            employee management, and payroll processing all in one place.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="px-6 py-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold transition"
            >
              Start Free Trial
            </Link>
            <Link
              href="/signin"
              className="px-6 py-3 rounded-lg border border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-neutral-800 font-semibold transition"
            >
              Live Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white dark:bg-neutral-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-blue-900 dark:text-blue-300 mb-12">
            Everything You Need
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Time Tracking */}
            <div className="p-6 rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-700 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">Time Tracking</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Accurate time tracking with easy clock-in/out functionality and detailed logs.
              </p>
            </div>

            {/* Employee Management */}
            <div className="p-6 rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-700 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">Employee Management</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Manage employee profiles, documents, and access permissions efficiently.
              </p>
            </div>

            {/* Payroll Processing */}
            <div className="p-6 rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-700 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-2">Payroll Processing</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Automated payroll calculations, tax deductions, and payment processing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-xl font-bold text-blue-900 dark:text-blue-300">
              ZenithPay
            </span>
            <div className="flex gap-8 text-gray-600 dark:text-gray-300">
              <a href="#" className="hover:text-blue-700 dark:hover:text-blue-300 transition">Privacy</a>
              <a href="#" className="hover:text-blue-700 dark:hover:text-blue-300 transition">Terms</a>
              <a href="#" className="hover:text-blue-700 dark:hover:text-blue-300 transition">Contact</a>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              © 2025 ZenithPay. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
