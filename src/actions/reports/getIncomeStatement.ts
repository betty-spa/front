"use server"

import { API_URL } from "@/lib/enviroments"
import { fetcher } from "@/lib/fetcher"
import { IIncomeStatement } from "@/interfaces/reports/IIncomeStatement"

export const getIncomeStatement = async (year?: number, storeId?: string): Promise<IIncomeStatement> => {
    try {
        const params = new URLSearchParams()
        if (typeof year === "number" && Number.isFinite(year)) {
            params.set("year", String(year))
        }
        if (storeId) {
            params.set("storeId", storeId)
        }

        const query = params.toString()
        return await fetcher<IIncomeStatement>(`${API_URL}/reports/income-statement${query ? `?${query}` : ""}`)
    } catch (error) {
        throw new Error("Error fetching income statement", { cause: error })
    }
}
