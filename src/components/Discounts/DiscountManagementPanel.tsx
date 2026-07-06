"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DiscountModal, DiscountStoreProductOption } from "./DiscountModal"
import { IProduct } from "@/interfaces/products/IProduct"
import { IStoreProduct } from "@/interfaces/products/IProductVariation"
import { ISpecialOffer } from "@/interfaces/pricing/IPricing"
import { BadgePercent, ChevronRight } from "lucide-react"

interface DiscountManagementPanelProps {
    products: IProduct[]
    offers: ISpecialOffer[]
}

type DiscountStoreProductRow = DiscountStoreProductOption & {
    stockQuantity: number
    finalPrice?: number
    discountApplied?: boolean
    activeOffer?: IStoreProduct["activeOffer"]
    specialOffers?: IStoreProduct["specialOffers"]
}

type DiscountOfferRow = {
    offerID: string
    storeProductID: string
    productName: string
    variationName: string
    storeName: string
    priceList?: number
    discountType: string
    value: number
    scope?: string
    exclusive?: boolean
    isActive: boolean
    startDate: string
    endDate?: string
    createdAt: string
}

const formatCurrency = (value?: number) =>
    value === undefined
        ? "Sin dato"
        : new Intl.NumberFormat("es-CL", {
              style: "currency",
              currency: "CLP",
              maximumFractionDigits: 0,
          }).format(value)

const getStoreProductRelation = (offer: ISpecialOffer) => offer.storeProduct ?? null

const getProductName = (offer: ISpecialOffer) => {
    const storeProduct = getStoreProductRelation(offer)
    return storeProduct?.variation?.product?.name ?? "Producto sin nombre"
}

const getVariationName = (offer: ISpecialOffer) => {
    const storeProduct = getStoreProductRelation(offer)
    return storeProduct?.variation?.size ?? storeProduct?.variation?.sizeNumber ?? "Sin talla"
}

const getStoreName = (offer: ISpecialOffer) => {
    const storeProduct = getStoreProductRelation(offer)
    return storeProduct?.store?.name ?? storeProduct?.Store?.name ?? "Sin tienda"
}

const getOfferValueLabel = (offer: Pick<DiscountOfferRow, "discountType" | "value">) => {
    if (offer.discountType === "PERCENTAGE") return `${offer.value}%`
    return formatCurrency(offer.value)
}

const getDiscountTypeLabel = (discountType: string) => {
    if (discountType === "PERCENTAGE") return "Porcentaje"
    if (discountType === "FIXED_AMOUNT") return "Monto fijo"
    return "Precio fijo"
}

const getStoreProductStock = (storeProduct: IStoreProduct) => {
    const quantity = Number(storeProduct.quantity)
    return Number.isFinite(quantity) ? quantity : 0
}

export function DiscountManagementPanel({ products, offers }: DiscountManagementPanelProps) {
    const router = useRouter()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [initialStoreProduct, setInitialStoreProduct] = useState<string>()
    const [selectedOffer, setSelectedOffer] = useState<ISpecialOffer | null>(null)

    const storeProductOptions = useMemo<DiscountStoreProductRow[]>(() => {
        const flattened: DiscountStoreProductRow[] = []
        products.forEach((product) => {
            product.ProductVariations.forEach((variation) => {
                variation.StoreProducts?.forEach((storeProduct) => {
                    const stockQuantity = getStoreProductStock(storeProduct)
                    if (stockQuantity <= 0) return

                    flattened.push({
                        storeProductID: storeProduct.storeProductID,
                        productName: product.name,
                        variationName: variation.sizeNumber,
                        storeName: storeProduct.Store?.name ?? "",
                        storeID: storeProduct.storeID,
                        priceList: Number(storeProduct.priceListStore) || variation.priceList,
                        stockQuantity,
                        finalPrice: storeProduct.finalPrice,
                        discountApplied: storeProduct.discountApplied,
                        activeOffer: storeProduct.activeOffer,
                        specialOffers: storeProduct.specialOffers,
                    })
                })
            })
        })
        return flattened
    }, [products])

    const availableStoreProductIDs = useMemo(
        () => new Set(storeProductOptions.map((option) => option.storeProductID)),
        [storeProductOptions],
    )

    const offerRows = useMemo<DiscountOfferRow[]>(() => {
        const rowsById = new Map<string, DiscountOfferRow>()

        for (const offer of offers) {
            const storeProduct = getStoreProductRelation(offer)
            const storeProductID = offer.storeProductID ?? storeProduct?.storeProductID ?? ""
            if (!availableStoreProductIDs.has(storeProductID)) continue

            const option = storeProductOptions.find((item) => item.storeProductID === storeProductID)
            rowsById.set(offer.offerID, {
                offerID: offer.offerID,
                storeProductID,
                productName: option?.productName ?? getProductName(offer),
                variationName: option?.variationName ?? getVariationName(offer),
                storeName: option?.storeName ?? getStoreName(offer),
                priceList: option?.priceList ?? storeProduct?.priceList,
                discountType: offer.discountType,
                value: offer.value,
                scope: offer.scope,
                exclusive: offer.exclusive,
                isActive: offer.isActive,
                startDate: offer.startDate,
                endDate: offer.endDate,
                createdAt: offer.createdAt,
            })
        }

        for (const option of storeProductOptions) {
            const storeProductOffers = [option.activeOffer, ...(option.specialOffers ?? [])].filter(Boolean)

            for (const offer of storeProductOffers) {
                if (!offer?.offerID || rowsById.has(offer.offerID)) continue

                rowsById.set(offer.offerID, {
                    offerID: offer.offerID,
                    storeProductID: option.storeProductID,
                    productName: option.productName,
                    variationName: option.variationName,
                    storeName: option.storeName,
                    priceList: option.priceList,
                    discountType: offer.discountType,
                    value: offer.value,
                    scope: offer.scope,
                    exclusive: offer.exclusive,
                    isActive: offer.isActive,
                    startDate: offer.startDate,
                    endDate: offer.endDate,
                    createdAt: offer.createdAt,
                })
            }
        }

        return Array.from(rowsById.values()).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    }, [availableStoreProductIDs, offers, storeProductOptions])

    const handleOpenModal = (storeProductID?: string, offer?: ISpecialOffer | null) => {
        setInitialStoreProduct(storeProductID)
        setSelectedOffer(offer ?? null)
        setIsModalOpen(true)
    }

    return (
        <div className="space-y-6">
            <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        Inventario
                    </p>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Ofertas y Descuentos
                    </h1>
                    <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
                        Revisa todas las ofertas creadas y crea nuevas promociones desde un solo lugar.
                    </p>
                </div>
                <Button
                    size="default"
                    className="shadow-sm transition-all hover:shadow-md"
                    onClick={() => handleOpenModal(storeProductOptions[0]?.storeProductID)}
                >
                    Crear descuento manual
                </Button>
            </header>

            {storeProductOptions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-12 text-center dark:border-slate-800 dark:bg-slate-900/50">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Ningun producto tiene stock disponible para descuentos en esta tienda.
                    </p>
                </div>
            ) : offerRows.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-12 text-center dark:border-slate-800 dark:bg-slate-900/50">
                    <p className="text-sm text-slate-500 dark:text-slate-400">No hay ofertas creadas para mostrar.</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                                <TableRow>
                                    <TableHead className="w-[320px] font-semibold text-slate-900 dark:text-slate-200">
                                        Oferta
                                    </TableHead>
                                    <TableHead className="font-semibold text-slate-900 dark:text-slate-200">
                                        Tienda
                                    </TableHead>
                                    <TableHead className="font-semibold text-slate-900 dark:text-slate-200">
                                        Talla
                                    </TableHead>
                                    <TableHead className="font-semibold text-slate-900 dark:text-slate-200">
                                        Tipo
                                    </TableHead>
                                    <TableHead className="text-right font-semibold text-slate-900 dark:text-slate-200">
                                        Valor
                                    </TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {offerRows.map((offer) => (
                                    <TableRow
                                        key={offer.offerID}
                                        className="group cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                        onClick={() =>
                                            handleOpenModal(
                                                offer.storeProductID,
                                                offers.find((item) => item.offerID === offer.offerID) ?? null,
                                            )
                                        }
                                    >
                                        <TableCell className="font-medium">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        variant="outline"
                                                        className={`gap-1 ${
                                                            offer.isActive
                                                                ? "bg-green-200 text-amber-900"
                                                                : "bg-amber-800 text-white"
                                                        }`}
                                                    >
                                                        {offer.isActive ? "Activa" : "Inactiva"}
                                                    </Badge>
                                                    <span className="text-slate-900 dark:text-slate-100">
                                                        {offer.productName}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-600 dark:text-slate-300">
                                            {offer.storeName}
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700/50">
                                                {offer.variationName}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-slate-600 dark:text-slate-300">
                                            {getDiscountTypeLabel(offer.discountType)}
                                            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                {offer.exclusive ? "Exclusiva" : "Compartida"} · {offer.scope ?? "UNIT"}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-medium text-slate-900 dark:text-slate-100">
                                            <div className="flex flex-col items-end">
                                                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                                    {getOfferValueLabel(offer)}
                                                </span>
                                                <span className="text-xs text-slate-500">
                                                    Base: {formatCurrency(offer.priceList)}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <ChevronRight className="h-5 w-5 text-slate-400 opacity-0 transition-all group-hover:translate-x-1 group-hover:text-blue-500 group-hover:opacity-100" />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}

            {offerRows.length > 0 && (
                <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                    Mostrando <span className="font-medium text-slate-900 dark:text-slate-300">{offerRows.length}</span>{" "}
                    ofertas creadas.
                </p>
            )}

            <DiscountModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setSelectedOffer(null)
                }}
                options={storeProductOptions}
                initialStoreProductID={initialStoreProduct}
                initialOffer={selectedOffer}
                onOfferCreated={() => router.refresh()}
                onOfferUpdated={() => router.refresh()}
            />
        </div>
    )
}
