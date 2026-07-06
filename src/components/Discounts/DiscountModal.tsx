"use client"

import { useEffect, useMemo, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { DiscountScope, DiscountType, ICreateOfferPayload, ISpecialOffer } from "@/interfaces/pricing/IPricing"
import { createOffer } from "@/actions/pricing/createOffer"
import { updateOffer } from "@/actions/pricing/updateOffer"
import { normalize } from "@/utils/product-form.utils"
import { toast } from "sonner"
import { BadgePercent, Check, ChevronDown, Loader2, Store, Sparkles } from "lucide-react"

export type DiscountStoreProductOption = {
    storeProductID: string
    productName: string
    variationName: string
    storeName: string
    storeID: string
    stockQuantity?: number
    priceList?: number
}

interface DiscountModalProps {
    isOpen: boolean
    onClose: () => void
    options: DiscountStoreProductOption[]
    initialStoreProductID?: string
    initialOffer?: ISpecialOffer | null
    onOfferCreated?: (storeProductID: string) => void
    onOfferUpdated?: (storeProductID: string) => void
}

const todayISO = new Date().toISOString().slice(0, 10)
const formatCurrency = (value?: number) =>
    value === undefined
        ? "Sin dato"
        : new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(value)

const normalizeSearchText = (value: string) =>
    normalize(value)
        .replace(/[^a-z0-9\s]/gi, " ")
        .replace(/\s+/g, " ")
        .trim()

const buildForm = (
    options: DiscountStoreProductOption[],
    initialStoreProductID?: string,
    offer?: ISpecialOffer | null,
) => {
    const storeProductID =
        offer?.storeProductID ??
        offer?.storeProduct?.storeProductID ??
        initialStoreProductID ??
        options[0]?.storeProductID ??
        ""
    return {
        storeProductID,
        discountType: (offer?.discountType ?? "PERCENTAGE") as DiscountType,
        value: offer?.value?.toString() ?? "",
        description: offer?.description ?? "",
        startDate: offer?.startDate ? offer.startDate.slice(0, 10) : todayISO,
        endDate: offer?.endDate ? offer.endDate.slice(0, 10) : "",
        isActive: offer?.isActive ?? true,
        scope: (offer?.scope ?? "UNIT") as DiscountScope,
        exclusive: offer?.exclusive ?? false,
    }
}

export function DiscountModal({
    isOpen,
    onClose,
    options,
    initialStoreProductID,
    initialOffer,
    onOfferCreated,
    onOfferUpdated,
}: DiscountModalProps) {
    const [saving, setSaving] = useState(false)
    const [isProductOpen, setIsProductOpen] = useState(false)
    const [productQuery, setProductQuery] = useState("")
    const [form, setForm] = useState(() => buildForm(options, initialStoreProductID, initialOffer))

    useEffect(() => {
        if (!isOpen) return
        setForm(buildForm(options, initialStoreProductID, initialOffer))
        setProductQuery("")
        setIsProductOpen(false)
    }, [isOpen, initialStoreProductID, initialOffer, options])

    const selectedProduct = useMemo(
        () => options.find((option) => option.storeProductID === form.storeProductID),
        [form.storeProductID, options],
    )

    const selectedPriceList = selectedProduct?.priceList
    const filteredOptions = useMemo(() => {
        const query = normalizeSearchText(productQuery)
        if (!query) return options
        const tokens = query.split(" ").filter(Boolean)

        return options.filter((option) => {
            const searchable = normalizeSearchText(
                `${option.productName} ${option.variationName} ${option.storeName} ${option.storeProductID} ${option.storeID}`,
            )
            return tokens.every((token) => searchable.includes(token))
        })
    }, [options, productQuery])

    const discountKindLabel = form.discountType === "PERCENTAGE" ? "Porcentaje" : "Precio fijo"
    const scopeLabel = form.scope === "UNIT" ? "Por unidad" : "Total"
    const activeLabel = form.isActive ? "Activa" : "Pausada"
    const editingOffer = !!initialOffer?.offerID
    const actionLabel = editingOffer ? "Actualizar descuento" : "Guardar descuento"
    const headerLabel = editingOffer ? "Editar descuento para tienda" : "Crear descuento para tienda"
    const descriptionLabel = editingOffer
        ? "Ajusta los datos de la oferta seleccionada y guarda los cambios."
        : "Define una oferta clara, con vigencia, alcance y reglas visibles para el equipo."

    const handleSave = async () => {
        if (!form.storeProductID) {
            toast.error("Selecciona un producto de tienda")
            return
        }

        if ((selectedProduct?.stockQuantity ?? 1) <= 0) {
            toast.error("El producto seleccionado no tiene stock disponible")
            return
        }

        const parsedValue = parseFloat(form.value)

        if (isNaN(parsedValue) || parsedValue <= 0) {
            toast.error("El descuento debe ser mayor a 0")
            return
        }

        if (form.discountType === "PERCENTAGE" && parsedValue > 100) {
            toast.error("El porcentaje no puede ser mayor a 100%")
            return
        }

        if (
            form.discountType === "FIXED_PRICE" &&
            selectedPriceList !== undefined &&
            parsedValue >= selectedPriceList
        ) {
            toast.error("El descuento fijo no puede ser mayor o igual al precio del producto")
            return
        }

        setSaving(true)
        try {
            const payload: ICreateOfferPayload = {
                storeProductID: form.storeProductID,
                discountType: form.discountType,
                value: parsedValue,
                description: form.description || undefined,
                startDate: new Date(form.startDate).toISOString(),
                endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
                isActive: form.isActive,
                scope: form.scope,
                exclusive: form.exclusive,
            }
            if (initialOffer?.offerID) {
                await updateOffer(initialOffer.offerID, payload)
                toast.success("Oferta actualizada correctamente")
                onOfferUpdated?.(form.storeProductID)
            } else {
                await createOffer(payload)
                toast.success("Oferta creada correctamente")
                onOfferCreated?.(form.storeProductID)
            }
            onClose()
        } catch {
            toast.error("No se pudo crear el descuento")
        } finally {
            setSaving(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl overflow-hidden border-slate-200 bg-white p-0 shadow-2xl dark:border-slate-700 dark:bg-slate-950">
                <div className="bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-5 text-white">
                    <DialogHeader className="space-y-3 text-left">
                        <div className="flex items-center gap-2">
                            <Badge className="border border-white/15 bg-white/10 text-white hover:bg-white/10">
                                <BadgePercent className="mr-1 h-3.5 w-3.5" />
                                Descuento rápido
                            </Badge>
                            <Badge variant="outline" className="border-white/15 text-white/80">
                                {editingOffer ? "Modo edición" : activeLabel}
                            </Badge>
                        </div>
                        <div className="space-y-1">
                            <DialogTitle className="text-2xl font-semibold tracking-tight">{headerLabel}</DialogTitle>
                            <DialogDescription className="max-w-xl text-sm text-slate-300">
                                {descriptionLabel}
                            </DialogDescription>
                        </div>
                    </DialogHeader>
                </div>

                <div className="max-h-[75vh] overflow-y-auto px-6 py-5">
                    <div className="mb-5 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Descuento</p>
                            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                                {discountKindLabel}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Alcance</p>
                            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                                {scopeLabel}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Productos</p>
                            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                                {options.length} disponibles
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
                            <div className="mb-4 flex items-center gap-2">
                                <Store className="h-4 w-4 text-slate-500" />
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    Producto seleccionado
                                </h3>
                            </div>
                            <Label className="text-xs uppercase tracking-wide text-slate-500">Producto de tienda</Label>
                            <Popover open={isProductOpen} onOpenChange={setIsProductOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={isProductOpen}
                                        className="mt-2 h-11 w-full justify-between rounded-xl border-slate-200 bg-slate-50 text-sm font-normal dark:border-slate-700 dark:bg-slate-950"
                                    >
                                        {selectedProduct
                                            ? `${selectedProduct.productName} - Talla ${selectedProduct.variationName} (${selectedProduct.storeName})`
                                            : "Selecciona un producto"}
                                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-(--radix-popover-trigger-width) p-0"
                                    align="start"
                                    sideOffset={8}
                                >
                                    <Command shouldFilter={false}>
                                        <CommandInput
                                            placeholder="Buscar por nombre..."
                                            value={productQuery}
                                            onValueChange={setProductQuery}
                                        />
                                        <CommandList>
                                            <CommandEmpty>No se encontraron productos.</CommandEmpty>
                                            <CommandGroup>
                                                {filteredOptions.map((option) => (
                                                    <CommandItem
                                                        key={option.storeProductID}
                                                        value={option.storeProductID}
                                                        onSelect={() => {
                                                            setForm((prev) => ({
                                                                ...prev,
                                                                storeProductID: option.storeProductID,
                                                            }))
                                                            setIsProductOpen(false)
                                                        }}
                                                    >
                                                        <Check
                                                            className={`mr-2 h-4 w-4 ${form.storeProductID === option.storeProductID ? "opacity-100" : "opacity-0"}`}
                                                        />
                                                        <div className="flex flex-col">
                                                            <span>{option.productName}</span>
                                                            <span className="text-xs text-slate-500">
                                                                Talla {option.variationName} · {option.storeName}
                                                            </span>
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            {!options.length && (
                                <p className="mt-2 text-xs text-rose-500">No hay productos de tienda disponibles.</p>
                            )}
                            {options.length > 0 && filteredOptions.length === 0 && (
                                <p className="mt-2 text-xs text-slate-500">
                                    No hay coincidencias para &quot;{productQuery}&quot;.
                                </p>
                            )}

                            {selectedProduct && (
                                <div className="mt-4 rounded-2xl border border-slate-200 bg-linear-to-br from-slate-50 to-white p-4 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                {selectedProduct.productName}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                Talla {selectedProduct.variationName} · {selectedProduct.storeName}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="rounded-full">
                                                <Sparkles className="mr-1 h-3.5 w-3.5" />
                                                Listo para aplicar
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-xl bg-white/80 p-3 ring-1 ring-slate-200 dark:bg-slate-950/60 dark:ring-slate-800">
                                            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                                                Precio lista
                                            </p>
                                            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                                                {formatCurrency(selectedPriceList)}
                                            </p>
                                        </div>
                                        <div className="rounded-xl bg-white/80 p-3 ring-1 ring-slate-200 dark:bg-slate-950/60 dark:ring-slate-800">
                                            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                                                Estado
                                            </p>
                                            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                                                {activeLabel}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>

                        <section className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60 sm:grid-cols-2">
                            <div>
                                <Label className="text-xs uppercase tracking-wide text-slate-500">
                                    Tipo de descuento
                                </Label>
                                <select
                                    value={form.discountType}
                                    onChange={(event) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            discountType: event.target.value as DiscountType,
                                        }))
                                    }
                                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                                >
                                    <option value="PERCENTAGE">Porcentaje (%)</option>
                                    <option value="FIXED_AMOUNT">Monto fijo</option>
                                    <option value="FIXED_PRICE">Precio fijo</option>
                                </select>
                            </div>
                            <div>
                                <Label className="text-xs uppercase tracking-wide text-slate-500">Valor</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    max={form.discountType === "PERCENTAGE" ? 100 : undefined}
                                    value={form.value}
                                    onChange={(event) => {
                                        let val = event.target.value
                                        // Prevents negative numbers from being typed
                                        if (val.includes("-")) return

                                        // If percentage, limit to 100 immediately
                                        if (form.discountType === "PERCENTAGE" && parseFloat(val) > 100) {
                                            val = "100"
                                        }

                                        setForm((prev) => ({ ...prev, value: val }))
                                    }}
                                    onKeyDown={(e) => {
                                        // Prevent user from pressing '-', 'e', or '+'
                                        if (e.key === "-" || e.key === "e" || e.key === "+") {
                                            e.preventDefault()
                                        }
                                    }}
                                    placeholder={form.discountType === "PERCENTAGE" ? "Ej: 15" : "Ej: 19990"}
                                    className="mt-2 h-11 rounded-xl border-slate-200 bg-white text-sm dark:border-slate-700 dark:bg-slate-950"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <Label className="text-xs uppercase tracking-wide text-slate-500">Descripción</Label>
                                <Input
                                    className="mt-2 h-11 rounded-xl border-slate-200 bg-white text-sm dark:border-slate-700 dark:bg-slate-950"
                                    value={form.description}
                                    onChange={(event) =>
                                        setForm((prev) => ({ ...prev, description: event.target.value }))
                                    }
                                    placeholder="Ej: Promoción relámpago"
                                />
                            </div>
                        </section>

                        <section className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60 sm:grid-cols-2">
                            <div>
                                <Label className="text-xs uppercase tracking-wide text-slate-500">Fecha inicio</Label>
                                <Input
                                    type="date"
                                    value={form.startDate}
                                    onChange={(event) =>
                                        setForm((prev) => ({ ...prev, startDate: event.target.value }))
                                    }
                                    className="mt-2 h-11 rounded-xl border-slate-200 bg-slate-50 text-sm dark:border-slate-700 dark:bg-slate-950"
                                />
                            </div>
                            <div>
                                <Label className="text-xs uppercase tracking-wide text-slate-500">Fecha fin</Label>
                                <Input
                                    type="date"
                                    value={form.endDate}
                                    onChange={(event) => setForm((prev) => ({ ...prev, endDate: event.target.value }))}
                                    className="mt-2 h-11 rounded-xl border-slate-200 bg-slate-50 text-sm dark:border-slate-700 dark:bg-slate-950"
                                />
                            </div>
                        </section>

                        <section className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60 sm:grid-cols-2">
                            <div>
                                <Label className="text-xs uppercase tracking-wide text-slate-500">Alcance</Label>
                                <select
                                    value={form.scope}
                                    onChange={(event) =>
                                        setForm((prev) => ({ ...prev, scope: event.target.value as DiscountScope }))
                                    }
                                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                                >
                                    <option value="UNIT">Por unidad</option>
                                    <option value="TOTAL">Total de la venta</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-950">
                                <div>
                                    <Label
                                        htmlFor="exclusive"
                                        className="text-sm font-medium text-slate-900 dark:text-slate-100"
                                    >
                                        Oferta exclusiva
                                    </Label>
                                    <p className="text-xs text-slate-500">
                                        Evita que se combine con otras promociones.
                                    </p>
                                </div>
                                <input
                                    id="exclusive"
                                    type="checkbox"
                                    checked={form.exclusive}
                                    onChange={(event) =>
                                        setForm((prev) => ({ ...prev, exclusive: event.target.checked }))
                                    }
                                    className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                            </div>
                        </section>

                        <section className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-950 px-4 py-4 text-white shadow-lg shadow-slate-950/20">
                            <div>
                                <p className="text-sm font-semibold">Publicación inmediata</p>
                                <p className="text-xs text-slate-300">La oferta se activa al guardar.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant="outline" className="border-white/15 text-white">
                                    {activeLabel}
                                </Badge>
                                <input
                                    id="isActive"
                                    type="checkbox"
                                    checked={form.isActive}
                                    onChange={(event) =>
                                        setForm((prev) => ({ ...prev, isActive: event.target.checked }))
                                    }
                                    className="h-5 w-5 rounded border-white/30 text-blue-600 focus:ring-blue-500"
                                />
                            </div>
                        </section>
                    </div>

                    <DialogFooter className="mt-6 flex-col gap-3 sm:flex-row">
                        <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={saving || !options.length}
                            className="w-full bg-linear-to-r from-slate-950 to-slate-700 text-white shadow-lg shadow-slate-950/20 hover:from-slate-900 hover:to-slate-600 sm:w-auto"
                        >
                            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {actionLabel}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}
