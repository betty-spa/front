"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
    IIncomeStatementExpenseDetail,
    IIncomeStatementMonth,
    IIncomeStatementExpenseDetailType,
} from "@/interfaces/reports/IIncomeStatement"
import { formatCurrency } from "./incomeStatement.utils"

type IncomeStatementMonthModalProps = {
    month: IIncomeStatementMonth | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

const expenseTypeLabels: Record<IIncomeStatementExpenseDetailType, string> = {
    financial: "Financieros",
    operational: "Operacionales",
    administrative: "Administrativos",
}

const expenseTypeOrder: IIncomeStatementExpenseDetailType[] = ["financial", "operational", "administrative"]

const getExpenseDetailTotal = (details: IIncomeStatementExpenseDetail[], type: IIncomeStatementExpenseDetailType) =>
    details.find((detail) => detail.type === type)?.total ?? 0

export default function IncomeStatementMonthModal({ month, open, onOpenChange }: IncomeStatementMonthModalProps) {
    const details = month?.expenseDetail ?? []

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl border-slate-200 bg-white p-0 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
                <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
                    <DialogHeader className="space-y-2 text-left">
                        <DialogTitle className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                            {month ? `${month.label} ${month.year}` : "Detalle mensual"}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
                            Desglose del mes seleccionado por ventas, purchase orders, gastos y neto.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                {month ? (
                    <div className="max-h-[80vh] overflow-y-auto px-6 py-5">
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <Card className="border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
                                <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Ventas</p>
                                <p className="mt-2 text-xl font-semibold text-cyan-700 dark:text-cyan-300">
                                    {formatCurrency(month.salesIncome)}
                                </p>
                            </Card>
                            <Card className="border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
                                <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                                    Purchase Orders
                                </p>
                                <p className="mt-2 text-xl font-semibold text-violet-700 dark:text-violet-300">
                                    {formatCurrency(month.purchaseOrdersIncome)}
                                </p>
                            </Card>
                            <Card className="border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
                                <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Gastos</p>
                                <p className="mt-2 text-xl font-semibold text-rose-700 dark:text-rose-300">
                                    {formatCurrency(month.expenses)}
                                </p>
                            </Card>
                            <Card className="border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
                                <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Neto</p>
                                <p
                                    className={`mt-2 text-xl font-semibold ${
                                        month.net >= 0
                                            ? "text-emerald-700 dark:text-emerald-300"
                                            : "text-rose-700 dark:text-rose-300"
                                    }`}
                                >
                                    {formatCurrency(month.net)}
                                </p>
                            </Card>
                        </div>

                        <div className="mt-6">
                            <div className="mb-3 flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                                        Detalle de gastos
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        Totales agrupados por tipo de gasto.
                                    </p>
                                </div>
                                <Badge variant="outline" className="border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300">
                                    {details.length} tipo{details.length === 1 ? "" : "s"}
                                </Badge>
                            </div>

                            <div className="space-y-3">
                                {details.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-5 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                                        Este mes no trae detalle de gastos.
                                    </div>
                                ) : (
                                    <>
                                        {expenseTypeOrder.map((type) => {
                                            const total = getExpenseDetailTotal(details, type)
                                            return (
                                                <div
                                                    key={type}
                                                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/60"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Badge variant="secondary" className="capitalize">
                                                            {expenseTypeLabels[type]}
                                                        </Badge>
                                                        <span className="text-sm text-slate-500 dark:text-slate-400">
                                                            Tipo
                                                        </span>
                                                    </div>
                                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                                        {formatCurrency(total)}
                                                    </span>
                                                </div>
                                            )
                                        })}

                                        {details
                                            .filter((detail) => !expenseTypeOrder.includes(detail.type))
                                            .map((detail) => (
                                            <div
                                                key={detail.type}
                                                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/60"
                                            >
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    {detail.type}
                                                </span>
                                                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                                    {formatCurrency(detail.total)}
                                                </span>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="px-6 py-8 text-sm text-slate-500 dark:text-slate-400">
                        Selecciona un mes para ver su detalle.
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
