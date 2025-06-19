"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

type TimeLog = {
  id: string;
  user_id: string;
  time_in: string;
  time_out: string | null;
  created_at?: string;
  updated_at?: string;
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLog, setTimeLog] = useState<TimeLog | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const router = useRouter();

  // Fetch user and today's time log
  useEffect(() => {
    const getUserAndLog = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.replace("/signin");
        return;
      }
      setUser(data.user);

      // Fetch today's time log for this user
      const { data: logs, error: logError } = await supabase
        .from("time_logs")
        .select("*")
        .eq("user_id", data.user.id)
        .gte("time_in", new Date(new Date().setHours(0, 0, 0, 0)).toISOString())
        .lte("time_in", new Date(new Date().setHours(23, 59, 59, 999)).toISOString())
        .order("time_in", { ascending: false })
        .limit(1);

      if (!logError && logs && logs.length > 0) {
        setTimeLog(logs[0]);
      } else {
        setTimeLog(null);
      }
      setLoading(false);
    };
    getUserAndLog();
  }, [router]);

  // Handle Time In
  const handleTimeIn = async () => {
    if (!user) return;
    setActionLoading(true);
    const { error } = await supabase.from("time_logs").insert([
      {
        user_id: user.id,
        time_in: new Date().toISOString(),
      },
    ]);
    setActionLoading(false);
    if (!error) {
      // Refresh log
      location.reload();
    }
  };

  // Handle Time Out (with modal)
  const handleTimeOut = async () => {
    setShowTimeoutModal(true);
  };

  // Confirm Time Out
  const confirmTimeOut = async () => {
    if (!user || !timeLog) return;
    setActionLoading(true);
    const { error } = await supabase
      .from("time_logs")
      .update({ time_out: new Date().toISOString() })
      .eq("id", timeLog.id);
    setActionLoading(false);
    setShowTimeoutModal(false);
    if (!error) {
      // Refresh log
      location.reload();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-neutral-900">
        <div className="text-lg text-gray-600 dark:text-gray-300">
          Loading dashboard...
        </div>
      </div>
    );
  }

  const isTimedIn = !!timeLog && !timeLog.time_out;
  const timeInStr = timeLog?.time_in
    ? new Date(timeLog.time_in).toLocaleTimeString()
    : "--:--:--";
  const timeOutStr = timeLog?.time_out
    ? new Date(timeLog.time_out).toLocaleTimeString()
    : "--:--:--";

  return (
    <div className="w-full max-w-2xl p-10 rounded-2xl shadow-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800">
      <header className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-300 tracking-tight">
            Employee Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Welcome{user?.email ? `, ${user.email}` : ""}!
          </p>
        </div>
        <button
          className="px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold transition"
          onClick={async () => {
            await supabase.auth.signOut();
            router.replace("/signin");
          }}
        >
          Sign Out
        </button>
      </header>
      <main className="flex flex-col gap-8">
        {/* Time In/Out Section */}
        <section className="bg-blue-50 dark:bg-neutral-800 border border-blue-100 dark:border-neutral-700 rounded-xl p-8 text-center flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-2">
            Time In / Time Out
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition disabled:opacity-50"
              onClick={handleTimeIn}
              disabled={isTimedIn || actionLoading}
            >
              {isTimedIn ? "Timed In" : "Time In"}
            </button>
            <button
              className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition disabled:opacity-50"
              onClick={handleTimeOut}
              disabled={!isTimedIn || actionLoading}
            >
              {isTimedIn ? "Time Out" : "Timed Out"}
            </button>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-4 text-gray-700 dark:text-gray-200">
            <span>
              Time In: <b>{timeInStr}</b>
            </span>
            <span>
              Time Out: <b>{timeOutStr}</b>
            </span>
            <span>
              Status:{" "}
              <b className={isTimedIn ? "text-green-600" : "text-red-600"}>
                {isTimedIn ? "Working" : "Not Working"}
              </b>
            </span>
          </div>
        </section>
      </main>

      {/* Confirm Time Out Modal */}
      {showTimeoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-neutral-900 p-8 rounded-xl shadow-xl border border-gray-200 dark:border-neutral-800 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4 text-blue-900 dark:text-blue-200">
              Confirm Time Out
            </h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Are you sure you want to time out?
            </p>
            <div className="flex gap-4 justify-end">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-neutral-800 text-gray-800 dark:text-gray-200 font-semibold"
                onClick={() => setShowTimeoutModal(false)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
                onClick={confirmTimeOut}
                disabled={actionLoading}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}