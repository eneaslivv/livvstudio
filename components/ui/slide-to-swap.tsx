"use client"

import React, { useState, useEffect } from "react"
import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion"
import { ChevronRight, ArrowRight, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface SlideToSwapProps {
    onComplete?: () => void
    className?: string
}

export function SlideToSwap({ onComplete, className }: SlideToSwapProps) {
    const [sliderWidth, setSliderWidth] = useState(0)
    const [isCompleted, setIsCompleted] = useState(false)
    const controls = useAnimation()
    const x = useMotionValue(0)

    // Constraints
    const padding = 6 // p-1.5 is 6px
    const handleSize = 64 // h-16 w-16 is 64px
    const maxDrag = sliderWidth - handleSize - (padding * 2)

    // Transformations based on drag x
    const opacity = useTransform(x, [0, maxDrag * 0.8], [1, 0])
    const successOpacity = useTransform(x, [maxDrag * 0.9, maxDrag], [0, 1])

    // Check completion on drag end
    const handleDragEnd = async () => {
        const currentX = x.get()
        if (currentX > maxDrag * 0.9) {
            // Success
            setIsCompleted(true)
            await controls.start({ x: maxDrag })
            if (onComplete) {
                // Short delay to show success state before triggering action
                setTimeout(() => {
                    onComplete()
                }, 1000)
            }
        } else {
            // Reset
            controls.start({ x: 0 })
        }
    }

    return (
        <div
            className={cn(
                "relative flex h-20 w-full max-w-sm items-center justify-between overflow-hidden rounded-full bg-[#0a0a0a] p-1.5 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(255,255,255,0.02)] ring-1 ring-white/5 select-none",
                className
            )}
            ref={(el) => {
                if (el) setSliderWidth(el.offsetWidth)
            }}
        >
            {/* Styles for custom animations */}
            <style jsx global>{`
                .chrome-gradient {
                    background: radial-gradient(circle at 30% 30%, rgba(255,255,255,1) 0%, rgba(230,230,230,1) 20%, rgba(190,190,190,1) 50%, rgba(140,140,140,1) 100%);
                }
                @keyframes shimmer {
                    0% { background-position: -100% 0; }
                    100% { background-position: 200% 0; }
                }
                .animate-shimmer {
                    background: linear-gradient(to right, rgba(255,255,255,0.4) 0%, #fff 50%, rgba(255,255,255,0.4) 100%);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                    animation: shimmer 3s linear infinite;
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 4s linear infinite;
                }
            `}</style>

            {/* Track Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-20 pointer-events-none"></div>
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

            {/* Success Background */}
            <motion.div
                style={{ opacity: successOpacity }}
                className="absolute inset-0 bg-blue-500/10 pointer-events-none"
            />

            {/* Text Label */}
            <motion.div
                style={{ opacity }}
                className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none pl-8"
            >
                <span className="animate-shimmer text-lg font-medium tracking-tight drop-shadow-md">
                    Slide to pricing
                </span>
            </motion.div>

            {/* Chevron Arrows */}
            <motion.div
                style={{ opacity }}
                className="absolute right-6 z-10 flex items-center space-x-[-0.3rem] pointer-events-none"
            >
                <ChevronRight className="w-6 h-6 text-neutral-500 opacity-50" />
                <ChevronRight className="w-6 h-6 text-neutral-400 opacity-75" />
                <ChevronRight className="w-6 h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
            </motion.div>

            {/* Draggable Handle */}
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: maxDrag }}
                dragElastic={0.1}
                dragMomentum={false}
                onDragEnd={handleDragEnd}
                animate={controls}
                style={{ x }}
                whileTap={{ cursor: "grabbing" }}
                className="group relative z-20 flex h-16 w-16 cursor-grab items-center justify-center overflow-hidden rounded-full p-[2px] shadow-[0_0_20px_rgba(255,255,255,0.1),0_4px_6px_rgba(0,0,0,0.5)] touch-none active:cursor-grabbing"
            >
                {/* Animated Gradient Border */}
                <div className="absolute inset-[-100%] animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0_100deg,#ef4444_140deg,#eab308_180deg,#3b82f6_220deg,transparent_280deg_360deg)] opacity-80 blur-[0.5px]"></div>

                {/* Handle Surface */}
                <div className="relative z-10 h-full w-full rounded-full chrome-gradient shadow-[inset_0_-4px_8px_rgba(0,0,0,0.25),inset_0_2px_6px_rgba(255,255,255,0.8)] flex items-center justify-center">

                    {/* Shine */}
                    <div className="absolute left-2 top-2 h-6 w-8 rotate-[-45deg] rounded-[100%] bg-gradient-to-b from-white to-transparent opacity-60 blur-[1px]"></div>

                    {/* Inner Ring */}
                    <div className="absolute inset-[2px] rounded-full border border-black/10 bg-transparent"></div>

                    {/* Icons */}
                    <div className="relative z-10 flex h-full w-full items-center justify-center">
                        <ArrowRight
                            className={cn(
                                "absolute text-2xl text-neutral-800 transition-all duration-300 stroke-[2] w-6 h-6",
                                isCompleted ? "scale-0 opacity-0" : "scale-100 opacity-100"
                            )}
                        />
                        <CheckCircle
                            className={cn(
                                "absolute text-2xl text-blue-600 transition-all duration-300 w-6 h-6",
                                isCompleted ? "scale-110 opacity-100" : "scale-0 opacity-0"
                            )}
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
