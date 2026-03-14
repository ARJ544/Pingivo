"use client";

import { useState } from "react";

const messages = [
  "Your car is blocking my driveway.",
  "Your car lights are on.",
  "Your car is parked incorrectly.",
  "Please move your car. It is causing inconvenience.",
];

export default function MessageOwner() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [custom, setCustom] = useState("");
  const [sent, setSent] = useState(false);

  const activeMsg = selected || custom.trim();

  function handleSend() {
    if (!activeMsg) return;
    setSent(true);
    setTimeout(() => { setOpen(false); setSent(false); }, 1400);
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => { setOpen(true); setSelected(""); setCustom(""); setSent(false); }}
        className="h-12 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 text-white font-semibold rounded-lg transition active:scale-[0.97]"
      >
        Send Message
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />

          {/* Bottom sheet */}
          <div className="relative w-full bg-white dark:bg-zinc-900 rounded-t-2xl pb-8 animate-slideUp">

            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <span className="w-9 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
            </div>

            {/* Quick messages */}
            <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-400 px-4 pt-4 pb-2">Quick Messages</p>
            <div className="flex flex-col gap-2 px-4">
              {messages.map((m) => (
                <button
                  key={m}
                  onClick={() => { setSelected(selected === m ? "" : m); setCustom(""); }}
                  className={`flex items-start gap-3 rounded-2xl px-4 py-3 text-left text-sm transition
                    ${selected === m
                      ? "bg-[#25D366]/10 border-[1.5px] border-[#25D366]"
                      : "bg-zinc-50 dark:bg-zinc-800 border-[1.5px] border-transparent"
                    }`}
                >
                  <span className={`mt-0.5 w-4 h-4 rounded-full border-[1.5px] shrink-0 flex items-center justify-center transition
                    ${selected === m ? "bg-[#25D366] border-[#25D366]" : "border-zinc-300"}`}>
                    {selected === m && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </span>
                  {m}
                </button>
              ))}
            </div>

            {/* Custom message */}
            <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-400 px-4 pt-4 pb-2">Custom Message</p>
            <div className="px-4">
              <textarea
                rows={3}
                placeholder="Write your own message..."
                value={custom}
                onChange={(e) => { setCustom(e.target.value); setSelected(""); }}
                className="w-full text-sm rounded-2xl border-[1.5px] border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-3 outline-none focus:border-[#25D366] resize-none transition placeholder:text-zinc-400"
              />
            </div>

            {/* Status */}
            {sent && (
              <p className="text-center text-sm font-medium text-[#25D366] pt-3">Under Trial!</p>
            )}

            {/* Send button */}
            <div className="px-4 pt-4">
              <button
                disabled={!activeMsg}
                onClick={handleSend}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] disabled:bg-zinc-200 disabled:text-zinc-400 text-white font-medium py-4 rounded-full transition active:scale-[0.98]"
              >
                Send Message
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}