"use client"

import { motion, useSpring, useTransform, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"

interface StatProps {
    value: number
    label: string
    suffix?: string
    align?: "left" | "right"
}

function Counter({ value, label, suffix = "+", align = "left" }: StatProps) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })

    // Spring physics for smooth counting
    const springValue = useSpring(0, {
        stiffness: 50,
        damping: 20,
        duration: 2.5
    })

    // Transform spring value to integer string
    const displayValue = useTransform(springValue, (latest) => Math.round(latest).toString())

    useEffect(() => {
        if (isInView) {
            springValue.set(value)
        }
    }, [isInView, value, springValue])

    return (
        <div
            ref={ref}
            className={`flex flex-col ${align === "right" ? "items-end text-right" : "items-start text-left"}`}
        >
            <div className="flex items-baseline gap-0.5 relative">
                <motion.span
                    className="text-4xl md:text-5xl font-light tracking-tighter text-[#1a1a1a]"
                >
                    {displayValue}
                </motion.span>
                <span className="text-xl md:text-2xl font-light text-[#E8BC59]">{suffix}</span>

                {/* Subtle animated underline */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isInView ? 1 : 0 }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
                    className={`absolute -bottom-1 h-[1px] bg-black/10 w-full origin-${align === "right" ? "right" : "left"}`}
                />
            </div>
            <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-[#1a1a1a]/50 mt-2">
                {label}
            </span>
        </div>
    )
}

export function ExperienceStats() {
    return (
        <>
            {/* Bottom Left: Experience */}
            <div className="absolute bottom-8 left-6 md:bottom-12 md:left-12 z-20 hidden md:block">
                <Counter value={9} label="Years Experience" />
            </div>

            {/* Bottom Right: Projects */}
            <div className="absolute bottom-8 right-6 md:bottom-12 md:right-12 z-20 hidden md:block">
                <Counter value={150} label="Projects Delivered" align="right" />
            </div>
        </>
    )
}
