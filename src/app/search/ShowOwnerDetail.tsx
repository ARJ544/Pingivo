"use client";
import { useState } from "react";
import { User, Lock, Mail, Phone, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShowWarning } from "@/app/search/searchCarClient";
import { MessageOwnerModal } from "@/components/my_ui/message-owner";
import Popup from "@/components/my_ui/CustomPopUp";

type Payload = {
  subject: string;
  issueMessage: string;
  vehi_num: string;
};

export default function ShowOwnerDetail({
  name,
  carName,
  car_num,
  user_ph_num,
  isVerified,
  isLoggedin,
  temp_phone_number,
}: {
  name: string;
  carName: string;
  car_num: string;
  user_ph_num: string;
  isVerified: boolean;
  isLoggedin: boolean;
  temp_phone_number: string | undefined;
}) {
  const [showWarning, setShowWarning] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageOwnerOpen, setMessageOwnerOpen] = useState(false);
  const [errorOrSuccessMessage, setErrorOrSuccessMessage] = useState("");

  const handleSendMail = async (payload: Payload) => {
    setLoading(true);
    try {
      const res = await fetch("/api/message-owner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Something went wrong");
      }
      setErrorOrSuccessMessage(result.message);
    } catch (err: any) {
      setErrorOrSuccessMessage(err.message);
    } finally {
      setLoading(false);
    }
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
        "Call started for 60s. Incoming shortly - verify the last 4 digits (8181). Speak politely and confirm the owner's name."
      );
    } catch (err: any) {
      setErrorOrSuccessMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showWarning && (
        <ShowWarning
          isLoggedin={isLoggedin}
          carNum={car_num}
          onClose={() => setShowWarning(false)}
        />
      )}
      <MessageOwnerModal
        open={messageOwnerOpen}
        onOpenChange={setMessageOwnerOpen}
        vehicleId={car_num}
        onSubmit={(issue, msg) => {
          const newPayload = {
            subject: issue,
            issueMessage: msg,
            vehi_num: car_num,
          };
          handleSendMail(newPayload);
        }}
      />
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur shadow-sm hover:shadow-md transition-shadow duration-300">
        {/* Header */}
        <div className="p-6 flex flex-wrap items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center border dark:border-slate-700 shadow-inner">
              <User size={34} className="text-slate-500 dark:text-slate-300" />
            </div>

            <div>
              <h3 className="text-xl font-bold tracking-tight">{name}</h3>

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
                  ____{temp_phone_number ?? user_ph_num}
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
                onClick={() => setMessageOwnerOpen(true)}
                disabled={loading}
                className="h-12 px-6 font-semibold flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <Mail size={18} />
                Email
              </Button>

              <Button
                className="h-12 px-6 font-bold flex items-center gap-2 bg-primary text-white dark:text-slate-800 hover:bg-primary/90 shadow-sm shadow-primary/30 transition"
                disabled={loading}
                onClick={() => {
                  handleCall();
                }}
              >
                <Phone size={18} />
                Call
              </Button>

              <Popup
                message={popupMessage}
                show={showPopup}
                onClose={() => setShowPopup(false)}
              />
            </div>

            <p
              className={`text-lg mt-1 font-medium transition-colors duration-300 ${errorOrSuccessMessage.includes("error") ? "text-red-500 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
            >
              {errorOrSuccessMessage}
            </p>
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
                As you are not Logged In. For security and privacy reasons,
                ownership verification is required before contacting the vehicle
                owner.
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
