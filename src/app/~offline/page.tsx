export default function OfflinePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-6">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-8 text-center shadow-xl dark:shadow-black/40">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <span className="text-xl">📡</span>
        </div>

        <h1 className="mb-3 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          You are Offline!!!
        </h1>

        <p className="mb-6 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          Your internet connection appears to be unavailable. Please check your
          network settings and try again.
        </p>
      </div>
    </main>
  );
}
