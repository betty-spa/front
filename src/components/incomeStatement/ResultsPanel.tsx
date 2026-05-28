"use client"

import { Card } from "@/components/ui/card"
import { IIncomeStatementTotals } from "@/interfaces/reports/IIncomeStatement"
import { formatCurrency, formatPercent } from "./incomeStatement.utils"

type ResultsPanelProps = {
    grossIncome: number
    averageNet: number
    totals?: IIncomeStatementTotals
}

export default function ResultsPanel({ grossIncome, averageNet, totals }: ResultsPanelProps) {
    const margin = grossIncome > 0 ? (totals?.net ?? 0) / grossIncome : 0
    const netDirection = (totals?.net ?? 0) >= 0 ? "positivo" : "negativo"

    return (
        <Card className="border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Resumen</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Análisis básico</p>

            <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/70">
                    <span className="text-sm text-slate-600 dark:text-slate-300">Ingreso bruto anual</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(grossIncome)}
                    </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/70">
                    <span className="text-sm text-slate-600 dark:text-slate-300">Promedio neto mensual</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(averageNet)}
                    </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/70">
                    <span className="text-sm text-slate-600 dark:text-slate-300">Margen neto</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {formatPercent(margin * 100)}
                    </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/70">
                    <span className="text-sm text-slate-600 dark:text-slate-300">Resultado</span>
                    <span
                        className={`text-sm font-semibold ${
                            netDirection === "positivo"
                                ? "text-emerald-600 dark:text-emerald-300"
                                : "text-rose-600 dark:text-rose-300"
                        }`}
                    >
                        {netDirection}
                    </span>
                </div>
                <div className="rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    Neto anual:{" "}
                    <span className="font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(totals?.net ?? 0)}
                    </span>
                </div>
            </div>
        </Card>
    )
}
