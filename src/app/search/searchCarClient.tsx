"use client";
import { useState, useEffect, useMemo } from "react";
import { Phone, RefreshCcw, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteTempPhone } from "@/app/actions";
import VerifyPhoneUnknownUser from "@/app/verify-phone-unknown-user/verify-phone-unknown-user-client";
import Link from "next/link";
import MessageOwner from "@/components/my_ui/MessageOwner";

function Loader() {
  return (
    <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
      <span className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
      Searching owner...
    </div>
  );
}

export default function SearchCar({
  is_verified,
  phone_num,
  temp_phone_number,
  temp_phone_id,
}: {
  is_verified: boolean;
  phone_num: string | undefined;
  temp_phone_number: string | undefined;
  temp_phone_id: string | undefined;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryFinderId = searchParams.get("finder_id");

  const finderId = queryFinderId ?? "";
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [ownerFound, setOwnerFound] = useState(false);
  const [errorOrSuccessMessage, setErrorOrSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [callCredits, setCallCredits] = useState(3);
  const [usedCallCredits, setUsedCallCredits] = useState(0);
  const [creditsLoading, setCreditsLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (!queryFinderId) return;

    const fetchOwner = async () => {
      try {
        setLoading(true);
        setIsError(false);
        const res = await fetch(`/api/search?finder_id=${queryFinderId}`);

        const result = await res.json()

        if (!res.ok) {
          throw new Error(result.error || "Request failed")
        }

        setOwnerFound(true);
      } catch (err: any) {
        setMessage(err.message || "User not found");
        setOwnerFound(false);
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOwner();
  }, [queryFinderId]);

  useEffect(() => {
    const fetchCallCredits = async () => {
      try {
        setIsError(false);
        setCreditsLoading(true);
        const res = await fetch("/api/get-call-credits");

        if (!res.ok) {
          await deleteTempPhone();
          setCallCredits(0);
          setUsedCallCredits(0);
          const errorData = await res.json();
          setErrorOrSuccessMessage(errorData.error || res.statusText);
          setIsError(true);
          return;
        }

        const result = await res.json();

        if (!result.success) {
          setCallCredits(0);
          setUsedCallCredits(0);
          return;
        }

        setCallCredits(result.callCredits);
        setUsedCallCredits(result.creditsUsed);

      } catch (err) {
        setCallCredits(3);
      } finally {
        setCreditsLoading(false);
      }
    };

    fetchCallCredits();
  }, []);

  const getResetTimeInLocalZone = useMemo(() => {
    const now = new Date()

    const utcMidnightToday = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        0, 0, 0
      )
    )

    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "longGeneric",
    }).format(utcMidnightToday)

  }, []);

  const handleCall = async () => {
    setLoading(true);
    setIsError(false);

    try {
      const res = await fetch("/api/voice", {
        method: "POST",
      });

      const result = await res.json();

      if (!res.ok) {
        await deleteTempPhone();
        throw new Error(result.error || "Something went wrong");
      }

      setErrorOrSuccessMessage(
        "Call started for 60s. Incoming shortly - verify the last 4 digits (8181)."
      );
    } catch (err: any) {
      setErrorOrSuccessMessage(err.message);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };


  const hasPhoneNumber = Boolean(phone_num || temp_phone_number);

  return (
    <main className="flex flex-1 justify-center px-4 py-8 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="layout-content-container flex w-full max-w-2xl flex-col gap-8">
        <div className="flex flex-col items-center text-center">
          <h1 className="pb-3 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Contact the Owner
          </h1>

          <div className="flex flex-wrap items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
            <span>
              You can also scan the QR with {" "}
              <Link href="/scan" className="underline font-bold text-blue-600">
                Pingivo Scanner
              </Link>
            </span>
          </div>

          <div className="flex w-full flex-col gap-4 pt-8">

            {loading && !ownerFound ? <Loader /> : null}

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

                <div className="grid grid-cols-2 gap-3 items-start">

                  {/* Send Message */}
                  <MessageOwner />

                  {/* Call Section */}
                  <div className="flex flex-col gap-1">

                    {hasPhoneNumber ? (
                      <Button
                        disabled={loading || callCredits <= 0 || creditsLoading}
                        onClick={handleCall}
                        className="h-12 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Call Owner
                      </Button>
                    ) : (
                      <VerifyPhoneUnknownUser temp_phone={temp_phone_id} finder_id={finderId} />
                    )}

                    {hasPhoneNumber && is_verified && (
                      <div className="flex flex-col items-end">

                        <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200">
                          <Phone size={10} className="text-primary" />
                          ...{temp_phone_number ? temp_phone_number : phone_num}
                        </div>

                        {!temp_phone_number && (
                          <button
                            onClick={() =>
                              router.push(
                                `/verify-phone-unknown-user?next=${encodeURIComponent(finderId)}`
                              )
                            }
                            className="flex items-center gap-1 text-blue-600 cursor-pointer text-[9px] font-medium hover:underline -mt-1.5"
                          >
                            <RefreshCcw size={10} />
                            change
                          </button>
                        )}

                      </div>
                    )}
                  </div>
                </div>

                {hasPhoneNumber && (

                  <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 shadow-sm text-sm">

                    {/* Top */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 dark:text-slate-400">
                          Credits
                        </span>

                        <span className="px-2 py-0.5 font-semibold rounded-md bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                          {callCredits}
                        </span>
                      </div>

                      <span className="text-xs text-slate-500">
                        {usedCallCredits} used
                      </span>
                    </div>

                    <hr className="my-2 border-slate-200 dark:border-slate-700" />

                    {/* Reset + Info Icon */}
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">

                      <span>Resets {getResetTimeInLocalZone}</span>

                      <button
                        onClick={() => setShowInfo(!showInfo)}
                        className="hover:text-slate-700 dark:hover:text-slate-200 transition"
                      >
                        <Info size={14} />
                      </button>

                    </div>

                    {/* Rules (toggle) */}
                    {showInfo && (
                      <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
                        <p>• Credit used only if receiver answers</p>
                        <p>• If you answer twice but other doesn't → 1 credit deducted</p>
                      </div>
                    )}

                  </div>
                )}

                {errorOrSuccessMessage && (
                  <div
                    className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm
                    ${isError
                        ? "border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-900/20"
                        : "border-green-200 bg-green-50 dark:border-green-900/40 dark:bg-green-900/20"
                      }`}
                  >
                    <span
                      className={`mt-0.5 ${isError ? "text-red-600" : "text-green-600"
                        }`}
                    >
                      {isError ? "✕" : "✓"}
                    </span>

                    <div
                      className={`text-left ${isError
                        ? "text-red-700 dark:text-red-300"
                        : "text-green-700 dark:text-green-300"
                        }`}
                    >
                      {errorOrSuccessMessage}

                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Messaging does not require verification
                      </p>
                    </div>
                  </div>
                )}

                {(temp_phone_number || temp_phone_id) && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg py-4 px-1 text-sm flex items-center justify-between">

                    <p className="text-amber-700 dark:text-amber-300">
                      Temp number active · resets in <strong>1h</strong>
                    </p>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        await deleteTempPhone()
                        router.refresh()
                      }}
                      className="h-7 px-2"
                    >
                      Remove
                    </Button>

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
