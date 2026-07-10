"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LoaderCircle } from "lucide-react"
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
import FriendlyLoadingScreen from "../Animations/FriendlyLoadingScreen"

export default function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setLoading] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState("Verificando tus datos...")
    const router = useRouter()
    const { setUser } = useAuth()
    const { setStoreSelected, setStoresUser } = useTienda()
    const { isDarkMode, setIsDarkMode } = useDarkMode()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (isLoading) return

        let navigationStarted = false

        try {
            setLoading(true)
            setLoadingMessage("Verificando tus datos...")

            const data = await login(email, password)
            if (!data.user) {
                toast.error("Email o contraseña incorrectos")
                return
            }

            setUser(data.user, data.accessToken)
            setLoadingMessage("Buscando tus tiendas...")

            const userStores = await getUserStores(data.user.userID)
            setStoresUser(userStores)

            let destination = "/home?storeID=all"

            if (userStores.length > 0) {
                const selectedStore = userStores[0]
                setStoreSelected(selectedStore)

                const storeID = selectedStore.storeID
                destination =
                    data.user.role === Role.Consignado || data.user.role === Role.Tercero
                        ? `/home/purchaseOrder?storeID=${storeID}`
                        : `/home?storeID=${storeID}`

                toast.success("Inicio de sesión exitoso")
            } else {
                toast.success("Inicio de sesión exitoso, verificando tiendas...")
            }

            setLoadingMessage("Preparando tu experiencia...")
            router.prefetch(destination)
            navigationStarted = true
            router.push(destination)
        } catch (err) {
            console.error(err)
            toast.error("Error inesperado al iniciar sesión")
        } finally {
            if (!navigationStarted) {
                setLoading(false)
            }
        }
    }

    return (
        <>
            {isLoading && (
                <FriendlyLoadingScreen
                    overlay
                    title={loadingMessage}
                    detail="Estamos preparando BETTY para tu tienda."
                />
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4" aria-busy={isLoading}>
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
                        autoComplete="email"
                        disabled={isLoading}
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
                        autoComplete="current-password"
                        disabled={isLoading}
                        required
                    />
                </div>

                <Button type="submit" disabled={isLoading} className="min-h-9">
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                            Iniciando sesión...
                        </span>
                    ) : (
                        "Iniciar sesión"
                    )}
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
                        disabled={isLoading}
                        className="bg-gray-300 data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-slate-900 flex-shrink-0"
                    />
                </div>
            </form>
        </>
    )
}
