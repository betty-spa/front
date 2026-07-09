"use client"
import { DollarSign } from "lucide-react"
import { toPrice } from "@/utils/priceFormat"
import { ICountAmountResume, IResume } from "@/interfaces/sales/ISalesResume"
interface ResumeRightProps {
    saleResume: IResume
    bankDepositSummary?: ICountAmountResume
}
export default function ResumeRightSideChart({ saleResume, bankDepositSummary }: ResumeRightProps) {
    const { periodSummary } = saleResume
    const bankDeposit = bankDepositSummary ?? { count: 0, amount: 0 }
    return (
        <div className="flex flex-col gap-6">
            <div className="flex dark:bg-gray-800 bg-white shadow rounded p-4 items-center">
                <div className="w-12 h-12 dark:bg-blue-100 bg-orange-100 dark:text-blue-600 text-orange-600 flex items-center justify-center rounded mr-4 text-xl">
                    <DollarSign />
                </div>
                <div>
                    <p className="text-sm text-gray-500">
                        Depositos bancarios de hoy (o pendientes): {bankDeposit.count}
                    </p>
                    <p className={`text-sm dark:text-white font-bold`}>
                        $<span className="text-xl">{toPrice(bankDeposit.amount)}</span>
                    </p>
                </div>
            </div>
            <div className="flex dark:bg-gray-800 bg-white shadow rounded p-4 items-center">
                <div className="w-12 h-12 dark:bg-blue-100 bg-orange-100 dark:text-blue-600 text-orange-600 flex items-center justify-center rounded mr-4 text-xl">
                    <DollarSign />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Ventas de hoy: {periodSummary.today.count}</p>
                    <p className={`text-sm dark:text-white font-bold`}>
                        $<span className="text-xl">{toPrice(periodSummary.today.total)}</span>
                    </p>
                </div>
            </div>
            <div className="flex dark:bg-gray-800 bg-white shadow rounded p-4 items-center">
                <div className="w-12 h-12 dark:bg-blue-100 bg-orange-100 dark:text-blue-600 text-orange-600 flex items-center justify-center rounded mr-4 text-xl">
                    <DollarSign />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Ventas del mes: {periodSummary.month.count}</p>
                    <p className={`text-xl dark:text-white font-bold`}>${toPrice(periodSummary.month.total)}</p>
                </div>
            </div>
        </div>
    )
}
