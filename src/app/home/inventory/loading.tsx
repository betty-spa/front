export default function InventoryLoading() {
    return (
        <main className="lg:p-6 flex-1 flex flex-col h-screen">
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex lg:flex-row flex-col items-center justify-between gap-4">
                    <div className="h-8 w-64 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                    <div className="flex gap-2">
                        <div className="h-11 w-36 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                        <div className="h-11 w-32 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="h-7 w-40 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                    <div className="h-7 w-56 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                </div>
            </div>

            <div className="flex-1 dark:bg-slate-900 bg-white shadow rounded overflow-hidden border border-slate-200 dark:border-slate-800">
                <div className="bg-gray-50 dark:bg-slate-800 border-b">
                    <div className="flex items-center px-2 py-2 gap-2 overflow-hidden">
                        <div className="h-14 w-64 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
                        <div className="h-14 w-24 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
                        <div className="h-14 w-32 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
                        <div className="h-14 w-20 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
                    </div>
                </div>

                <div className="p-4 space-y-3">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-[96px_1fr_64px] md:grid-cols-[160px_1fr_120px_120px_90px_110px] gap-4 items-center"
                        >
                            <div className="h-20 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                            <div className="space-y-2">
                                <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                                <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                            </div>
                            <div className="hidden md:block h-5 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                            <div className="hidden md:block h-5 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                            <div className="h-7 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                            <div className="hidden md:block h-5 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}
