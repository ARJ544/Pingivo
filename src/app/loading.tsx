export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 animate-pulse">

        {/* Hero Section */}
        <section className="space-y-4">
          <div className="h-8 sm:h-10 w-3/4 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 sm:h-5 w-full rounded-md bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 sm:h-5 w-5/6 rounded-md bg-zinc-200 dark:bg-zinc-800" />

          <div className="flex flex-wrap gap-3 pt-2">
            <div className="h-10 w-28 sm:w-32 rounded-md bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-10 w-24 sm:w-28 rounded-md bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </section>

        {/* List Section */}
        <section className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg"
            >
              <div className="h-12 w-12 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-3 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </div>
          ))}
        </section>

      </main>
    </div>
  );
}