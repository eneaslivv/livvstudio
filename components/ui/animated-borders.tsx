"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from "framer-motion"

interface AnimatedBordersProps {
    className?: string
    showLeft?: boolean
    showRight?: boolean
    showTop?: boolean
    showBottom?: boolean
    fullWidth?: boolean
}

export function AnimatedBorders({
    className = "",
    showLeft = true,
    showRight = true,
    showTop = false,
    showBottom = false,
    fullWidth = false
}: AnimatedBordersProps) {
    const [randomOffset] = useState(() => Math.random() * 10)

    // REFINED GRADIENT: Softer falloff and deeper atmosphere
    // We'll use one base gradient and rotate it to maintain continuity
    const vibrantGradient = "linear-gradient(to bottom, transparent 0%, transparent 5%, rgba(255, 0, 255, 0.1) 15%, rgba(255, 0, 255, 0.7) 30%, rgba(255, 136, 0, 0.8) 45%, rgba(255, 215, 0, 0.8) 55%, rgba(0, 136, 255, 0.7) 70%, rgba(0, 136, 255, 0.1) 85%, transparent 95%, transparent 100%)"
    const vibrantShadow = "drop-shadow(0 0 8px rgba(255, 200, 0, 0.2)) drop-shadow(0 0 15px rgba(255, 0, 255, 0.15)) drop-shadow(0 0 25px rgba(0, 136, 255, 0.15))"

    const particleStyle = {
        background: vibrantGradient,
        filter: `${vibrantShadow} blur(6px)`,
        width: "4px",
        height: "200px",
        borderRadius: "9999px",
    }

    // Grid coordinates (using calc to match Tailwind classes)
    const xLeft = "var(--grid-offset, 1.5rem)" // 6 -> 1.5rem, 12 -> 3rem handled by CSS var
    const xRight = "calc(100% - var(--grid-offset, 1.5rem))"
    const xTopStart = fullWidth ? "0%" : xLeft
    const xTopEnd = fullWidth ? "100%" : xRight

    return (
        <div className={`absolute inset-0 pointer-events-none z-0 ${className}`} style={{ "--grid-offset": "1.5rem" } as any}>
            {/* CSS to handle media query for grid offset */}
            <style jsx>{`
                @media (min-width: 768px) {
                    div { --grid-offset: 3rem !important; }
                }
            `}</style>

            {/* STATIC DASHED LINES (The Architecture) */}
            {showLeft && (
                <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[1px] border-l border-dashed border-[#D1CDC2] opacity-60" />
            )}
            {showRight && (
                <div className="absolute right-6 md:right-12 top-0 bottom-0 w-[1px] border-r border-dashed border-[#D1CDC2] opacity-60" />
            )}
            {showTop && (
                <div className={`absolute top-0 ${fullWidth ? "left-0 right-0" : "left-6 md:left-12 right-6 md:right-12"} h-[1px] border-t border-dashed border-[#D1CDC2] opacity-60`} />
            )}
            {showBottom && (
                <div className={`absolute bottom-0 ${fullWidth ? "left-0 right-0" : "left-6 md:left-12 right-6 md:right-12"} h-[1px] border-b border-dashed border-[#D1CDC2] opacity-60`} />
            )}

            {/* CONTINUOUS TRAVELLING PARTICLES */}

            {/* Particle 1: Left -> Top Turn (or just Left) */}
            {showLeft && (
                <motion.div
                    className="absolute"
                    style={{ ...particleStyle, left: `calc(${xLeft} - 1.5px)` }}
                    animate={{
                        top: showTop ? ["110%", "0%", "0%"] : ["115%", "-15%"],
                        left: showTop ? [xLeft, xLeft, `calc(${xTopEnd} - 100px)`] : xLeft,
                        rotate: showTop ? [0, 0, 90] : 0,
                        opacity: [0, 1, 1, 0]
                    }}
                    transition={{
                        duration: showTop ? 12 : 8,
                        ease: "linear",
                        repeat: Infinity,
                        repeatDelay: 10 + randomOffset,
                        delay: 2 + randomOffset * 0.2,
                        times: [0, 0.15, 0.85, 1]
                    }}
                />
            )}

            {/* Particle 2: Right Vertical (with Fusion Bleed) */}
            {showRight && (
                <motion.div
                    className="absolute"
                    style={{ ...particleStyle, left: `calc(${xRight} - 1.5px)` }}
                    animate={{
                        top: ["-15%", "115%"],
                        opacity: [0, 1, 1, 0]
                    }}
                    transition={{
                        duration: 9,
                        ease: "linear",
                        repeat: Infinity,
                        repeatDelay: 15 + randomOffset,
                        delay: 5 + randomOffset * 0.5,
                        times: [0, 0.2, 0.8, 1]
                    }}
                />
            )}

            {/* Particle 3: Top Horizontal (Turn from Right to Top) */}
            {showTop && !showLeft && (
                <motion.div
                    className="absolute"
                    style={{ ...particleStyle, top: "-100px", rotate: 90 }}
                    animate={{
                        left: [xTopStart, xTopEnd],
                        opacity: [0, 1, 1, 0]
                    }}
                    transition={{
                        duration: 10,
                        ease: "linear",
                        repeat: Infinity,
                        repeatDelay: 20 + randomOffset,
                        delay: 8 + randomOffset * 0.3,
                        times: [0, 0.2, 0.8, 1]
                    }}
                />
            )}

            {/* Particle 4: Bottom Turn (Right -> Bottom -> Left) */}
            {showBottom && showRight && (
                <motion.div
                    className="absolute"
                    style={{ ...particleStyle, left: `calc(${xRight} - 1.5px)` }}
                    animate={{
                        top: ["-10%", "100%", "100%"],
                        left: [xRight, xRight, `calc(${xTopStart} + 100px)`],
                        rotate: [0, 0, 90],
                        opacity: [0, 1, 1, 0]
                    }}
                    transition={{
                        duration: 14,
                        ease: "linear",
                        repeat: Infinity,
                        repeatDelay: 18 + randomOffset,
                        delay: 12 + randomOffset * 0.6,
                        times: [0, 0.1, 0.9, 1]
                    }}
                />
            )}
        </div>
    )
}
