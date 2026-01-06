"use client"

import { useEffect, useRef, useState } from "react"

interface RevealTextProps {
    text: string
    className?: string
    delay?: number
    isVisible?: boolean // Optional external control
}

export function RevealText({ text, className = "", delay = 0, isVisible: externalIsVisible }: RevealTextProps) {
    const ref = useRef<HTMLSpanElement>(null)
    const [internalIsVisible, setInternalIsVisible] = useState(false)

    // Use external visibility if provided, otherwise use internal observer
    const isVisible = externalIsVisible !== undefined ? externalIsVisible : internalIsVisible

    useEffect(() => {
        if (externalIsVisible !== undefined) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInternalIsVisible(true)
                    observer.disconnect() // Trigger once
                }
            },
            { threshold: 0.1 }
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => observer.disconnect()
    }, [externalIsVisible])

    return (
        <span className="block overflow-hidden pb-1" ref={ref}>
            <span
                className={`block transition-all duration-1000 ease-[cubic-bezier(0.2,0.65,0.3,0.9)] ${isVisible ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-full blur-lg"
                    } ${className}`}
                style={{ transitionDelay: `${delay}ms` }}
            >
                {text}
            </span>
        </span>
    )
}
