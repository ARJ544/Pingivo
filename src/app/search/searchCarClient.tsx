"use client";
import { useState, useEffect } from "react";
import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ShowOwnerDetail from "@/app/search/ShowOwnerDetail";

function validateVehicleNumber(value: string) {
  return value
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[^A-Z0-9_-]/g, "");
}

export function ShowWarning({
  isLoggedin,
  carNum,
  onClose,
}: {
  isLoggedin: boolean;
  carNum: string;
  onClose: () => void;
}) {
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
                Your phone number will be changed{" "}
                <span className="font-semibold">temporarily for 1 hour</span>.
              </p>
              <p className="mt-2 text-xs opacity-80 leading-relaxed">
                After this period, your original phone number will be restored
                automatically. You can update your phone number permanently from{" "}
                <span className="font-medium">Update Profile</span>. During this
                1-hour window, further changes are not allowed.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium leading-relaxed">
                Your phone number will be changed{" "}
                <span className="font-semibold">temporarily for 1 hour</span>.
              </p>
              <p className="mt-2 text-xs opacity-80 leading-relaxed">
                During this time, you won’t be able to modify your phone number
                again.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <Link
            href={`/verify-phone-unknown-user?next=${encodeURIComponent(carNum)}`}
          >
            <Button className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
              Okay, I understand
            </Button>
          </Link>

          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SearchCar({
  user_phone_number,
  owner_phone_number,
  is_verified,
  is_loggedin,
  temp_phone_number,
}: {
  user_phone_number: any;
  owner_phone_number: string | undefined;
  is_verified: boolean;
  is_loggedin: boolean;
  temp_phone_number: string | undefined;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryCarNumber = searchParams.get("crnm");

  const [carNumber, setCarNumber] = useState(
    queryCarNumber ? queryCarNumber : "",
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [ownerDetail, setOwnerDetail] = useState<any>(null);
  const isVehicleValid =
    carNumber.length >= 6 &&
    carNumber.length <= 15 &&
    /^[A-Z0-9_-]+$/.test(carNumber);

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
          setOwnerDetail({
            name: data?.name,
            carName: data?.vehi1_name,
            car_num: queryCarNumber,
            user_ph_num: user_phone_number,
            owner_ph_num: owner_phone_number,
            isVerified: is_verified,
            isLoggedin: is_loggedin,
            temp_phone_number: temp_phone_number,
          });
        } else {
          setOwnerDetail({
            name: data?.name,
            carName: data?.vehi2_name,
            car_num: queryCarNumber,
            user_ph_num: user_phone_number,
            owner_ph_num: owner_phone_number,
            isVerified: is_verified,
            isLoggedin: is_loggedin,
            temp_phone_number: temp_phone_number,
          });
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
    setMessage("");
  };
  return (
    <main className="flex flex-1 justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="layout-content-container flex w-full max-w-5xl flex-col gap-0.5">
        <div className="flex flex-col items-center text-center">
          <h1 className="pb-3 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Find a Vehicle Owner
          </h1>

          <p className="max-w-xl text-base leading-normal text-slate-600 dark:text-slate-400">
            Enter the license plate number to start a secure, anonymous
            conversation with the owner.
          </p>

          <div className="flex w-full max-w-2xl flex-col gap-3 pt-6 md:flex-row md:items-end">
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
                  onChange={(e) => {
                    const cleaned = validateVehicleNumber(e.target.value);
                    setCarNumber(cleaned);
                  }}
                  maxLength={15}
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
              {carNumber && !isVehicleValid && (
                <p className="mt-1 text-xs text-red-500">
                  Only A-Z, 0-9, hyphen (-) and underscore (_) are allowed. No
                  spaces. At least 6 characters. Maximum 15 characters.
                </p>
              )}
            </label>

            {/* Button */}
            <Button
              onClick={handleSubmit}
              disabled={loading || !isVehicleValid || !carNumber.trim()}
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
