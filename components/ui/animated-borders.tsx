"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from "framer-motion"

interface AnimatedBordersProps {
    className?: string
    showLeft?: boolean
    showRight?: boolean
    showTop?: boolean
    showBottom?: boolean
}

export function AnimatedBorders({
    className = "",
    showLeft = true,
    showRight = true,
    showTop = false,
    showBottom = false
}: AnimatedBordersProps) {
    // Random offset to prevent all sections from animating in sync
    const [randomOffset] = useState(() => Math.random() * 10)

    // TRUE VIBRANT GRADIENT
    const vibrantGradientVertical = "linear-gradient(to bottom, transparent, #FF00FF, #FF8800, #FFD700, #0088FF, transparent)"
    const vibrantGradientHorizontal = "linear-gradient(to right, transparent, #FF00FF, #FF8800, #FFD700, #0088FF, transparent)"

    // Colored Glow
    const vibrantShadow = "drop-shadow(0 0 4px rgba(255, 0, 255, 0.4)) drop-shadow(0 0 10px rgba(255, 200, 0, 0.4)) drop-shadow(0 0 15px rgba(0, 136, 255, 0.4))"

    // Styles
    const styleVertical = {
        background: vibrantGradientVertical,
        filter: `${vibrantShadow} blur(3px)`
    }

    const styleHorizontal = {
        background: vibrantGradientHorizontal,
        filter: `${vibrantShadow} blur(3px)`
    }

    return (
        <div className={`absolute inset-0 pointer-events-none z-0 ${className}`}>

            {/* Left Vertical Line */}
            {showLeft && (
                <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[1px] border-l border-dashed border-[#D1CDC2] opacity-100 overflow-visible">
                    <motion.div
                        className="absolute left-[-1.5px] w-[4px] h-[160px] rounded-full opacity-0"
                        style={styleVertical}
                        initial={{ top: "-160px", opacity: 0 }}
                        animate={{
                            top: ["0%", "100%"],
                            opacity: [0, 0.7, 0.7, 0]
                        }}
                        transition={{
                            duration: 7,
                            ease: "linear",
                            repeat: Infinity,
                            repeatDelay: 12 + randomOffset,
                            delay: 0 + randomOffset * 0.2,
                            times: [0, 0.1, 0.9, 1]
                        }}
                    />
                </div>
            )}

            {/* Top Horizontal Line */}
            {showTop && (
                <div className="absolute top-0 left-6 md:left-12 right-6 md:right-12 h-[1px] border-t border-dashed border-[#D1CDC2] opacity-100 overflow-visible">
                    <motion.div
                        className="absolute top-[-1.5px] h-[4px] w-[200px] rounded-full opacity-0"
                        style={styleHorizontal}
                        initial={{ left: "-200px", opacity: 0 }}
                        animate={{
                            left: ["0%", "100%"],
                            opacity: [0, 0.7, 0.7, 0]
                        }}
                        transition={{
                            duration: 9,
                            ease: "linear",
                            repeat: Infinity,
                            repeatDelay: 20 + randomOffset,
                            delay: 5 + randomOffset * 0.5,
                            times: [0, 0.1, 0.9, 1]
                        }}
                    />
                </div>
            )}

            {/* Right Vertical Line */}
            {showRight && (
                <div className="absolute right-6 md:right-12 top-0 bottom-0 w-[1px] border-r border-dashed border-[#D1CDC2] opacity-100 overflow-visible">
                    <motion.div
                        className="absolute right-[-1.5px] w-[4px] h-[140px] rounded-full opacity-0"
                        style={styleVertical}
                        initial={{ top: "-140px", opacity: 0 }}
                        animate={{
                            top: ["0%", "100%"],
                            opacity: [0, 0.7, 0.7, 0]
                        }}
                        transition={{
                            duration: 8,
                            ease: "linear",
                            repeat: Infinity,
                            repeatDelay: 8 + randomOffset,
                            delay: 15 + randomOffset * 0.3,
                            times: [0, 0.1, 0.9, 1]
                        }}
                    />
                </div>
            )}

            {/* Bottom Horizontal Line */}
            {showBottom && (
                <div className="absolute bottom-0 left-6 md:left-12 right-6 md:right-12 h-[1px] border-b border-dashed border-[#D1CDC2] opacity-100 overflow-visible">
                    <motion.div
                        className="absolute bottom-[-1.5px] h-[4px] w-[180px] rounded-full opacity-0"
                        style={styleHorizontal}
                        initial={{ left: "-180px", opacity: 0 }}
                        animate={{
                            left: ["0%", "100%"],
                            opacity: [0, 0.7, 0.7, 0]
                        }}
                        transition={{
                            duration: 10,
                            ease: "linear",
                            repeat: Infinity,
                            repeatDelay: 25 + randomOffset,
                            delay: 2 + randomOffset * 0.8,
                            times: [0, 0.1, 0.9, 1]
                        }}
                    />
                </div>
            )}
        </div>
    )
}
