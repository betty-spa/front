"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { IIncomeStatementMonth } from "@/interfaces/reports/IIncomeStatement"
import { formatCurrency } from "./incomeStatement.utils"
import IncomeStatementMonthModal from "./IncomeStatementMonthModal"

type IncomeStatementTableProps = {
    months: IIncomeStatementMonth[]
}

export default function IncomeStatementTable({ months }: IncomeStatementTableProps) {
    const [selectedMonth, setSelectedMonth] = useState<IIncomeStatementMonth | null>(null)

    return (
        <>
            <Card className="overflow-hidden border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                    <div>
                        <h3 className="text-base font-semibold text-slate-800 dark:text-white">Detalle mensual</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Haz clic en un mes para ver su desglose de gastos
                        </p>
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                        {months.length} mes{months.length === 1 ? "" : "es"}
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                        <thead className="bg-slate-50 dark:bg-slate-950">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Mes
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Ventas
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Purchase Orders
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Gastos
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Neto
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {months.map((month) => (
                                <tr
                                    key={`${month.year}-${month.month}`}
                                    tabIndex={0}
                                    role="button"
                                    aria-label={`Abrir detalle de ${month.label} ${month.year}`}
                                    onClick={() => setSelectedMonth(month)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter" || event.key === " ") {
                                            event.preventDefault()
                                            setSelectedMonth(month)
                                        }
                                    }}
                                    className="cursor-pointer transition hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none dark:hover:bg-slate-950/60 dark:focus-visible:bg-slate-950/60"
                                >
                                    <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                                        <button
                                            type="button"
                                            className="text-left text-inherit underline-offset-4 hover:underline focus:outline-none"
                                            onClick={() => setSelectedMonth(month)}
                                        >
                                            {month.label}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm text-cyan-700 dark:text-cyan-300">
                                        {formatCurrency(month.salesIncome)}
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm text-violet-700 dark:text-violet-300">
                                        {formatCurrency(month.purchaseOrdersIncome)}
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm text-rose-700 dark:text-rose-300">
                                        {formatCurrency(month.expenses)}
                                    </td>
                                    <td
                                        className={`px-4 py-3 text-right text-sm font-semibold ${
                                            month.net >= 0
                                                ? "text-emerald-700 dark:text-emerald-300"
                                                : "text-rose-700 dark:text-rose-300"
                                        }`}
                                    >
                                        {formatCurrency(month.net)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <IncomeStatementMonthModal
                month={selectedMonth}
                open={selectedMonth !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedMonth(null)
                    }
                }}
            />
        </>
    )
}
