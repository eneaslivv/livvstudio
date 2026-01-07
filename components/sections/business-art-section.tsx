"use client"

import { useRef, useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import { AnimatedBorders } from "@/components/ui/animated-borders"

const CountUp = ({ end, duration }: { end: number, duration: number }) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
        let startTime: number
        let animationFrame: number

        const updateCount = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = timestamp - startTime
            const percentage = Math.min(progress / (duration * 1000), 1)

            setCount(Math.floor(end * percentage))

            if (progress < duration * 1000) {
                animationFrame = requestAnimationFrame(updateCount)
            }
        }

        animationFrame = requestAnimationFrame(updateCount)

        return () => cancelAnimationFrame(animationFrame)
    }, [end, duration])

    return <>{count}</>
}

export function BusinessArtSection() {
    const sectionRef = useRef<HTMLDivElement>(null)
    const cardRef = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

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

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        })
    }

    return (
        <section
            ref={sectionRef}
            className="relative w-full"
        >
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32 relative z-10">
                <AnimatedBorders className="hidden md:block" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* Left Column: Text & Button */}
                    <div className="pl-[5%] lg:pl-[10%]">
                        <div
                            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                }`}
                        >
                            <h2 className="section-heading text-gradient-gold mb-8">
                                Where Business Meets Art
                            </h2>

                            <div className="space-y-6 text-[#5A3E3E]/80 font-normal text-base md:text-lg leading-relaxed max-w-md">
                                <p>
                                    At Livv, design and technology work together with one clear purpose: delivering results. We focus on efficiency, clarity, and execution, so every project moves fast and delivers measurable impact.
                                </p>
                                <p>
                                    From Argentina to the world, we work as your partner in building scalable digital solutions.
                                </p>
                            </div>

                            <div className="mt-10">
                                <button className="group flex items-center gap-4 bg-[#F5F2EB] hover:bg-[#EAE6DD] text-[#2A1010] py-3 px-6 rounded-full transition-all duration-300">
                                    <div className="w-8 h-8 bg-[#2A1010] rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-medium tracking-wide">Get in touch</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Chart Card */}
                    <div className="pr-[5%] lg:pr-[10%] w-full flex justify-center lg:justify-end">
                        <div
                            ref={cardRef}
                            onMouseMove={handleMouseMove}
                            className={`relative w-full max-w-[500px] aspect-square bg-[#0F0505] rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-1000 delay-300 group ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
                                }`}
                        >
                            {/* Spotlight Hover Effect */}
                            <div
                                className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
                                style={{
                                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 184, 224, 0.08), transparent 40%)`
                                }}
                            />

                            {/* Top Right Decorative Icon */}
                            <div className="absolute top-6 right-6 z-20 transition-transform duration-500 ease-out"
                                style={{ transform: `translate(${mousePosition.x / 50}px, ${mousePosition.y / 50}px)` }}
                            >
                                <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-[#F2F0EA]" />
                                </div>
                            </div>

                            {/* Background Image with Gradient Overlay */}
                            <div className="absolute inset-0 z-0 transition-transform duration-700 ease-out"
                                style={{ transform: `scale(1.1) translate(${mousePosition.x / -80}px, ${mousePosition.y / -80}px)` }}
                            >
                                <Image
                                    src="/images/custom-art.jpg"
                                    alt="Background Art"
                                    fill
                                    className="object-cover opacity-90 mix-blend-overlay"
                                />
                                {/* Refined gradient - More subtle to show image */}
                                <div className="absolute inset-0 bg-gradient-to-r from-[#0F0505] via-[#0F0505]/60 to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0505] via-transparent to-transparent" />
                            </div>

                            {/* Content Container */}
                            <div className="relative z-10 p-6 md:p-12 h-full flex flex-col justify-between transition-transform duration-500 ease-out"
                                style={{ transform: `translate(${mousePosition.x / 60}px, ${mousePosition.y / 60}px)` }}
                            >
                                {/* Top Main Stat Section */}
                                <div>
                                    <div className="flex items-baseline gap-4 mb-2">
                                        <span className="text-6xl md:text-[6rem] leading-none font-thin text-[#F2F0EA] tracking-tighter transition-all duration-300 group-hover:drop-shadow-[0_0_15px_rgba(255,184,224,0.3)]">
                                            {isVisible ? <CountUp end={150} duration={2.5} /> : 0}+
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 pl-2">
                                        <span className="text-sm font-light text-[#9A8A8A] uppercase tracking-widest opacity-80">Projects Shipped</span>
                                        <span className="text-[10px] font-medium text-[#FFB8E0] border border-[#FFB8E0]/30 px-2 py-0.5 rounded-full backdrop-blur-sm">+24% YoY</span>
                                    </div>
                                </div>

                                {/* Secondary Stats Grid */}
                                <div className="grid grid-cols-3 gap-6 md:gap-8 pl-2">
                                    <div className="group/stat">
                                        <div className="text-2xl md:text-3xl font-thin text-[#F2F0EA] mb-1 flex items-baseline group-hover/stat:text-[#FFB8E0] transition-colors group-hover/stat:translate-y-[-2px] duration-300">
                                            {isVisible ? <CountUp end={98} duration={2} /> : 0}%
                                        </div>
                                        <div className="text-[9px] md:text-[10px] font-medium text-[#9A8A8A] uppercase tracking-widest leading-tight">Client<br />Retention</div>
                                    </div>
                                    <div className="group/stat">
                                        <div className="text-2xl md:text-3xl font-thin text-[#F2F0EA] mb-1 flex items-baseline group-hover/stat:text-[#FFB8E0] transition-colors group-hover/stat:translate-y-[-2px] duration-300">
                                            {isVisible ? <CountUp end={12} duration={2} /> : 0}
                                        </div>
                                        <div className="text-[9px] md:text-[10px] font-medium text-[#9A8A8A] uppercase tracking-widest leading-tight">Industry<br />Awards</div>
                                    </div>
                                    <div className="group/stat">
                                        <div className="text-2xl md:text-3xl font-thin text-[#F2F0EA] mb-1 flex items-baseline group-hover/stat:text-[#FFB8E0] transition-colors group-hover/stat:translate-y-[-2px] duration-300">
                                            {isVisible ? <CountUp end={10} duration={2.5} /> : 0}M+
                                        </div>
                                        <div className="text-[9px] md:text-[10px] font-medium text-[#9A8A8A] uppercase tracking-widest leading-tight">Users<br />Reached</div>
                                    </div>
                                </div>

                                {/* Bar Chart Visualization - Minimalist */}
                                <div className="flex items-end justify-between gap-1 h-20 mt-4 opacity-80 pl-1 pr-4 group-hover:opacity-100 transition-opacity duration-500">
                                    {Array.from({ length: 32 }).map((_, i) => {
                                        // Smoother wave pattern
                                        const h = [
                                            20, 30, 25, 35, 30, 45, 40, 50, 60, 50, 70, 80, 70, 60,
                                            70, 85, 90, 80, 65, 50, 40, 30, 35, 45, 35, 25, 20, 15,
                                            10, 15, 20, 25
                                        ][i % 32] || 20;

                                        const isHighlight = i % 8 === 0 || i === 15 || i === 16;

                                        return (
                                            <div
                                                key={i}
                                                className={`w-[2px] md:w-[3px] rounded-full transition-all duration-700 ease-out group-hover:scale-y-110 origin-bottom ${isHighlight ? "bg-[#FFB8E0] group-hover:shadow-[0_0_8px_#FFB8E0]" : "bg-[#4A3A3A]/60"}`}
                                                style={{
                                                    height: isVisible ? `${h}%` : '5%',
                                                    transitionDelay: `${50 + i * 10}ms`
                                                }}
                                            />
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Section Footer - Moved inside container to align with grid lines */}

            </div>
        </section>
    )
}
