"use client";
import { useMemo } from "react";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteTempPhone } from "@/app/actions";
import MessageOwner from "@/components/my_ui/MessageOwner";
import { useOwnerSearch } from "@/hooks/useOwnerSearch";
import { useCallCredits } from "@/hooks/useCallCredits";

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
  
  const { loading, message, ownerFound, isError } = useOwnerSearch(queryFinderId);
  const { callCredits, usedCallCredits, creditsLoading, refreshCredits } = useCallCredits();


  const resetTime = useMemo(() => {
    const now = new Date();
    const utcMidnightToday = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0)
    );
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "longGeneric",
    }).format(utcMidnightToday);
  }, []);


  const handleCall = async () => {
    const res = await fetch("/api/voice", { method: "POST" });
    const result = await res.json();

    if (!res.ok) {
      await deleteTempPhone();
      throw new Error(result.error || "Something went wrong");
    }

    await refreshCredits();
  };

  const hasPhoneNumber = Boolean(phone_num || temp_phone_number);

  return (
    <main className="flex flex-1 justify-center px-4 py-8 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="layout-content-container flex w-full max-w-2xl flex-col gap-8">
        <div className="flex flex-col items-center text-center">
          <h1 className="pb-3 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Contact the Owner
          </h1>

          <div className="flex w-full flex-col gap-4 pt-8">
            {loading && !ownerFound ? <Loader /> : null}

            {message && (
              <div
                className={`p-4 rounded-lg text-center text-sm font-medium ${ownerFound
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"}`}
              >
                {message}
              </div>
            )}

            {ownerFound && (
              <>

                <MessageOwner
                  autoOpen={ownerFound}
                  onCall={handleCall}
                  hasPhoneNumber={hasPhoneNumber}
                  tempPhoneId={temp_phone_id}
                  finderId={finderId}
                  callCredits={callCredits}
                  usedCallCredits={usedCallCredits}
                  creditsLoading={creditsLoading}
                  resetTime={resetTime}
                />

                {hasPhoneNumber && is_verified && (
                  <div className="flex flex-col items-end gap-0.5">
                    {temp_phone_number && (
                      <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                        ...{temp_phone_number}
                      </span>
                    )}

                    {phone_num && !temp_phone_number && (
                      <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                        ...{phone_num}
                      </span>
                    )}

                    {!temp_phone_number && (
                      <button
                        onClick={() =>
                          router.push(
                            `/verify-phone-unknown-user?next=${encodeURIComponent(finderId)}`
                          )
                        }
                        className="flex items-center gap-1 text-blue-600 cursor-pointer text-[9px] font-medium hover:underline"
                      >
                        <RefreshCcw size={10} />
                        change
                      </button>
                    )}
                  </div>
                )}

                {(temp_phone_number || temp_phone_id) && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg py-4 px-3 text-sm flex items-center justify-between">
                    <p className="text-amber-700 dark:text-amber-300">
                      Temp number active · get removed in <strong>1h</strong>
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        await deleteTempPhone();
                        router.refresh();
                      }}
                      className="h-7 px-2"
                    >
                      Remove
                    </Button>
                  </div>
                )}

              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}