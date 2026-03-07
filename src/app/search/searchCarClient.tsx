"use client";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SearchCar({
  is_loggedin,
  phone_num,
  temp_phone_number,
}: {
  is_loggedin: boolean;
  phone_num: string | undefined;
  temp_phone_number: string | undefined;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryFinderId = searchParams.get("finder_id");

  const [finderId, setFinderId] = useState(queryFinderId ? queryFinderId : "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [ownerFound, setOwnerFound] = useState(false);

  const isFindIdValid = finderId.length >= 6 && finderId.length <= 20;

  useEffect(() => {
    if (!queryFinderId) return;

    const fetchOwner = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?finder_id=${queryFinderId}`);

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Request failed");
        }

        const data = await res.json();
        setOwnerFound(true);
        setMessage("User found! You can now message them.");
      } catch (err: any) {
        setMessage(err.message || "User not found");
        setOwnerFound(false);
      } finally {
        setLoading(false);
      }
    };

    fetchOwner();
  }, [queryFinderId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!finderId.trim()) {
      setMessage("Please enter a finder ID");
      return;
    }

    router.push(`/search?finder_id=${encodeURIComponent(finderId)}`);
    setMessage("");
  };

  const hasPhoneNumber = phone_num || temp_phone_number;

  return (
    <main className="flex flex-1 justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="layout-content-container flex w-full max-w-2xl flex-col gap-8">
        <div className="flex flex-col items-center text-center">
          <h1 className="pb-3 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Find a Vehicle Owner
          </h1>

          <p className="max-w-xl text-base leading-normal text-slate-600 dark:text-slate-400">
            Enter the unique Finder ID from QR code to reach out to the owner.
          </p>

          <div className="flex w-full flex-col gap-4 pt-8">
            {/* Input */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <label className="flex flex-col">
                <span className="pb-2 text-left text-sm font-semibold text-slate-800 dark:text-slate-300">
                  Finder ID
                </span>

                <div className="relative w-full">
                  <Search
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                  />

                  <input
                    value={finderId}
                    onChange={(e) => setFinderId(e.target.value.trim())}
                    maxLength={20}
                    placeholder="e.g. a1b2c3d4e5f6"
                    className="h-14 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-12 pr-4 text-lg font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 transition-all"
                  />
                </div>
              </label>

              {finderId && !isFindIdValid && (
                <p className="text-xs text-red-500">
                  Finder ID must be between 6 and 20 characters
                </p>
              )}

              {/* Search Button */}
              <Button
                type="submit"
                disabled={loading || !isFindIdValid || !finderId.trim()}
                className="h-12 w-full rounded-lg bg-blue-500 px-6 text-base font-bold text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500/40 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? "Searching..." : "Search Owner"}
              </Button>
            </form>

            {/* Message Display */}
            {message && (
              <div className={`p-4 rounded-lg text-center text-sm font-medium ${ownerFound
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                }`}>
                {message}
              </div>
            )}

            {/* Action Buttons - Show if owner found and user has phone number */}
            {ownerFound && (
              <div className="flex flex-col gap-3 pt-4">
                <Button className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-all">
                  Send Message
                </Button>
                {hasPhoneNumber ? (
                  <Button className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-all">
                    Call Owner
                  </Button>

                ) : (
                  <Link
                    href={`/verify-phone-unknown-user?next=${encodeURIComponent(finderId)}`}
                  >
                      <Button className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-all">
                      Verify Phone to Call
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
