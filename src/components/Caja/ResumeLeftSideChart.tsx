"use client"
import { FileText } from "lucide-react"
import { IResume } from "@/interfaces/sales/ISalesResume"
import { toPrice } from "@/utils/priceFormat"
import { useAuth } from "@/stores/user.store"
import { useTienda } from "@/stores/tienda.store"
import { Role } from "@/lib/userRoles"

interface ResumeLeftProps {
    saleResume: IResume
}

export default function ResumeLeftSideChart({ saleResume }: ResumeLeftProps) {
    const { user } = useAuth()
    const { storeSelected } = useTienda()
    const monthlySalesCount = saleResume.periodSummary.month.count
    const monthlySalesTotal = saleResume.periodSummary.month.total
    const averageTicket = monthlySalesCount > 0 ? monthlySalesTotal / monthlySalesCount : 0

    if (user?.role !== Role.Admin && storeSelected?.role !== Role.Admin) return null
    return (
        <div className="flex flex-col gap-9">
            <div className="flex dark:bg-gray-800 bg-white shadow rounded p-4 items-center">
                <div className="w-12 h-12 dark:bg-blue-100 bg-orange-100 dark:text-blue-600 text-orange-600 flex items-center justify-center rounded mr-4 text-xl">
                    <FileText />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Boletas Emitidas</p>
                    <p className={`text-xl dark:text-white font-bold`}>{saleResume.periodSummary.month.count}</p>
                </div>
            </div>
            <div className="flex dark:bg-gray-800 bg-white shadow rounded p-4 items-center">
                <div className="w-12 h-12 dark:bg-blue-100 bg-orange-100 dark:text-blue-600 text-orange-600 flex items-center justify-center rounded mr-4 text-xl">
                    <FileText />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Facturas Emitidas</p>
                    <p className={`text-xl dark:text-white font-bold`}>{0}</p>
                </div>
            </div>
            <div className="flex dark:bg-gray-800 bg-white shadow rounded p-4 items-center">
                <div className="w-12 h-12 dark:bg-blue-100 bg-orange-100 dark:text-blue-600 text-orange-600 flex items-center justify-center rounded mr-4 text-xl">
                    <FileText />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Ticket promedio</p>
                    <p className={`text-xl dark:text-white font-bold`}>${toPrice(averageTicket)}</p>
                </div>
            </div>
        </div>
    )
}
