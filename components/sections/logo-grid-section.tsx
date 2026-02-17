"use client"

import { useRef, useEffect, useState } from "react"
import { AnimatedBorders } from "@/components/ui/animated-borders"

export function LogoGridSection() {
    const sectionRef = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.1 }
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => observer.disconnect()
    }, [])

    const logos = [
        { label: "ViewFi", style: "font-semibold tracking-[0.2em] uppercase" },
        { label: "RE/MAX", style: "font-extrabold tracking-tight uppercase" },
        { label: "Sacoa", style: "font-serif italic tracking-[0.1em]" },
        { label: "WORTISE", style: "font-black text-[18px] tracking-[0.25em] uppercase" },
        { label: "BLACKBOX AI", style: "font-semibold uppercase text-[14px]" },
    ]

    return (
        <section ref={sectionRef} className="relative w-full">
            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 py-24 md:py-32">
                <AnimatedBorders className="hidden md:block z-20" />

                {/* Horizontal Top Line */}
                <div className={`relative w-full h-[1px] transition-all duration-1000 ease-out ${isVisible ? "opacity-100" : "opacity-0"}`}>
                    <AnimatedBorders showLeft={false} showRight={false} showTop={true} fullWidth={true} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
                    {logos.map((logo, index) => (
                        <div
                            key={index}
                            className="group relative h-32 md:h-40 flex items-center justify-center border border-[#E8E4DC] overflow-hidden cursor-pointer bg-white"
                        >
                            <style jsx>{`
                                @media (max-width: 767px) {
                                    div:nth-child(2n) { border-right: none; }
                                }
                                @media (min-width: 768px) {
                                    div:nth-child(5n) { border-right: none; }
                                }
                            `}</style>

                            <div
                                className={`relative z-10 text-2xl md:text-3xl text-[#1a1a1a] group-hover:text-[#2C0405] transition-colors duration-500 ease-in-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                                style={{ transitionDelay: `${500 + index * 100}ms` }}
                            >
                                <span className={logo.style}>{logo.label}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
