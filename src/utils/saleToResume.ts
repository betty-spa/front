import { ISaleResponse } from "@/interfaces/sales/ISale"
import { ISalesResume } from "@/interfaces/sales/ISalesResume"
import { getAnulatedProducts } from "@/lib/getAnulatedProducts"
import { getChileDateMeta } from "@/utils/chile-date"

const DAY_MS = 24 * 60 * 60 * 1000

const normalizeText = (value: unknown): string =>
    String(value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()

const isCountableSaleStatus = (status: unknown): boolean => {
    const normalizedStatus = normalizeText(status)
    return normalizedStatus === "pagado" || normalizedStatus === "anulado"
}

const isCashPayment = (paymentType: unknown): boolean => normalizeText(paymentType) === "efectivo"

export const salesToResume = (sales: ISaleResponse[], ref: Date): ISalesResume => {
    const resume: ISalesResume = {
        today: {
            total: { count: 0, amount: 0 },
            efectivo: { count: 0, amount: 0 },
            debitoCredito: { count: 0, amount: 0 },
        },
        yesterday: {
            total: { count: 0, amount: 0 },
            efectivo: { count: 0, amount: 0 },
            debitoCredito: { count: 0, amount: 0 },
        },
        last7: {
            total: { count: 0, amount: 0 },
            efectivo: { count: 0, amount: 0 },
            debitoCredito: { count: 0, amount: 0 },
        },
        month: {
            total: { count: 0, amount: 0 },
            efectivo: { count: 0, amount: 0 },
            debitoCredito: { count: 0, amount: 0 },
        },
    }

    const refMeta = getChileDateMeta(ref)
    const yesterdayDayNumber = refMeta.dayNumber - DAY_MS
    const last7StartDayNumber = refMeta.dayNumber - 6 * DAY_MS

    for (const sale of sales) {
        if (!isCountableSaleStatus(sale.status)) continue

        const nulledProducts = getAnulatedProducts(sale)
        const totalNulledAmount = nulledProducts.reduce((acc, p) => acc + p.quantitySold * Number(p.unitPrice), 0)
        const amount = sale.total - totalNulledAmount

        // Si el monto resultante es 0 o menor, no la contamos (anulación total)
        if (amount <= 0) continue

        const saleDate = new Date(sale.createdAt)
        const saleMeta = getChileDateMeta(saleDate)

        const addSale = (period: keyof ISalesResume) => {
            if (isCashPayment(sale.paymentType)) {
                resume[period].efectivo.count += 1
                resume[period].efectivo.amount += amount
            } else {
                resume[period].debitoCredito.count += 1
                resume[period].debitoCredito.amount += amount
            }
            resume[period].total.count += 1
            resume[period].total.amount += amount
        }

        if (saleMeta.dayNumber === refMeta.dayNumber) addSale("today")
        if (saleMeta.dayNumber === yesterdayDayNumber) addSale("yesterday")
        if (saleMeta.dayNumber >= last7StartDayNumber && saleMeta.dayNumber <= refMeta.dayNumber) addSale("last7")
        if (saleMeta.year === refMeta.year && saleMeta.month === refMeta.month) addSale("month")
    }

    return resume
}
