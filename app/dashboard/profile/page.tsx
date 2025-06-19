"use client";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { supabase } from "../../lib/supabaseClient";

const initialProfile = {
  full_name: "",
  address: "",
  contact: "",
  birthday: "",
  civil_status: "",
  sss: "",
  philhealth: "",
  tin: "",
  pagibig: "",
  emergency_contact: "",
};

type Profile = typeof initialProfile;

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setFetching(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Not authenticated");
        setFetching(false);
        return;
      }
      setUserId(user.id);
      const { data, error } = await supabase
        .from("employee_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (data) setProfile({ ...initialProfile, ...data });
      if (error && error.code !== "PGRST116") setError(error.message);
      setFetching(false);
    };
    fetchProfile();
     
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      if (!userId) throw new Error("Not authenticated");
      const { error } = await supabase.from("employee_profiles").upsert({
        ...profile,
        user_id: userId,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile.");
    }
    setLoading(false);
  };

  if (fetching) {
    return <div className="w-full flex justify-center items-center min-h-[300px] text-gray-500 dark:text-gray-300">Loading profile...</div>;
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-8 rounded-2xl shadow-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 mt-10">
      <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-300 mb-6">Employee Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Full Name</label>
            <input name="full_name" value={profile.full_name} onChange={handleChange} required className="w-full border p-2 rounded bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100" />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Contact</label>
            <input name="contact" value={profile.contact} onChange={handleChange} required className="w-full border p-2 rounded bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100" />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Birthday</label>
            <input type="date" name="birthday" value={profile.birthday} onChange={handleChange} required className="w-full border p-2 rounded bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100" />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Civil Status</label>
            <select name="civil_status" value={profile.civil_status} onChange={handleChange} required className="w-full border p-2 rounded bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100">
              <option value="">Select</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="widowed">Widowed</option>
              <option value="separated">Separated</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Address</label>
            <textarea name="address" value={profile.address} onChange={handleChange} required className="w-full border p-2 rounded bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">SSS</label>
            <input name="sss" value={profile.sss} onChange={handleChange} className="w-full border p-2 rounded bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100" />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">PhilHealth</label>
            <input name="philhealth" value={profile.philhealth} onChange={handleChange} className="w-full border p-2 rounded bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100" />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">TIN</label>
            <input name="tin" value={profile.tin} onChange={handleChange} className="w-full border p-2 rounded bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100" />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Pag-IBIG</label>
            <input name="pagibig" value={profile.pagibig} onChange={handleChange} className="w-full border p-2 rounded bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100" />
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Emergency Contact</label>
          <input name="emergency_contact" value={profile.emergency_contact} onChange={handleChange} className="w-full border p-2 rounded bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100" />
        </div>
        <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white font-semibold p-2 rounded-lg transition disabled:opacity-50" disabled={loading}>
          {loading ? "Saving..." : "Save Profile"}
        </button>
        {success && <div className="text-green-600 text-center">Profile saved successfully!</div>}
        {error && <div className="text-red-600 text-center">{error}</div>}
      </form>
    </div>
  );
} 