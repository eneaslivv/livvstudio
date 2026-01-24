"use client"

import { motion } from "framer-motion"

export function ProcessIllustration() {
    return (
        <div className="relative w-full aspect-square md:aspect-[4/5] bg-[#FF4500] rounded-[20px] overflow-hidden isolate shadow-2xl">
            {/* Base Gradient Overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-600/40 mix-blend-overlay z-10" />

            {/* Central Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-white/20 blur-[80px] rounded-full" />

            {/* Radial Pills Container */}
            <div className="absolute inset-0 flex items-center justify-center">
                {/* Generating multiple pills in a radial pattern */}
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-24 h-64 bg-white/90 rounded-full blur-[20px] origin-bottom"
                        style={{
                            rotate: i * 45, // 360 / 8 = 45 degrees apart
                            transformOrigin: "center center",
                        }}
                        initial={{
                            scaleY: 0.5,
                            opacity: 0.5,
                        }}
                        animate={{
                            scaleY: [0.8, 1.2, 0.8],
                            opacity: [0.6, 0.9, 0.6],
                            filter: ["blur(20px)", "blur(15px)", "blur(20px)"]
                        }}
                        transition={{
                            duration: 4 + i * 0.5, // Staggered durations
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.2, // Staggered start
                        }}
                    >
                        {/* Core of the pill (less blurred) for definition */}
                        <div className="absolute inset-4 bg-white rounded-full blur-[10px]" />
                    </motion.div>
                ))}
            </div>

            {/* Floating particles for extra life */}
            <div className="absolute inset-0 z-20 mix-blend-overlay opacity-50">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={`p-${i}`}
                        className="absolute w-32 h-32 bg-white/30 rounded-full blur-[40px]"
                        initial={{
                            x: Math.random() * 100 - 50,
                            y: Math.random() * 100 - 50,
                        }}
                        animate={{
                            x: [Math.random() * 200 - 100, Math.random() * 200 - 100, Math.random() * 200 - 100],
                            y: [Math.random() * 200 - 100, Math.random() * 200 - 100, Math.random() * 200 - 100],
                            scale: [1, 1.2, 0.9, 1],
                        }}
                        transition={{
                            duration: 10 + i * 2,
                            repeat: Infinity,
                            ease: "linear",
                            repeatType: "mirror"
                        }}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </div>

            {/* Text Overlay (optional, based on image but user didn't explicitly ask for text inside) */}
            {/* Keeping it abstract for now as per "illustration" request */}
        </div>
    )
}
