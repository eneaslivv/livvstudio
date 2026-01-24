"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SectionRevealProps {
    children: ReactNode
    className?: string
    delay?: number
}

export function SectionReveal({ children, className, delay = 0 }: SectionRevealProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98], delay }}
            className={cn(className)}
        >
            {children}
        </motion.div>
    )
}
