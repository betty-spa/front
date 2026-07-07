import { Suspense } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ChartBarIcon } from "lucide-react"
import FilterControls from "@/components/Caja/FilterControls"
import DailyResumeCards from "@/components/Caja/DailyResumeCards"
import SalesAndResumeSkeleton from "@/components/skeletons/SalesAndResume"
import ResumeLeftSideChart from "@/components/Caja/ResumeLeftSideChart"
import TotalSalesResumeGraph from "@/components/Caja/TotalSalesResumeGraph"
import ResumeRightSideChart from "@/components/Caja/ResumeRightSideChart"
import { SaleForm } from "@/components/CreateSale/SaleForm"
import SalesTable from "@/components/Caja/SalesTable"
import { IStore } from "@/interfaces/stores/IStore"
import { IResume } from "@/interfaces/sales/ISalesResume"
import { ISaleResponse } from "@/interfaces/sales/ISale"
import { IPurchaseOrder } from "@/interfaces/orders/IPurchaseOrder"
import { IProduct } from "@/interfaces/products/IProduct"
import { salesToResume } from "@/utils/saleToResume"

type HomeDashboardProps = {
    stores: IStore[]
    resume: IResume
    allSalesForResume: ISaleResponse[]
    items: Array<ISaleResponse | (IPurchaseOrder & { isOrder: true })>
    allProducts: IProduct[]
    dateRef: Date
    date: string
}

export default function HomeDashboard({
    stores,
    resume,
    allSalesForResume,
    items,
    allProducts,
    dateRef,
    date,
}: HomeDashboardProps) {
    const monthLabel = new Intl.DateTimeFormat("es-CL", {
        month: "long",
        timeZone: "America/Santiago",
    }).format(dateRef)

    return (
        <div className="space-y-6 px-4 py-4 sm:space-y-8 sm:px-6 sm:py-6 md:px-8 lg:space-y-10">
            <div className="flex flex-col flex-wrap items-center justify-between gap-2 sm:flex-row sm:items-start">
                <FilterControls stores={stores} />
                <DailyResumeCards salesResume={salesToResume(allSalesForResume, dateRef)} />
            </div>

            <h2 className="px-1 text-lg font-semibold text-slate-800 dark:text-slate-100">
                Desempeño del mes de {monthLabel}
            </h2>

            <Suspense fallback={<SalesAndResumeSkeleton />}>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>
                            <div className="flex items-center gap-3">
                                <ChartBarIcon />
                                Panel de estadísticas globales
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="block space-y-6 lg:grid lg:grid-cols-3 lg:items-start lg:gap-4 xl:gap-4 lg:space-y-0">
                            <ResumeLeftSideChart saleResume={resume} />
                            <TotalSalesResumeGraph resume={resume} date={date} />
                            <ResumeRightSideChart saleResume={resume} />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </Suspense>

            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md dark:border-gray-700">
                <SaleForm initialProducts={allProducts} />
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md dark:border-gray-700">
                <SalesTable items={items} />
            </div>
        </div>
    )
}
