"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Cloud } from "lucide-react"

export function HarmoniousLayout() {
    return (
        <div className="relative w-full aspect-square flex items-center justify-center select-none overflow-visible">
            {/* Soft Glow Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[#C18972]/10 blur-[100px] rounded-full z-0" />

            {/* Cosmic Rock Centerpiece */}
            <motion.div
                className="relative z-10 w-full h-full flex items-center justify-center p-4 md:p-8"
                animate={{
                    y: [0, -15, 0],
                }}
                transition={{
                    duration: 6,
                    ease: "easeInOut",
                    repeat: Infinity,
                }}
            >
                <img
                    src="/images/cosmic-rock.png"
                    alt="Cosmic Energy centerpiece"
                    className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(44,4,5,0.15)] filter brightness-[1.05]"
                />
            </motion.div>

            {/* Subtle Gradient Atmosphere */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#FFFFFA] opacity-40 pointer-events-none" />
        </div>
    )
}
