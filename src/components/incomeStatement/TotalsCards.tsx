import { IIncomeStatementTotals } from "@/interfaces/reports/IIncomeStatement"
import { formatCurrency, formatPercent } from "./incomeStatement.utils"

type TotalsCardsProps = {
    totals?: IIncomeStatementTotals
    grossIncome: number
    margin: number
}

const Card = ({ label, value, tone }: { label: string; value: string; tone: string }) => (
    <div className={`rounded-2xl border p-4 shadow-sm ${tone}`}>
        <p className="text-xs uppercase tracking-[0.18em] opacity-80">{label}</p>
        <p className="mt-2 text-xl font-semibold">{value}</p>
    </div>
)

export default function TotalsCards({ totals, grossIncome, margin }: TotalsCardsProps) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <Card
                label="Ingresos brutos"
                value={formatCurrency(grossIncome)}
                tone="border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100"
            />
            <Card
                label="Ventas"
                value={formatCurrency(totals?.salesIncome ?? 0)}
                tone="border-cyan-200 bg-cyan-50 text-cyan-900 dark:border-cyan-900 dark:bg-cyan-950/40 dark:text-cyan-100"
            />
            <Card
                label="Órdenes de Compra"
                value={formatCurrency(totals?.purchaseOrdersIncome ?? 0)}
                tone="border-violet-200 bg-violet-50 text-violet-900 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-100"
            />
            <Card
                label="Neto"
                value={`${formatCurrency(totals?.net ?? 0)}`}
                tone="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
            />
            <Card
                label="Márgen"
                value={`${formatPercent(margin)}`}
                tone="border-green-200 bg-green-50 text-green-900 dark:border-green-900 dark:bg-green-950/40 dark:text-green-100"
            />
        </div>
    )
}
