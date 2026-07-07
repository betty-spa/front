"use client"

import React from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IResume } from "@/interfaces/sales/ISalesResume"
const DynamicGaugeChart = dynamic(() => import("@/components/Caja/TotalSalesResumeGraph"), {
    ssr: false,
})

export default function GaugeChartSection({ resume }: { resume: IResume }) {
    return (
        <div>
            <Card className="dark:bg-gray-800 border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center relative dark:text-white text-sm md:text-base">
                        Ventas del mes VS Meta
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="flex justify-center items-center h-48 md:h-full">
                        <div className="w-full max-w-sm mx-auto">
                            <DynamicGaugeChart resume={resume} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
