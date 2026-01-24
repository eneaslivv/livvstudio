"use client"

import { ReactNode, useEffect } from "react"
import Lenis from "lenis"
import { usePathname } from "next/navigation"

export function SmoothScroll({ children }: { children: ReactNode }) {
    const pathname = usePathname()

    useEffect(() => {
        // Disable smooth scroll on admin and portal routes to avoid conflict with native scroll containers
        if (pathname?.startsWith('/admin') || pathname?.startsWith('/portal')) return

        // Force scroll to top on route change to prevent starting mid-page
        window.scrollTo(0, 0)

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        })

        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        return () => {
            lenis.destroy()
        }
    }, [pathname])

    return <>{children}</>
}
