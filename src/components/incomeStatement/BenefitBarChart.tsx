"use client"

import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart, Legend } from "recharts"
import { Card } from "@/components/ui/card"
import { IIncomeStatementMonth } from "@/interfaces/reports/IIncomeStatement"
import { formatCurrency } from "./incomeStatement.utils"

type BenefitBarChartProps = {
    months: IIncomeStatementMonth[]
}

export default function BenefitBarChart({ months }: BenefitBarChartProps) {
    const chartData = months.map((month) => ({
        mes: month.label,
        ventas: month.salesIncome,
        purchaseOrders: month.purchaseOrdersIncome,
        gastos: month.expenses,
        neto: month.net,
    }))

    return (
        <Card className="border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <h3 className="text-base font-semibold text-slate-800 dark:text-white">Serie mensual</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Ventas, purchase orders, gastos y neto por mes
                    </p>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={320}>
                <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.18)" />
                    <XAxis dataKey="mes" tick={{ fill: "#64748b" }} />
                    <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} tick={{ fill: "#64748b" }} />
                    <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{
                            borderRadius: "12px",
                            border: "1px solid rgba(148, 163, 184, 0.2)",
                        }}
                    />
                    <Legend />
                    <Bar dataKey="ventas" stackId="ingresos" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="purchaseOrders" stackId="ingresos" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="gastos" fill="#f97316" radius={[4, 4, 0, 0]} />
                    <Line type="monotone" dataKey="neto" stroke="#22c55e" strokeWidth={3} dot={{ r: 3 }} />
                </ComposedChart>
            </ResponsiveContainer>
        </Card>
    )
}
