import CreateProductForm from "@/components/Inventory/CreateProduct/CreateProductForm"
import { getAllCategories } from "@/actions/categories/getAllCategories"

type CreateProductPageProps = {
    searchParams?: Promise<{ storeID?: string | string[] }>
}

const parseParam = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value)

export default async function CreateProductPage({ searchParams }: CreateProductPageProps) {
    const resolvedSearchParams = await searchParams
    const storeID = parseParam(resolvedSearchParams?.storeID)
    const [categories] = await Promise.all([getAllCategories()])
    return <CreateProductForm categories={categories} initialStoreID={storeID} />
}
