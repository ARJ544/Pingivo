"use client";
import { useState, useEffect } from "react";
import { Phone, RefreshCcw, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteTempPhone } from "@/app/actions";
import VerifyPhoneUnknownUser from "@/app/verify-phone-unknown-user/verify-phone-unknown-user-client";
import Link from "next/link";

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

  const [finderId, setFinderId] = useState(queryFinderId ? queryFinderId : "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [ownerFound, setOwnerFound] = useState(false);
  const [errorOrSuccessMessage, setErrorOrSuccessMessage] = useState("");
  const [callCredits, setCallCredits] = useState(3);
  const [usedCallCredits, setUsedCallCredits] = useState(0);
  const [creditsLoading, setCreditsLoading] = useState(true);

  useEffect(() => {
    if (!queryFinderId) return;
    setLoading(true);

    const fetchOwner = async () => {
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
          await deleteTempPhone();
          setCallCredits(0);
          setUsedCallCredits(0);
          const errorData = await res.json();
          setErrorOrSuccessMessage(errorData.error || res.statusText);
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

  const handleCall = async () => {
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  const removeTempPhoneId = async () => {
    await deleteTempPhone();
    router.refresh();
  }

  const hasPhoneNumber = phone_num || temp_phone_number;

  return (
    <main className="flex flex-1 justify-center px-4 py-8 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="layout-content-container flex w-full max-w-2xl flex-col gap-8">
        <div className="flex flex-col items-center text-center">
          <h1 className="pb-3 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Contact the Owner
          </h1>

          <p className="max-w-xl text-base leading-normal text-slate-600 dark:text-slate-400">
            Scan the QR code to reach out to the owner.
          </p>
          <div className="flex flex-row items-center gap-1 text-xs">
            TIP:
            <Camera size={12} />
            <p className="max-w-xl text-xs leading-normal text-slate-600 dark:text-slate-400">
              You can also scan the QR with Google Lens or use {" "}
              <Link href="/scan" className="underline font-bold text-blue-600">Pingivo Scanner</Link>
            </p>
          </div>

          <div className="flex w-full flex-col gap-4 pt-8">

            {loading && !ownerFound && <Loader />}

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
                  <Button className="h-12 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 text-white font-semibold rounded-lg transition active:scale-[0.97]">
                    Send Message
                  </Button>

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
                      • 1 credit will be used only if the receiver answers the call.
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      • 1 credit is still deducted if you answer but the other person doesn't — this applies when it happens twice.
                    </p>

                  </div>
                )}

                {errorOrSuccessMessage && (
                  <div className="text-sm text-center font-medium text-green-600 dark:text-green-400">
                    {errorOrSuccessMessage}
                    <br />
                    No verification Required to message
                  </div>
                )}

                {(temp_phone_number || temp_phone_id) && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-3 text-sm space-y-3">

                    <div className="space-y-1">
                      <p className="font-semibold text-amber-700 dark:text-amber-300">
                        Temporary Phone Number Active
                      </p>

                      <p className="text-sm text-amber-600 dark:text-amber-400">
                        You are currently using a temporary phone number to call the owner.
                        This number will automatically reset after <strong>1 hour</strong>.
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={removeTempPhoneId}
                      >
                        Remove Temporary Phone
                      </Button>
                    </div>

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
