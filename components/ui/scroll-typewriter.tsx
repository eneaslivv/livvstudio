"use client"

import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { useRef } from "react"
import { cn } from "@/lib/utils"

interface ScrollTypewriterProps {
    children: React.ReactNode
    className?: string
    as?: React.ElementType
}

export function ScrollTypewriter({
    children,
    className = "",
    as: Component = "span"
}: ScrollTypewriterProps) {
    const ref = useRef<HTMLElement>(null)

    // Adjusted offsets for a smoother, longer reveal
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 85%", "end 50%"]
    })

    // Very soft spring for the "bien suave" feel
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 })

    // Map scroll progress to clip-path inset (100% hidden -> 0% hidden)
    const clipPath = useTransform(smoothProgress, [0, 1], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"])

    // Cast to any to avoid strict typing issues with dynamic generic components and refs
    const Tag = Component as any

    return (
        <Tag ref={ref} className={cn("relative inline-block", className)} style={{ position: 'relative' }}>
            {/* Ghost Layer: Always visible, faint opacity */}
            <span className="opacity-10 select-none pointer-events-none" aria-hidden="true" style={{ filter: 'blur(0.5px)' }}>
                {children}
            </span>

            {/* Active Layer: Absolute overlay, revealed by clip-path */}
            <motion.span
                style={{ clipPath }}
                className="absolute inset-0 z-10"
            >
                {children}
            </motion.span>
        </Tag>
    )
}
