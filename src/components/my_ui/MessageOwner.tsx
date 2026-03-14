"use client";

import { useState } from "react";

const QUICK_MESSAGES = [
  "Your car is blocking my driveway.",
  "Your car lights are on.",
  "Your car is parked incorrectly.",
  "Please move your car. It is causing inconvenience.",
];

const triggerBtn =
  "h-12 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 text-white font-semibold rounded-lg transition active:scale-[0.97]";

const sheet =
  "relative w-full bg-white dark:bg-zinc-900 rounded-t-4xl pb-8 animate-slideUp";

const headerBorder =
  "border-b border-zinc-100 dark:border-white/10";

const quickLabel =
  "text-[11px] font-medium uppercase tracking-widest text-zinc-400 px-5 pt-4 pb-2";

const textareaStyle =
  "w-full text-[13.5px] text-zinc-800 dark:text-zinc-200 rounded-[14px] border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3.5 py-3 outline-none focus:border-[#25D366] resize-none transition-colors placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-[inherit] leading-relaxed";

const sendBtn =
  "w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] disabled:bg-zinc-100 dark:disabled:bg-zinc-800 disabled:text-zinc-400 dark:disabled:text-zinc-600 text-white text-[14.5px] font-medium py-3.5 rounded-full transition-all active:scale-[0.98] disabled:cursor-not-allowed";

export default function MessageOwner() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [custom, setCustom] = useState("");
  const [sent, setSent] = useState(false);

  const activeMsg = selected || custom.trim();

  function handleSend() {
    if (!activeMsg) return;
    console.log(activeMsg);
    setSent(true);
    setTimeout(() => {
      setOpen(false);
      setSent(false);
    }, 2000);
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => {
          setOpen(true);
          setSelected("");
          setCustom("");
          setSent(false);
        }}
        className={triggerBtn}
      >
        Message Owner
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />

          {/* Bottom sheet */}
          <div className={sheet}>
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <span className="block w-9 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
            </div>

            {/* Header */}
            <div className={`flex items-center justify-between px-5 pb-4 ${headerBorder}`}>
              <span className="text-base font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
                Send a message
              </span>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[13px] hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Quick messages */}
            <p className={quickLabel}>Quick Messages</p>

            <div className="flex flex-col gap-1.5 px-4">
              {QUICK_MESSAGES.map((m) => {
                const active = selected === m;

                return (
                  <button
                    key={m}
                    onClick={() => {
                      setSelected(active ? "" : m);
                      setCustom("");
                    }}
                    className={`flex items-center gap-3 rounded-[14px] px-3.5 py-3 text-left text-[13.5px] leading-snug transition-all
                    ${active
                        ? "bg-[#25D366]/10 border border-[#25D366]"
                        : "bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-750"
                      }`}
                  >
                    <span
                      className={`w-4.5 h-4.5 rounded-full border-[1.5px] shrink-0 flex items-center justify-center transition-all
                      ${active
                          ? "bg-[#25D366] border-[#25D366]"
                          : "border-zinc-300 dark:border-zinc-600"
                        }`}
                    >
                      {active && (
                        <span className="w-1.5 h-1.5 bg-white rounded-full" />
                      )}
                    </span>

                    <span className="text-zinc-800 dark:text-zinc-200">
                      {m}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom message */}
            <p className={quickLabel}>Custom Message</p>

            <div className="px-4">
              <textarea
                rows={3}
                placeholder="Write your own message..."
                value={custom}
                onChange={(e) => {
                  setCustom(e.target.value);
                  setSelected("");
                }}
                className={textareaStyle}
              />
            </div>

            {/* Send area */}
            <div className="px-4 pt-4">
              {sent ? (
                <div className="flex items-center justify-center gap-2 py-3.5 text-[13.5px] font-medium text-[#25D366]">
                  Under Trial | Message was not sent to Whatsapp Number
                </div>
              ) : (
                <button
                  disabled={!activeMsg}
                  onClick={handleSend}
                  className={sendBtn}
                >
                  Send Message
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}