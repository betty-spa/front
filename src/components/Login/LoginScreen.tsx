"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import LoginForm from "@/components/Login/LoginForm"

export default function LoginScreen() {
    return (
        <main className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#eef5fb] px-4 py-10 dark:bg-[#07111d]">
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.96),rgba(224,244,255,0.84)_46%,rgba(230,247,238,0.78))] dark:bg-[linear-gradient(120deg,rgba(7,17,29,0.98),rgba(12,32,52,0.94)_52%,rgba(13,42,34,0.88))]"
            />
            <div
                aria-hidden="true"
                className="absolute inset-0 opacity-40 bg-[linear-gradient(rgba(11,65,104,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(11,65,104,0.08)_1px,transparent_1px)] bg-size-[44px_44px] dark:opacity-20 dark:bg-[linear-gradient(rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.09)_1px,transparent_1px)]"
            />
            <div
                aria-hidden="true"
                className="absolute -left-28 top-0 h-full w-[48vw] min-w-105 -skew-x-12 bg-[#0f73ac]/12 dark:bg-cyan-400/10"
            />
            <div
                aria-hidden="true"
                className="absolute -right-36 bottom-[-18%] h-[58%] w-[52vw] min-w-115 -skew-x-12 bg-emerald-400/18 dark:bg-emerald-400/10"
            />
            <Image
                aria-hidden="true"
                src="/brand/two-brands-color.png"
                alt=""
                width={296}
                height={142}
                priority
                className="absolute left-8 top-8 hidden opacity-[0.12] grayscale lg:block dark:opacity-[0.07]"
            />
            <Image
                aria-hidden="true"
                src="/brand/betty.claro.transparent.png"
                alt=""
                width={420}
                height={420}
                className="absolute bottom-8 right-8 hidden h-64 w-64 object-contain opacity-[0.08] mix-blend-multiply lg:block dark:hidden"
            />
            <Image
                aria-hidden="true"
                src="/brand/betty.dark.transparent2.png"
                alt=""
                width={420}
                height={420}
                className="absolute bottom-8 right-8 hidden h-64 w-64 object-contain opacity-[0.09] dark:lg:block"
            />
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md rounded-lg border border-white/75 bg-white/90 p-8 shadow-[0_32px_80px_rgba(15,35,60,0.22)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/86 dark:shadow-[0_32px_80px_rgba(0,0,0,0.38)]"
            >
                <div className="mb-7 flex justify-center">
                    <Image
                        src="/brand/betty.claro.transparent.png"
                        alt="BETTY Software Retail"
                        width={224}
                        height={224}
                        priority
                        className="h-40 w-56 object-cover dark:hidden"
                    />
                    <Image
                        src="/brand/betty.dark.transparent2.png"
                        alt="BETTY Software Retail"
                        width={224}
                        height={224}
                        priority
                        className="hidden h-40 w-56 object-cover dark:block"
                    />
                </div>
                <h1 className="mb-2 text-center text-2xl font-bold text-gray-800 dark:text-white">Iniciar sesión</h1>
                <p className="mb-6 text-center text-sm text-gray-500 dark:text-slate-300">
                    Acceso administrativo a BETTY SOFTWARE
                </p>
                <LoginForm />
                <p className="mt-6 text-center text-xs text-gray-400 dark:text-slate-500">
                    © 2026 BETTY. Todos los derechos reservados.
                </p>
            </motion.div>
        </main>
    )
}
