"use client"

import { Card } from "@/components/ui/card"
import { IIncomeStatementMonth } from "@/interfaces/reports/IIncomeStatement"
import { formatCurrency } from "./incomeStatement.utils"

type StoreSummaryTableProps = {
    year: number
    storeId?: string
    peakMonth: IIncomeStatementMonth | null
    lowestMonth: IIncomeStatementMonth | null
    negativeMonths: number
}

export default function StoreSummaryTable({ year, storeId, peakMonth, lowestMonth, negativeMonths }: StoreSummaryTableProps) {
    return (
        <Card className="border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-semibold text-slate-800 dark:text-white">Resumen del período</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {storeId ? `Tienda ${storeId}` : "Sin filtro de tienda"} · {year}
            </p>

            <div className="mt-4 space-y-4">
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Mejor mes</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                        {peakMonth ? peakMonth.label : "Sin datos"}
                    </p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-300">
                        {peakMonth ? formatCurrency(peakMonth.net) : "—"}
                    </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Mes más bajo</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                        {lowestMonth ? lowestMonth.label : "Sin datos"}
                    </p>
                    <p className="text-sm text-rose-600 dark:text-rose-300">
                        {lowestMonth ? formatCurrency(lowestMonth.net) : "—"}
                    </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Meses negativos</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{negativeMonths}</p>
                </div>
            </div>
        </Card>
    )
}
