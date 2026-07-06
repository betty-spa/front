import { getAllProducts } from "@/actions/products/getAllProducts"
import { getStoreStockSaleProducts } from "@/actions/inventory/getStoreStock"
import { getAllPurchaseOrders } from "@/actions/purchase-orders/getAllPurchaseOrders"
import { getSales, getSalesForResume } from "@/actions/sales/getSales"
import { getAllStores } from "@/actions/stores/getAllStores"
import { getResume } from "@/actions/totals/getResume"
import { getWooCommerceOrders } from "@/actions/woocommerce/getWooOrder"
import { IStore } from "@/interfaces/stores/IStore"
import { IPurchaseOrder } from "@/interfaces/orders/IPurchaseOrder"
import { IResume } from "@/interfaces/sales/ISalesResume"
import { ISaleResponse } from "@/interfaces/sales/ISale"
import { getChileYYYYMMDD, isYYYYMMDD, toChileMiddayUTC } from "@/utils/chile-date"
import { mapWooOrderToSale } from "@/utils/mappers/woocommerceToSale"

const isSpecialStoreFilter = (storeID: string) => ["all", "propias", "consignadas"].includes(storeID)

const getProductsForSale = async (storeID: string) => {
    if (!isSpecialStoreFilter(storeID)) {
        try {
            return await getStoreStockSaleProducts(storeID)
        } catch (error) {
            console.warn("buildHomeViewModel: fallback to full products after store stock error:", error)
        }
    }

    return getAllProducts()
}

type HomeTableItem = ISaleResponse | (IPurchaseOrder & { isOrder: true })

const matchesStoreScope = (storeID: string, store: IStore): boolean => {
    if (storeID === "all") return true
    if (storeID === "propias") return store.isCentralStore === true
    if (storeID === "consignadas") return store.isCentralStore === false
    return store.storeID === storeID
}

const buildStoreIndex = (stores: IStore[]) => new Map(stores.map((store) => [store.storeID, store] as const))

const filterSalesByScope = (
    sales: ISaleResponse[],
    storeID: string,
    storeIndex: Map<string, IStore>,
): ISaleResponse[] => {
    return sales.filter((sale) => {
        const saleStore = storeIndex.get(sale.storeID)
        return saleStore ? matchesStoreScope(storeID, saleStore) : false
    })
}

const filterOrdersByScope = (
    orders: IPurchaseOrder[],
    storeID: string,
    storeIndex: Map<string, IStore>,
): (IPurchaseOrder & { isOrder: true })[] => {
    return orders
        .filter((order) => {
            const orderStore = storeIndex.get(order.storeID)
            return orderStore ? matchesStoreScope(storeID, orderStore) : false
        })
        .map((order) => ({ ...order, isOrder: true as const }))
}

const getCreatedAtTime = (item: HomeTableItem) => {
    const time = Date.parse(item.createdAt)
    return Number.isNaN(time) ? 0 : time
}

const sortByCreatedAtDesc = (items: HomeTableItem[]): HomeTableItem[] => {
    return [...items].sort((a, b) => getCreatedAtTime(b) - getCreatedAtTime(a))
}

export type HomeViewModel = {
    stores: IStore[]
    storeID: string
    date: string
    chartStoreID: string
    sales: ISaleResponse[]
    resume: IResume
    allSalesForResume: ISaleResponse[]
    purchaseOrders: (IPurchaseOrder & { isOrder: true })[]
    items: HomeTableItem[]
    allProducts: Awaited<ReturnType<typeof getProductsForSale>>
    dateRef: Date
}

export const buildHomeViewModel = async (rawStoreID: string, rawDate: string): Promise<HomeViewModel | null> => {
    const stores = await getAllStores()
    if (stores.length === 0) {
        return null
    }
    const storeIndex = buildStoreIndex(stores)

    if (!rawStoreID) {
        return null
    }
    const storeID = rawStoreID

    const date = isYYYYMMDD(rawDate) ? rawDate : getChileYYYYMMDD(new Date())
    const dateRef = toChileMiddayUTC(date)
    const specialFilter = isSpecialStoreFilter(storeID)
    const chartStoreID = specialFilter ? (stores[0]?.storeID ?? storeID) : storeID
    const apiSalesStoreID = specialFilter ? "" : storeID

    const [sales, dailySales, wooOrders, resume, allOrders, allProducts] = await Promise.all([
        getSales(apiSalesStoreID || "", date),
        getSalesForResume(apiSalesStoreID || "", date),
        getWooCommerceOrders(dateRef),
        getResume(chartStoreID || "", date),
        getAllPurchaseOrders(),
        getProductsForSale(storeID),
    ])

    const wooSales = wooOrders.map(mapWooOrderToSale)
    const tableSales = filterSalesByScope(sales, storeID, storeIndex)
    const esCentral = storeID === "all" || storeID === "propias" || storeIndex.get(storeID)?.isCentralStore === true
    const filteredWooSales = esCentral ? wooSales : []
    const allSalesForResume = [...filterSalesByScope(dailySales, storeID, storeIndex), ...filteredWooSales]
    const purchaseOrders = filterOrdersByScope(allOrders, storeID, storeIndex)
    const items = sortByCreatedAtDesc([...tableSales, ...filteredWooSales, ...purchaseOrders])

    return {
        stores,
        storeID,
        date,
        chartStoreID,
        sales: tableSales,
        resume,
        allSalesForResume,
        purchaseOrders,
        items,
        allProducts,
        dateRef,
    }
}
