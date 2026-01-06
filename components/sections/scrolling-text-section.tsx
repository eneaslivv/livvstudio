"use client"

import { useRef, useEffect, useState } from "react"
import { AnimatedBorders } from "@/components/ui/animated-borders"

export function ScrollingTextSection() {
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

    return (
        <section ref={sectionRef} className="relative w-full py-20 md:py-24 overflow-hidden">
            <div className={`transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>

                {/* Main Content Container with Borders - using max-w-7xl for consistent alignment */}
                <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

                    {/* Animated Borders Component - aligned with padding */}
                    <AnimatedBorders className="hidden md:block" />

                    <div className="relative py-20 overflow-hidden">

                        {/* Marquee Container */}
                        <div className="flex whitespace-nowrap select-none">
                            {/* Track 1 */}
                            <div className="animate-marquee flex items-center">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex items-center px-4 md:px-8">
                                        <span className="text-[120px] md:text-[200px] lg:text-[280px] font-normal leading-none tracking-tighter text-[#5A3E3E]">
                                            services
                                        </span>
                                        <span className="text-[80px] md:text-[140px] lg:text-[200px] text-[#C4A35A] mx-4 md:mx-8 mb-8 md:mb-16">
                                            ©
                                        </span>
                                        <span className="text-[120px] md:text-[200px] lg:text-[280px] font-normal leading-none tracking-tighter text-[#C4A35A]">
                                            livv
                                        </span>
                                        {/* Spacer/Separator */}
                                        <div className="w-12 md:w-24" />
                                    </div>
                                ))}
                            </div>

                            {/* Track 2 (Duplicate for seamless loop) */}
                            <div className="animate-marquee flex items-center" aria-hidden="true">
                                {[...Array(4)].map((_, i) => (
                                    <div key={`dup-${i}`} className="flex items-center px-4 md:px-8">
                                        <span className="text-[120px] md:text-[200px] lg:text-[280px] font-normal leading-none tracking-tighter text-[#5A3E3E]">
                                            services
                                        </span>
                                        <span className="text-[80px] md:text-[140px] lg:text-[200px] text-[#C4A35A] mx-4 md:mx-8 mb-8 md:mb-16">
                                            ©
                                        </span>
                                        <span className="text-[120px] md:text-[200px] lg:text-[280px] font-normal leading-none tracking-tighter text-[#C4A35A]">
                                            livv
                                        </span>
                                        {/* Spacer/Separator */}
                                        <div className="w-12 md:w-24" />
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <style jsx>{`
                .animate-marquee {
                  animation: marquee 40s linear infinite;
                }
                @keyframes marquee {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-100%); }
                }
            `}</style>
        </section>
    )
}
