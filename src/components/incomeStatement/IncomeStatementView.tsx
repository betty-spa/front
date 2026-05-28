"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { Loader2 } from "lucide-react"
import { getIncomeStatement } from "@/actions/reports/getIncomeStatement"
import { IIncomeStatement } from "@/interfaces/reports/IIncomeStatement"
import SummaryCards from "./SummaryCards"
import TotalsCards from "./TotalsCards"
import IncomeStatementTable from "./IncomeStatementTable"
import ResultsPanel from "./ResultsPanel"
import BenefitBarChart from "./BenefitBarChart"
import StoreSummaryTable from "./StoreSummaryTable"
import {
    getAverageNet,
    getGrossIncome,
    getMonthsWithMovement,
    getNegativeMonthsCount,
    getNetMargin,
    getPeakMonth,
    getLowestMonth,
} from "./incomeStatement.utils"

const CURRENT_YEAR = new Date().getFullYear()

type IncomeStatementViewProps = {
    initialYear: number
    initialStoreId?: string
}

export default function IncomeStatementView({ initialYear, initialStoreId = "" }: IncomeStatementViewProps) {
    const [year, setYear] = useState(initialYear || CURRENT_YEAR)
    const [storeId, setStoreId] = useState(initialStoreId)
    const [draftYear, setDraftYear] = useState(String(initialYear || CURRENT_YEAR))
    const [draftStoreId, setDraftStoreId] = useState(initialStoreId)
    const [data, setData] = useState<IIncomeStatement | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setYear(initialYear || CURRENT_YEAR)
        setDraftYear(String(initialYear || CURRENT_YEAR))
    }, [initialYear])

    useEffect(() => {
        setStoreId(initialStoreId)
        setDraftStoreId(initialStoreId)
    }, [initialStoreId])

    useEffect(() => {
        let active = true
        setIsLoading(true)
        setError(null)

        getIncomeStatement(year, storeId || undefined)
            .then((response) => {
                if (!active) return
                setData(response)
            })
            .catch((fetchError) => {
                console.error("IncomeStatementView: error fetching data", fetchError)
                if (!active) return
                setData(null)
                setError("No fue posible cargar el estado de resultados.")
            })
            .finally(() => {
                if (active) {
                    setIsLoading(false)
                }
            })

        return () => {
            active = false
        }
    }, [year, storeId])

    const months = data?.months ?? []
    const totals = data?.totals
    const grossIncome = totals ? getGrossIncome(totals) : 0
    const margin = totals ? getNetMargin(totals) : 0
    const monthsWithMovement = getMonthsWithMovement(months)
    const peakMonth = getPeakMonth(months)
    const lowestMonth = getLowestMonth(months)
    const negativeMonths = getNegativeMonthsCount(months)
    const averageNet = getAverageNet(months)

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const parsedYear = Number(draftYear)
        setYear(Number.isFinite(parsedYear) && parsedYear >= 2000 ? parsedYear : CURRENT_YEAR)
        setStoreId(draftStoreId.trim())
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 dark:bg-slate-950 dark:text-slate-50 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-6 text-white shadow-xl dark:border-slate-800">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="space-y-2">
                            <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Reportes</p>
                            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Estado de resultados</h1>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="grid gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm sm:grid-cols-[120px_minmax(220px,1fr)_auto]"
                        >
                            <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-slate-200">
                                Año
                                <input
                                    type="number"
                                    min={2000}
                                    max={2100}
                                    value={draftYear}
                                    onChange={(event) => setDraftYear(event.target.value)}
                                    className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-400"
                                />
                            </label>
                            <button
                                type="submit"
                                className="self-end rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                            >
                                Actualizar
                            </button>
                        </form>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <Loader2 className="mr-3 h-6 w-6 animate-spin text-cyan-500" />
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                            Cargando estado de resultados...
                        </span>
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
                        {error}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <SummaryCards
                            year={data?.year ?? year}
                            storeId={data?.storeId ?? storeId}
                            monthsLoaded={months.length}
                            monthsWithMovement={monthsWithMovement.length}
                        />

                        <TotalsCards totals={totals} margin={margin} grossIncome={grossIncome} />

                        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.8fr)]">
                            <BenefitBarChart months={months} />
                            <StoreSummaryTable
                                year={data?.year ?? year}
                                storeId={data?.storeId ?? storeId}
                                peakMonth={peakMonth}
                                lowestMonth={lowestMonth}
                                negativeMonths={negativeMonths}
                            />
                        </div>

                        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.8fr)]">
                            <IncomeStatementTable months={months} />
                            <ResultsPanel averageNet={averageNet} grossIncome={grossIncome} totals={totals} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
