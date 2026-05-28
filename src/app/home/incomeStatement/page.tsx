import IncomeStatementView from "@/components/incomeStatement/IncomeStatementView"

type Props = {
    searchParams?: Promise<{
        year?: string | string[]
        storeID?: string | string[]
    }>
}

const parseParam = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value)

export default async function IncomeStatementPage({ searchParams }: Props) {
    const resolvedSearchParams = await searchParams
    const yearParam = parseParam(resolvedSearchParams?.year)
    const storeID = parseParam(resolvedSearchParams?.storeID) ?? ""
    const parsedYear = Number(yearParam)
    const year = Number.isFinite(parsedYear) && parsedYear >= 2000 ? parsedYear : new Date().getFullYear()

    return <IncomeStatementView initialYear={year} initialStoreId={storeID} />
}
