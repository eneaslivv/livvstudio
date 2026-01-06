"use client"

import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

interface GzipTextProps {
    text: string
    className?: string
    delay?: number
}

export function GzipText({ text, className = "", delay = 0 }: GzipTextProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        if (!containerRef.current) return

        const chars = containerRef.current.querySelectorAll(".char")

        gsap.fromTo(chars,
            {
                opacity: 0,
                filter: "blur(12px)",
                scaleX: 0.5,
            },
            {
                opacity: 1,
                filter: "blur(0px)",
                scaleX: 1,
                duration: 1.2,
                stagger: 0.03,
                ease: "power4.out",
                delay: delay
            }
        )
    }, { scope: containerRef, dependencies: [text, delay] })

    // Split text into words and chars for accessibility and animation
    return (
        <span ref={containerRef} className={`inline-block whitespace-pre-wrap ${className}`} aria-label={text}>
            {text.split("").map((char, index) => (
                <span
                    key={index}
                    className="char inline-block"
                    style={{ willChange: "transform, opacity, filter" }}
                >
                    {char === " " ? "\u00A0" : char}
                </span>
            ))}
        </span>
    )
}
