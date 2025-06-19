"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [payrollTotal, setPayrollTotal] = useState(0);
  const [payrollPending, setPayrollPending] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const checkSessionAndFetch = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.replace("/admin/signin");
        return;
      }
      // Fetch employee count
      const { count: empCount } = await supabase.from("users").select("id", { count: "exact", head: true });
      setEmployeeCount(empCount || 0);
      // Fetch payroll total (sum of all payrolls, example table: payrolls)
      const { data: payrolls } = await supabase.from("payrolls").select("amount");
      setPayrollTotal(payrolls ? payrolls.reduce((sum, p) => sum + (p.amount || 0), 0) : 0);
      // Fetch pending payrolls (example: payrolls with status 'pending')
      const { count: pendingCount } = await supabase.from("payrolls").select("id", { count: "exact", head: true }).eq("status", "pending");
      setPayrollPending(pendingCount || 0);
      setLoading(false);
    };
    checkSessionAndFetch();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-neutral-900">
        <div className="text-lg text-gray-600 dark:text-gray-300">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-8 rounded-2xl shadow-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800">
      <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-300 mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-blue-50 dark:bg-neutral-800 border border-blue-100 dark:border-neutral-700 rounded-xl p-6 flex flex-col items-center">
          <span className="text-4xl font-extrabold text-blue-700 dark:text-blue-300">{employeeCount}</span>
          <span className="text-gray-700 dark:text-gray-200 mt-2 font-medium">Employees</span>
        </div>
        <div className="bg-blue-50 dark:bg-neutral-800 border border-blue-100 dark:border-neutral-700 rounded-xl p-6 flex flex-col items-center">
          <span className="text-4xl font-extrabold text-green-600">₱{payrollTotal.toLocaleString()}</span>
          <span className="text-gray-700 dark:text-gray-200 mt-2 font-medium">Total Payroll</span>
        </div>
        <div className="bg-blue-50 dark:bg-neutral-800 border border-blue-100 dark:border-neutral-700 rounded-xl p-6 flex flex-col items-center">
          <span className="text-4xl font-extrabold text-yellow-500">{payrollPending}</span>
          <span className="text-gray-700 dark:text-gray-200 mt-2 font-medium">Pending Payrolls</span>
        </div>
      </div>
      <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-8 mt-8">
        <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-4">Payroll Overview (Sample Graph)</h2>
        {/* Placeholder SVG for a graph - replace with a real chart library for production */}
        <div className="w-full flex justify-center">
          <svg width="400" height="180" viewBox="0 0 400 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="400" height="180" rx="16" fill="#f1f5f9" />
            <polyline points="30,150 80,100 130,120 180,60 230,80 280,40 330,90 380,70" fill="none" stroke="#2563eb" strokeWidth="4" />
            <circle cx="30" cy="150" r="5" fill="#2563eb" />
            <circle cx="80" cy="100" r="5" fill="#2563eb" />
            <circle cx="130" cy="120" r="5" fill="#2563eb" />
            <circle cx="180" cy="60" r="5" fill="#2563eb" />
            <circle cx="230" cy="80" r="5" fill="#2563eb" />
            <circle cx="280" cy="40" r="5" fill="#2563eb" />
            <circle cx="330" cy="90" r="5" fill="#2563eb" />
            <circle cx="380" cy="70" r="5" fill="#2563eb" />
          </svg>
        </div>
        <div className="text-center text-gray-500 dark:text-gray-400 mt-4">Payroll trends for the last 8 periods (sample data)</div>
      </div>
    </div>
  );
} 