"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

type TimeLog = {
  id: string;
  user_id: string;
  time_in: string;
  time_out: string | null;
  created_at?: string;
  updated_at?: string;
};

function getMonthRange(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

export default function TimeLogsPage() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<TimeLog[]>([]);
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const router = useRouter();

  useEffect(() => {
    const getUserAndLogs = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.replace("/signin");
        return;
      }
      const { start, end } = getMonthRange(month);
      const { data: logsData } = await supabase
        .from("time_logs")
        .select("*")
        .eq("user_id", data.user.id)
        .gte("time_in", start.toISOString())
        .lte("time_in", end.toISOString())
        .order("time_in", { ascending: false });
      setLogs(logsData || []);
      setLoading(false);
    };
    getUserAndLogs();
  }, [router, month]);

  const handlePrevMonth = () => {
    setMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const monthLabel = month.toLocaleString("default", { month: "long", year: "numeric" });

  function computeTotalHours(timeIn: string, timeOut: string | null) {
    if (!timeIn || !timeOut) return "-";
    const inDate = new Date(timeIn);
    const outDate = new Date(timeOut);
    const diffMs = outDate.getTime() - inDate.getTime();
    if (diffMs <= 0) return "-";
    const hours = Math.floor(diffMs / 1000 / 60 / 60);
    const mins = Math.floor((diffMs / 1000 / 60) % 60);
    return `${hours}h ${mins}m`;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-8 rounded-2xl shadow-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-300 tracking-tight">Time Logs</h1>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-neutral-800 text-gray-700 dark:text-gray-200 font-semibold hover:bg-blue-100 dark:hover:bg-neutral-700 transition"
            onClick={handlePrevMonth}
          >
            &lt;
          </button>
          <span className="font-medium text-lg text-gray-800 dark:text-gray-100 min-w-[120px] text-center">{monthLabel}</span>
          <button
            className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-neutral-800 text-gray-700 dark:text-gray-200 font-semibold hover:bg-blue-100 dark:hover:bg-neutral-700 transition"
            onClick={handleNextMonth}
            disabled={month.getMonth() === new Date().getMonth() && month.getFullYear() === new Date().getFullYear()}
          >
            &gt;
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-blue-100 dark:bg-neutral-800 text-blue-900 dark:text-blue-200">
              <th className="px-4 py-2 border-b font-semibold text-left">Date</th>
              <th className="px-4 py-2 border-b font-semibold text-left">Time In</th>
              <th className="px-4 py-2 border-b font-semibold text-left">Time Out</th>
              <th className="px-4 py-2 border-b font-semibold text-left">Total Hours</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-300">Loading...</td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-300">No time logs for this month.</td>
              </tr>
            ) : (
              logs.map((log) => {
                const date = new Date(log.time_in).toLocaleDateString();
                const timeIn = log.time_in ? new Date(log.time_in).toLocaleTimeString() : "-";
                const timeOut = log.time_out ? new Date(log.time_out).toLocaleTimeString() : "-";
                const total = computeTotalHours(log.time_in, log.time_out);
                return (
                  <tr key={log.id} className="hover:bg-blue-50 dark:hover:bg-neutral-800 transition">
                    <td className="px-4 py-2 border-b">{date}</td>
                    <td className="px-4 py-2 border-b">{timeIn}</td>
                    <td className="px-4 py-2 border-b">{timeOut}</td>
                    <td className="px-4 py-2 border-b">{total}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 