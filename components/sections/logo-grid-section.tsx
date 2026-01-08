"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
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
        { name: "DDA", initial: "D", font: "font-black", bg: "/assets/logo-bg-1.jpg" },
        { name: "9nine", initial: "9", font: "font-serif italic", bg: "/assets/logo-bg-2.jpg" },
        { name: "(DFY)®", initial: "DFY", font: "font-mono", bg: "/assets/logo-bg-3.jpg" },
        { name: "HumBn", initial: "H", font: "font-sans font-bold", bg: "/assets/logo-bg-1.jpg" },
        { name: "neue", initial: "n", font: "font-light tracking-tighter", bg: "/assets/logo-bg-2.jpg" },
        { name: "Ohms", initial: "O", font: "font-serif", bg: "/assets/logo-bg-3.jpg" },
        { name: "Diamond", initial: "◆", font: "text-2xl", bg: "/assets/logo-bg-1.jpg" },
        { name: "H", initial: "H", font: "bg-black text-white px-2", bg: "/assets/logo-bg-2.jpg" },
    ]

    return (
        <section ref={sectionRef} className="relative w-full">
            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 py-24 md:py-32">
                <AnimatedBorders className="hidden md:block" />

                {/* Horizontal Top Line */}
                <div className={`relative w-full h-[1px] transition-all duration-1000 ease-out ${isVisible ? "opacity-100" : "opacity-0"}`}>
                    <AnimatedBorders showLeft={false} showRight={false} showTop={true} fullWidth={true} />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4">
                    {logos.map((logo, index) => (
                        <div
                            key={index}
                            className="group relative h-32 md:h-40 flex items-center justify-center border-r border-b border-[#E8E4DC] overflow-hidden cursor-pointer bg-white"
                        >
                            <style jsx>{`
                                @media (max-width: 767px) {
                                    div:nth-child(2n) { border-right: none; }
                                }
                                @media (min-width: 768px) {
                                    div:nth-child(4n) { border-right: none; }
                                }
                            `}</style>

                            {/* Hover Background Image */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out z-0">
                                <Image
                                    src={logo.bg}
                                    alt="Background"
                                    fill
                                    className="object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/40" />
                            </div>

                            {/* Logo Content */}
                            <div
                                className={`relative z-10 text-3xl md:text-4xl text-[#1a1a1a] group-hover:text-white transition-colors duration-500 ease-in-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                                style={{ transitionDelay: `${500 + index * 100}ms` }}
                            >
                                {/* Logo Variations */}
                                {logo.name === "DDA" && (
                                    <span className="font-extrabold tracking-tight">DDA</span>
                                )}
                                {logo.name === "9nine" && (
                                    <span className="font-serif italic text-4xl">9nine</span>
                                )}
                                {logo.name === "(DFY)®" && (
                                    <span className="font-medium tracking-wide">(DFY)<sup className="text-xs">®</sup></span>
                                )}
                                {logo.name === "HumBn" && (
                                    <span className="font-sans font-bold">Hum<span className="italic font-serif">a</span>n</span>
                                )}
                                {logo.name === "neue" && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-[repeating-linear-gradient(45deg,currentColor_0,currentColor_1px,transparent_1px,transparent_3px)] opacity-50 transition-colors" />
                                        <span className="font-light tracking-tight">neue</span>
                                    </div>
                                )}
                                {logo.name === "Ohms" && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-current rounded-full border-t-transparent -rotate-45 transition-colors" />
                                        <span className="font-bold">Ohms</span>
                                    </div>
                                )}
                                {logo.name === "Diamond" && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-current transform rotate-45 transition-colors" />
                                        <span className="font-bold">Diamond</span>
                                    </div>
                                )}
                                {logo.name === "H" && (
                                    <div className="w-10 h-10 bg-black text-white group-hover:bg-white group-hover:text-black flex items-center justify-center font-bold text-xl transition-all">H</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
