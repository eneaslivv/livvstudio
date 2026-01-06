"use client"

import { motion, Variants } from "framer-motion"
import { cn } from "@/lib/utils"

interface BlurRevealProps {
    text: string
    className?: string
    delay?: number
    duration?: number
    blurStrength?: number
    yOffset?: number
}

export function BlurReveal({
    text,
    className,
    delay = 0,
    duration = 0.8,
    blurStrength = 10,
    yOffset = 20
}: BlurRevealProps) {
    const words = text.split(" ")

    const container: Variants = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: delay * i },
        }),
    }

    const child: Variants = {
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
                duration: duration
            },
        },
        hidden: {
            opacity: 0,
            y: yOffset,
            filter: `blur(${blurStrength}px)`,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
                duration: duration
            },
        },
    }

    return (
        <motion.h1
            className={cn("flex flex-wrap overflow-hidden", className)}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
        >
            {words.map((word, index) => (
                <motion.span
                    variants={child}
                    style={{ marginRight: "0.25em" }}
                    key={index}
                    className="inline-block"
                >
                    {word}
                </motion.span>
            ))}
        </motion.h1>
    )
}
