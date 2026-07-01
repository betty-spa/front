"use client"
// src/utils/exportInventoryToExcel.ts
import * as XLSX from "xlsx"
import type { IProduct } from "@/interfaces/products/IProduct"
import type { IRawProduct } from "@/interfaces/products/IRawProduct"
import { InventoryRow } from "@/interfaces/products/IInventoryRow"

type InventoryDataRow = InventoryRow
type ExportableProduct = IProduct | IRawProduct
type ExportableVariation = IProduct["ProductVariations"][number] | IRawProduct["variations"][number]

const toNumber = (value: unknown) => {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
}

const getVariations = (product: ExportableProduct): ExportableVariation[] => {
    if ("ProductVariations" in product && Array.isArray(product.ProductVariations)) return product.ProductVariations
    if ("variations" in product && Array.isArray(product.variations)) return product.variations
    return []
}

const getCategoryName = (product: ExportableProduct) => {
    if ("Category" in product && product.Category?.name) return product.Category.name
    if ("category" in product && product.category?.name) return product.category.name
    return ""
}

const getStoreProducts = (variation: ExportableVariation) => {
    if ("storeProducts" in variation && Array.isArray(variation.storeProducts)) return variation.storeProducts
    if ("StoreProducts" in variation && Array.isArray(variation.StoreProducts)) return variation.StoreProducts
    return []
}

const getPrimaryStoreProduct = (variation: ExportableVariation) => {
    const storeProducts = getStoreProducts(variation)
    return (
        storeProducts.find((storeProduct: any) => storeProduct.store?.isCentralStore || storeProduct.Store?.isCentralStore) ??
        storeProducts[0]
    )
}

const getVariationStock = (variation: ExportableVariation) => {
    if ("stockQuantity" in variation) return toNumber(variation.stockQuantity)

    return getStoreProducts(variation).reduce((total, storeProduct: any) => {
        return total + toNumber(storeProduct.stock ?? storeProduct.quantity)
    }, 0)
}

const getVariationPriceCost = (variation: ExportableVariation) => {
    if ("priceCost" in variation) return toNumber(variation.priceCost)

    const storeProduct: any = getPrimaryStoreProduct(variation)
    return toNumber(storeProduct?.priceCost ?? storeProduct?.priceCostStore)
}

const getVariationPriceList = (variation: ExportableVariation) => {
    if ("priceList" in variation) return toNumber(variation.priceList)

    const storeProduct: any = getPrimaryStoreProduct(variation)
    return toNumber(storeProduct?.priceList ?? storeProduct?.priceListStore)
}

const getVariationSize = (variation: ExportableVariation) => {
    if ("sizeNumber" in variation) return variation.sizeNumber
    return variation.size
}

export function exportInventoryToExcel(products: ExportableProduct[]) {
    const data: InventoryDataRow[] = []

    products.forEach((product) => {
        getVariations(product).forEach((variation) => {
            data.push({
                Producto: product.name,
                Imagen: product.image,
                Género: product.genre,
                Marca: product.brand,
                Categoría: getCategoryName(product),
                Talla: getVariationSize(variation),
                Cantidad: getVariationStock(variation),
                "Precio Costo Neto": getVariationPriceCost(variation),
                "Precio Plaza": getVariationPriceList(variation),
                "Código EAN": variation.sku,
            } as InventoryDataRow)
        })
    })

    const worksheet = XLSX.utils.json_to_sheet(data, { skipHeader: false })
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario")

    XLSX.writeFile(workbook, "Listado-productos-d3si.xlsx")
}
