import FriendlyLoadingScreen from "@/components/Animations/FriendlyLoadingScreen"

export default function HomeLoading() {
    return (
        <FriendlyLoadingScreen
            title="Estamos preparando tu caja"
            detail="Consultando ventas, inventario y la información de tu tienda."
        />
    )
}
