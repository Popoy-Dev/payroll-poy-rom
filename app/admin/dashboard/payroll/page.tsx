"use client";
import { supabase } from '@/app/lib/supabaseClient';
import { useEffect, useState } from "react";

const statusOptions = ["all", "pending", "approved"];

type Payroll = {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  created_at: string;
};

export default function PayrollPage() {
  const [loading, setLoading] = useState(true);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [status, setStatus] = useState("all");

  useEffect(() => {
    const fetchPayrolls = async () => {
      let query = supabase.from("payrolls").select("id, user_id, amount, status, created_at").order("created_at", { ascending: false });
      if (status !== "all") query = query.eq("status", status);
      const { data } = await query;
      setPayrolls(data || []);
      setLoading(false);
    };
    fetchPayrolls();
  }, [status]);

  return (
    <div className="w-full max-w-4xl mx-auto p-8 rounded-2xl shadow-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800">
      <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-300 mb-6">Payroll Management</h1>
      <div className="mb-6 flex gap-4 items-center">
        <label className="font-medium text-gray-700 dark:text-gray-200">Status:</label>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="p-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
        >
          {statusOptions.map(opt => (
            <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-blue-100 dark:bg-neutral-800 text-blue-900 dark:text-blue-200">
              <th className="px-4 py-2 border-b font-semibold text-left">Employee</th>
              <th className="px-4 py-2 border-b font-semibold text-left">Amount</th>
              <th className="px-4 py-2 border-b font-semibold text-left">Status</th>
              <th className="px-4 py-2 border-b font-semibold text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-300">Loading...</td>
              </tr>
            ) : payrolls.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-300">No payrolls found.</td>
              </tr>
            ) : (
              payrolls.map((pay) => (
                <tr key={pay.id} className="hover:bg-blue-50 dark:hover:bg-neutral-800 transition">
                  <td className="px-4 py-2 border-b">{pay.user_id}</td>
                  <td className="px-4 py-2 border-b">₱{pay.amount.toLocaleString()}</td>
                  <td className="px-4 py-2 border-b">{pay.status.charAt(0).toUpperCase() + pay.status.slice(1)}</td>
                  <td className="px-4 py-2 border-b">{new Date(pay.created_at).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 