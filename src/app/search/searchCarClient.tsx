'use client';
import { useState, useEffect } from "react";
import { Car, User, Lock, Mail, Phone, MessageSquare, Shield, EyeOff, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";


function ShowOwnerDetail({ name, carName, user_ph_num, isVerified }: { name: string, carName: string, user_ph_num: string, isVerified: boolean }) {
  const [user_phnum, setPhnum] = useState(user_ph_num);

  const phoneRegex = /^\+[1-9]\d{1,14}$/
  const isPhoneValid = user_phnum === '' || phoneRegex.test(user_phnum)

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mt-4">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
            <User size={36} />
          </div>
          <div>
            <h3 className="text-xl font-bold">{name}</h3>
            <p className="text-sm text-slate-500 mb-1">
              Owner Of <span className="font-semibold text-slate-700 dark:text-slate-300">{carName}</span>
            </p>
            <div className="flex items-center gap-1.5">
              <Lock size={16} className="text-green-500" />
              <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                Identity Verified
              </span>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 px-5 py-3 rounded-lg flex flex-col items-end gap-1">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Vehicle Status</span>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Registered & Active</span>
        </div>
      </div>

      {isVerified && (
        <>
          Call Section
        </>
      )}
      {!isVerified && (
        <div className="p-8 bg-primary/5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col items-center max-w-lg mx-auto">
            <div className="size-10 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-primary mb-3">
              <Lock size={24} />
            </div>
            <h4 className="text-lg font-bold mb-2 text-center">Verify Ownership to Contact</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 text-center">
              For security reasons, please provide the following details to verify your authorization to contact this owner.
            </p>

            <div className="w-full flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold uppercase text-slate-500 tracking-wide">Car Number (Last 4)</span>
                  <input
                    className="w-full h-12 px-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-base font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-center tracking-widest"
                    maxLength={4}
                    placeholder="e.g. 9942"
                    type="text"
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold uppercase text-slate-500 tracking-wide">Your Phone Number (E.164)</span>
                  <input
                    name="user_phnum"
                    value={user_phnum ? user_phnum : ""}
                    onChange={(e) => setPhnum(e.target.value.replace(/^\s+|\s+$/g, ''))}
                    type="tel"
                    placeholder="+918830123433"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none transition
                    ${isPhoneValid
                        ? 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                        : 'border-red-500 focus:ring-1 focus:ring-red-500'
                      }`}
                  />

                </label>
              </div>

              <Button className="w-full bg-primary text-white dark:text-slate-700 font-bold h-12 rounded-lg hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20 mt-2">
                Verify & Unlock Contact
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default function SearchCar({ user_phone_number, is_verified }: { user_phone_number: any, is_verified: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryCarNumber = searchParams.get("crnm");

  const [carName, setCarNumber] = useState(queryCarNumber ? queryCarNumber : "");
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
          setOwnerDetail({ name: data?.name, carName: data?.vehi1_name, user_ph_num: user_phone_number, isVerified: is_verified });
        } else {
          setOwnerDetail({ name: data?.name, carName: data?.vehi2_name, user_ph_num: user_phone_number, isVerified: is_verified });
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

    if (!carName.trim()) {
      setMessage("Please enter a car number");
      return;
    }

    router.push(`/search?crnm=${encodeURIComponent(carName)}`);
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
                  value={carName}
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