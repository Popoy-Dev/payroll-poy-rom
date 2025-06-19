"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

// Employee type
type Employee = {
  id: string;
  email: string;
};

type TimeLog = {
  id: string;
  time_in: string;
  time_out: string | null;
};

export default function EmployeesPage() {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [logs, setLogs] = useState<TimeLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, email, role");
      setEmployees((data || []).filter(emp => emp.role !== 'admin').map(({ id, email }) => ({ id, email })));
      setLoading(false);
    };
    fetchEmployees();
  }, []);

  const handleViewLogs = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
    fetchLogs(employee.id, month);
  };

  const fetchLogs = async (userId: string, monthDate: Date) => {
    setLogsLoading(true);
    const start = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const end = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59, 999);
    const { data } = await supabase
      .from("time_logs")
      .select("id, time_in, time_out")
      .eq("user_id", userId)
      .gte("time_in", start.toISOString())
      .lte("time_in", end.toISOString())
      .order("time_in", { ascending: false });
    setLogs(data || []);
    setLogsLoading(false);
  };

  const handlePrevMonth = () => {
    const newMonth = new Date(month.getFullYear(), month.getMonth() - 1, 1);
    setMonth(newMonth);
    if (selectedEmployee) fetchLogs(selectedEmployee.id, newMonth);
  };
  const handleNextMonth = () => {
    const newMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1);
    setMonth(newMonth);
    if (selectedEmployee) fetchLogs(selectedEmployee.id, newMonth);
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
      <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-300 mb-6">Employees</h1>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="bg-blue-50 dark:bg-neutral-800 border border-blue-100 dark:border-neutral-700 rounded-xl p-6 flex flex-col items-center w-full sm:w-auto">
          <span className="text-3xl font-extrabold text-blue-700 dark:text-blue-300">{employees.length}</span>
          <span className="text-gray-700 dark:text-gray-200 mt-2 font-medium">Total Employees</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-blue-100 dark:bg-neutral-800 text-blue-900 dark:text-blue-200">
              <th className="px-4 py-2 border-b font-semibold text-left">Email</th>
              <th className="px-4 py-2 border-b font-semibold text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={2} className="text-center py-8 text-gray-500 dark:text-gray-300">Loading...</td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan={2} className="text-center py-8 text-gray-500 dark:text-gray-300">No employees found.</td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-blue-50 dark:hover:bg-neutral-800 transition">
                  <td className="px-4 py-2 border-b">{emp.email}</td>
                  <td className="px-4 py-2 border-b">
                    <button
                      className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold"
                      onClick={() => handleViewLogs(emp)}
                    >
                      View Time Logs
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Time Logs Modal */}
      {showModal && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-neutral-900 p-8 rounded-xl shadow-xl border border-gray-200 dark:border-neutral-800 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-blue-900 dark:text-blue-200">
                Time Logs for {selectedEmployee.email}
              </h3>
              <button
                className="text-gray-500 hover:text-red-600 text-xl font-bold"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <div className="flex items-center gap-2 mb-4">
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
                  {logsLoading ? (
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
        </div>
      )}
    </div>
  );
} 