"use client"

type SummaryCardsProps = {
    year: number
    storeId?: string
    monthsLoaded: number
    monthsWithMovement: number
}

const Stat = ({ label, value }: { label: string; value: string }) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{value}</p>
    </div>
)

export default function SummaryCards({ year, storeId, monthsLoaded, monthsWithMovement }: SummaryCardsProps) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <Stat label="Año consultado" value={String(year)} />
            <Stat label="Meses cargados" value={String(monthsLoaded)} />
            <Stat label="Meses con movimiento" value={String(monthsWithMovement)} />
        </div>
    )
}
