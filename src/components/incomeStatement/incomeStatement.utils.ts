import { IIncomeStatementMonth, IIncomeStatementTotals } from "@/interfaces/reports/IIncomeStatement"

export const CLP = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
})

export const formatCurrency = (value: number) => CLP.format(value)

export const formatPercent = (value: number) => `${value.toFixed(1)}%`

export const getGrossIncome = (totals: IIncomeStatementTotals) => totals.salesIncome + totals.purchaseOrdersIncome

export const getNetMargin = (totals: IIncomeStatementTotals) => {
    const grossIncome = getGrossIncome(totals)
    return grossIncome > 0 ? (totals.net / grossIncome) * 100 : 0
}

export const getMonthsWithMovement = (months: IIncomeStatementMonth[]) =>
    months.filter((month) => month.salesIncome !== 0 || month.purchaseOrdersIncome !== 0 || month.expenses !== 0)

export const getPeakMonth = (months: IIncomeStatementMonth[]) =>
    months.reduce<IIncomeStatementMonth | null>((best, current) => {
        if (!best || current.net > best.net) {
            return current
        }
        return best
    }, null)

export const getLowestMonth = (months: IIncomeStatementMonth[]) =>
    months.reduce<IIncomeStatementMonth | null>((worst, current) => {
        if (!worst || current.net < worst.net) {
            return current
        }
        return worst
    }, null)

export const getNegativeMonthsCount = (months: IIncomeStatementMonth[]) =>
    months.filter((month) => month.net < 0).length

export const getAverageNet = (months: IIncomeStatementMonth[]) => {
    if (months.length === 0) return 0
    return months.reduce((acc, month) => acc + month.net, 0) / months.length
}
