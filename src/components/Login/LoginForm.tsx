"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import { login } from "@/actions/auth/authActions"
import { getUserStores } from "@/actions/users/getUserStores"
import { useAuth } from "@/stores/user.store"
import { toast } from "sonner"
import { useTienda } from "@/stores/tienda.store"
import { Role } from "@/lib/userRoles"
import useDarkMode from "@/hooks/useDarkMode"
import { Switch } from "../ui/switch"
import { Input } from "../ui/input"

export default function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()
    const { setUser } = useAuth()
    const { setStoreSelected, setStoresUser } = useTienda()
    const [isLoading, setLoading] = useState(false)
    const { isDarkMode, setIsDarkMode } = useDarkMode()
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setLoading(true)
            const data = await login(email, password)
            if (!data.user) {
                toast.error("Email o contraseña incorrectos")
                return
            }

            setUser(data.user, data.accessToken)
            const userStores = await getUserStores(data.user.userID)
            const resolvedStoresFromUser = userStores

            setStoresUser(resolvedStoresFromUser)

            if (resolvedStoresFromUser.length > 0) {
                const selectedStore = resolvedStoresFromUser[0]
                setStoreSelected(selectedStore)
                const storeID = selectedStore.storeID
                toast.success("Inicio de sesión exitoso")
                if (data.user.role === Role.Consignado || data.user.role === Role.Tercero) {
                    return router.push(`/home/purchaseOrder?storeID=${storeID}`)
                }
                router.push(`/home?storeID=${storeID}`)
            } else {
                toast.success("Inicio de sesión exitoso, verificando tiendas...")
                router.push(`/home?storeID=all`)
            }
        } catch (err) {
            console.error(err)
            toast.error("Error inesperado al iniciar sesión")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
                <label className="block text-sm font-medium mb-1" htmlFor="email">
                    Correo electrónico
                </label>
                <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border dark:border-slate-600 dark:bg-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1" htmlFor="password">
                    Contraseña
                </label>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border dark:border-slate-600 dark:bg-slate-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <Button type="submit" disabled={isLoading}>
                {isLoading ? "Iniciando sesión" : "Iniciar sesión"}
            </Button>
            <div className="pt-10 flex flex-row justify-center items-center gap-2">
                {isDarkMode ? (
                    <span className="text-xs italic">Modo Oscuro</span>
                ) : (
                    <span className="text-xs italic">Modo Claro</span>
                )}
                <Switch
                    checked={!!isDarkMode}
                    title="Clic para cambiar"
                    onCheckedChange={setIsDarkMode}
                    className="bg-gray-300 data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-slate-900 flex-shrink-0"
                />
            </div>
        </form>
    )
}
