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
  const [errorOrSuccessMessage, setErrorOrSuccessMessage] = useState("");
  const [callCredits, setCallCredits] = useState(3);
  const [usedCallCredits, setUsedCallCredits] = useState(0);
  const [creditsLoading, setCreditsLoading] = useState(true);

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
      } catch (err: any) {
        setMessage(err.message || "User not found");
        setOwnerFound(false);
      } finally {
        setLoading(false);
      }
    };

    fetchOwner();
  }, [queryFinderId]);
  useEffect(() => {
    const fetchCallCredits = async () => {
      try {
        setCreditsLoading(true);
        const res = await fetch("/api/get-call-credits");

        if (!res.ok) {
          setCallCredits(0);
          setUsedCallCredits(0);
          return;
        }

        const result = await res.json();

        if (result.success) {
          setCallCredits(result.callCredits);
          setUsedCallCredits(result.creditsUsed);
        } else {
          setCallCredits(0);
          setUsedCallCredits(0);
        }
      } catch (err) {
        setCallCredits(3);
      } finally {
        setCreditsLoading(false);
      }
    };

    fetchCallCredits();
  }, []);

  const getResetTimeInLocalZone = () => {
    const now = new Date();
    const utcMidnightToday = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      0, 0, 0
    ));

    const formatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'longGeneric',
    });

    return formatter.format(utcMidnightToday);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!finderId.trim()) {
      setMessage("Please enter a finder ID");
      return;
    }

    router.push(`/search?finder_id=${encodeURIComponent(finderId.trim().toLowerCase())}`);
    setMessage("");
  };
  const handleCall = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/voice", {
        method: "POST",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      setErrorOrSuccessMessage(
        "Call started for 60s. Incoming shortly - verify the last 4 digits (8181)."
      );
    } catch (err: any) {
      setErrorOrSuccessMessage(err.message);
    } finally {
      setLoading(false);
    }
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
            <form onSubmit={handleSearch} className="flex flex-col gap-3">
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
                    placeholder="e.g. wy863jd-acvxhs2"
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

            {ownerFound && (
              <div className="space-y-4 pt-4">

                <div className="grid grid-cols-2 gap-3">

                  <Button className="h-12 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 text-white font-semibold rounded-lg transition active:scale-[0.97]">
                    Send Message
                  </Button>

                  {hasPhoneNumber ? (
                    <Button
                      disabled={loading || callCredits <= 0 || creditsLoading}
                      onClick={handleCall}
                      className="h-12 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Call Owner
                    </Button>
                  ) : (
                    <Link
                      href={`/verify-phone-unknown-user?next=${encodeURIComponent(
                        finderId
                      )}`}
                    >
                      <Button className="h-12 w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition active:scale-[0.97]">
                        Verify Phone
                      </Button>
                    </Link>
                  )}
                </div>

                {hasPhoneNumber && (
                  <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 space-y-2">

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-700 dark:text-slate-300">
                        Credits: <strong className="text-blue-600 dark:text-blue-400">{callCredits}</strong> left
                      </span>

                      <span className="text-slate-500 dark:text-slate-400 text-xs">
                        {usedCallCredits} used • resets {getResetTimeInLocalZone()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      • 1 credit will be used only if the receiver answers the call
                    </p>

                  </div>
                )}

                {errorOrSuccessMessage && (
                  <div className="text-sm text-center font-medium text-green-600 dark:text-green-400">
                    {errorOrSuccessMessage}
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
