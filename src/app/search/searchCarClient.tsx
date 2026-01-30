'use client';
import { useState, useEffect } from "react";
import { Car, User, Lock, Mail, Phone, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ShowWarning({ isLoggedin, carNum, onClose }: { isLoggedin: boolean, carNum: string, onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative w-full max-w-md animate-in zoom-in-95 rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">

        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            ⚠️ Important Notice
          </h2>

          <button
            onClick={onClose}
            className="rounded-full p-1 text-zinc-500 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            ✕
          </button>
        </div>

        {/* Content Box */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300">
          {isLoggedin ? (
            <>
              <p className="text-sm font-medium leading-relaxed">
                Your phone number will be changed <span className="font-semibold">temporarily for 1 hour</span>.
              </p>
              <p className="mt-2 text-xs opacity-80 leading-relaxed">
                After this period, your original phone number will be restored automatically.
                You can update your phone number permanently from <span className="font-medium">Update Profile</span>.
                During this 1-hour window, further changes are not allowed.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium leading-relaxed">
                Your phone number will be changed <span className="font-semibold">temporarily for 1 hour</span>.
              </p>
              <p className="mt-2 text-xs opacity-80 leading-relaxed">
                During this time, you won’t be able to modify your phone number again.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <Link href={`/verify-phone-unknown-user?next=${encodeURIComponent(carNum)}`}>
            <Button className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
              Okay, I understand
            </Button>
          </Link>

          <Button
            variant="outline"
            onClick={(onClose)}
            className="rounded-lg px-4 py-2 text-sm"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

function ShowOwnerDetail({ name, carName, car_num, user_ph_num, isVerified, isLoggedin, temp_phone_number }: { name: string, carName: string, car_num: string, user_ph_num: string, isVerified: boolean, isLoggedin: boolean, temp_phone_number: string | undefined }) {
  const [showWarning, setShowWarning] = useState(false);

  return (
    <>
      {showWarning && (
        <ShowWarning
          isLoggedin={isLoggedin}
          carNum={car_num}
          onClose={() => setShowWarning(false)}
        />
      )}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur shadow-sm hover:shadow-md transition-shadow duration-300">


        {/* Header */}
        <div className="p-6 flex flex-wrap items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center border dark:border-slate-700 shadow-inner">
              <User size={34} className="text-slate-500 dark:text-slate-300" />
            </div>

            <div>
              <h3 className="text-xl font-bold tracking-tight">
                {name}
              </h3>

              <p className="text-sm text-slate-500 mt-0.5">
                Owner of{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {carName}
                </span>
              </p>

              <div className="mt-1 flex items-center gap-1.5">
                <Lock size={15} className="text-emerald-500" />
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Identity Verified
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 dark:bg-slate-800 px-5 py-3 text-right">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Vehicle Status
            </p>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
              Registered & Active
            </p>
          </div>
        </div>

        {/* Verified */}
        {isVerified && (
          <div className="p-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
            <div className="mb-4 flex items-start justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Contact Owner
              </h4>

              <div className="text-right">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  <Phone size={14} className="text-primary" />
                  {temp_phone_number ?? user_ph_num}
                </div>

                {!temp_phone_number && (
                  <Button
                    onClick={() => setShowWarning(true)}
                    className="-mt-5 bg-transparent hover:bg-transparent text-blue-600 inline-flex items-center gap-1 text-[11px] font-medium hover:underline"
                  >
                    <RefreshCcw size={11} />
                    change
                  </Button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                variant="outline"
                className="h-12 px-6 font-semibold flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <Mail size={18} />
                Email
              </Button>

              <Button
                className="h-12 px-6 font-bold flex items-center gap-2 bg-primary text-white dark:text-slate-800 hover:bg-primary/90 shadow-sm shadow-primary/30 transition"
              >
                <Phone size={18} />
                Call
              </Button>
            </div>

          </div>
        )}


        {/* Not Verified */}
        {!isVerified && (
          <div className="p-8 bg-linear-to-br from-primary/5 to-transparent border-b border-slate-100 dark:border-slate-800">
            <div className="mx-auto max-w-md flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow">
                <Lock size={22} className="text-primary" />
              </div>

              <h4 className="text-lg font-bold">
                Verify Ownership to Continue
              </h4>

              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                For security and privacy reasons, ownership verification is required
                before contacting the vehicle owner.
              </p>

              <Button
                onClick={() => setShowWarning(true)}
                className="mt-6 w-full h-12 rounded-xl bg-primary text-white dark:text-slate-800 font-bold hover:bg-primary/90 shadow-sm shadow-primary/25 transition-all"
              >
                Verify & Unlock Contact
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );

}


export default function SearchCar({ user_phone_number, is_verified, is_loggedin, temp_phone_number }: { user_phone_number: any, is_verified: boolean, is_loggedin: boolean, temp_phone_number: string | undefined }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryCarNumber = searchParams.get("crnm");

  const [carNumber, setCarNumber] = useState(queryCarNumber? queryCarNumber : "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [ownerDetail, setOwnerDetail] = useState<any>(null);

  useEffect(() => {
    if (!queryCarNumber) return;

    const fetchOwner = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?crnm=${queryCarNumber}`);

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Request failed");
        }

        const data = await res.json();

        if (queryCarNumber === data?.vehi1) {
          setOwnerDetail({ name: data?.name, carName: data?.vehi1_name, car_num: queryCarNumber, user_ph_num: user_phone_number, isVerified: is_verified, isLoggedin: is_loggedin, temp_phone_number: temp_phone_number });
        } else {
          setOwnerDetail({ name: data?.name, carName: data?.vehi2_name, car_num: queryCarNumber, user_ph_num: user_phone_number, isVerified: is_verified, isLoggedin: is_loggedin, temp_phone_number: temp_phone_number });
        }

        // setMessage(JSON.stringify(data));
      } catch (err: any) {
        setMessage(err.message || "Vehicle not found");
        setOwnerDetail(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOwner();
  }, [queryCarNumber, user_phone_number]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!carNumber.trim()) {
      setMessage("Please enter a car number");
      return;
    }

    router.replace(`/search?crnm=${encodeURIComponent(carNumber)}`);
    setMessage('');
  };
  return (
    <main className="flex flex-1 justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="layout-content-container flex w-full max-w-5xl flex-col gap-8">
        <div className="flex flex-col items-center text-center">
          <h1 className="pb-3 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Find a Vehicle Owner
          </h1>

          <p className="max-w-xl text-base leading-normal text-slate-600 dark:text-slate-400">
            Enter the license plate number to start a secure, anonymous conversation with the owner.
          </p>

          <div className="flex w-full max-w-2xl flex-col gap-3 pt-8 md:flex-row md:items-end">
            {/* Input */}
            <label className="flex w-full flex-1 flex-col">
              <span className="pb-2 text-left text-sm font-semibold text-slate-800 dark:text-slate-300">
                License Plate Number
              </span>

              <div className="relative w-full">
                <Car
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                />

                <input
                  value={carNumber}
                  onChange={(e) => setCarNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. ABC-1234"
                  className="
                    h-14 w-full rounded-lg border
                    border-slate-300 dark:border-slate-700
                    bg-white dark:bg-slate-900
                    pl-12 pr-4 text-lg font-bold uppercase
                    text-slate-900 dark:text-slate-100
                    placeholder:text-slate-400
                    focus:border-primary focus:ring-2 focus:ring-primary/40
                    transition-all
                  "
                />
              </div>
            </label>

            {/* Button */}
            <Button
              onClick={handleSubmit}
              className="h-14 w-full min-w-35 md:w-auto rounded-lg bg-primary px-6 text-base font-bold text-white dark:text-slate-800 hover:bg-primary/90 focus:ring-2 focus:ring-primary/40 active:scale-95 transition-all"
            >
              {loading ? "Searching....." : "Search Vehicle"}
            </Button>
          </div>
        </div>
        <div className="flex justify-center">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {message}
          </p>
        </div>

        {ownerDetail && <ShowOwnerDetail {...ownerDetail} />}
      </div>
    </main>
  );

}