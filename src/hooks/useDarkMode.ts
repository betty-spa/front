"use client"

import { useEffect, useState } from "react"

const DARK_MODE_COOKIE = "dark"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

function getDarkModeCookie() {
    const cookie = document.cookie
        .split("; ")
        .find((item) => item.startsWith(`${DARK_MODE_COOKIE}=`))
        ?.split("=")
        .slice(1)
        .join("=")

    if (!cookie) return null

    const value = decodeURIComponent(cookie)

    try {
        const parsed = JSON.parse(value)
        return typeof parsed === "boolean" ? parsed : null
    } catch {
        if (value === "true") return true
        if (value === "false") return false
        return null
    }
}

function setDarkModeCookie(isDarkMode: boolean) {
    document.cookie = `${DARK_MODE_COOKIE}=${encodeURIComponent(JSON.stringify(isDarkMode))}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`
}

export default function useDarkMode() {
    const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null)

    useEffect(() => {
        const cookieValue = getDarkModeCookie()

        if (cookieValue !== null) {
            setIsDarkMode(cookieValue)
            return
        }

        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        setIsDarkMode(prefersDark)
    }, [])

    useEffect(() => {
        if (isDarkMode === null) return

        document.documentElement.classList.toggle("dark", isDarkMode)
        document.body?.classList.toggle("dark", isDarkMode)
        setDarkModeCookie(isDarkMode)
    }, [isDarkMode])

    return { isDarkMode, setIsDarkMode }
}
