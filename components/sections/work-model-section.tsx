"use client"

import { useRef, useEffect, useState } from "react"
import { mondwest, playground } from "@/app/fonts"
import { AnimatedBorders } from "@/components/ui/animated-borders"
import { RevealText } from "@/components/ui/reveal-text"

export function WorkModelSection() {
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
        <section ref={sectionRef} className="relative w-full overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 py-24 md:py-32">
                {/* Lateral Borders for this section */}
                <AnimatedBorders className="hidden md:block" />

                {/* Section Header */}
                <div className="w-full border-t border-dashed border-[#D1CDC2] pt-6 flex justify-between items-center text-[10px] uppercase tracking-widest text-[#5A3E3E]/60 mb-12 md:mb-20 px-6 md:px-12 relative z-10">
                    <span>© Work Model ワークモデル</span>
                    <span>(WDX® — 02)</span>
                </div>

                {/* Content Header */}
                <div className={`flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 px-6 md:px-12 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                    <h2 className="section-heading mb-8 md:mb-0">
                        <RevealText text="Work Model" className="text-gradient-gold" isVisible={isVisible} />
                    </h2>
                    <p className="max-w-md text-[#5A3E3E]/80 leading-relaxed text-sm md:text-sm md:text-right font-medium">
                        Our approach is designed for maximum efficiency without sacrificing quality. We adapt to your needs while maintaining our core principles.
                    </p>
                </div>

                {/* Timeline / Grid */}
                <div className="relative">


                    {/* Connecting Line (Desktop) - Aligned to center of icons (h-20 = 5rem => center at 2.5rem + top offset) -> actually let's center it better relative to the new smaller icons */}
                    <div className={`hidden md:block absolute top-[3rem] left-0 right-0 h-[1px] bg-[#D6D1C5] z-[1] transition-all duration-1500 ease-out ${isVisible ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"} origin-left`} />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">

                        {/* Item 1: Rapid Implementation */}
                        <div className={`relative z-10 flex flex-col items-center text-center transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
                            {/* Icon Container */}
                            <div className="relative mb-8 group cursor-pointer">
                                {/* Corner Dots - Creating the 'bracket' effect */}
                                <div className="absolute -top-2 -left-2 w-1 h-1 bg-[#2A1818] rounded-full" />
                                <div className="absolute -top-2 -right-2 w-1 h-1 bg-[#2A1818] rounded-full" />
                                <div className="absolute -bottom-2 -left-2 w-1 h-1 bg-[#2A1818] rounded-full" />
                                <div className="absolute -bottom-2 -right-2 w-1 h-1 bg-[#2A1818] rounded-full" />

                                {/* Icon Box */}
                                <div className="w-24 h-24 bg-[#FFFFFF] rounded-[1.5rem] border border-[#D6D1C5] flex items-center justify-center p-1.5 shadow-sm group-hover:scale-95 transition-transform duration-500 overflow-hidden relative z-10">
                                    {/* Blurred Image Effect */}
                                    <div className="w-full h-full rounded-[1.2rem] overflow-hidden relative">
                                        <img src="/images/gemini-generated-image-ndf416ndf416ndf4.png" alt="Rapid" className="w-full h-full object-cover opacity-90 blur-[1px] scale-110" />
                                        <div className="absolute inset-0 bg-white/10" />
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-[#2A1818] mb-4 tracking-tight">Velocity with Rigor</h3>
                            <p className="text-[#5A3E3E]/70 text-sm leading-relaxed max-w-[280px]">
                                We mix design sprints with rapid prototyping to validate ideas visually before writing a single line of heavy code. Fast MVPs, clean scale-up.
                            </p>
                        </div>

                        {/* Item 2: Transparent Process */}
                        <div className={`relative z-10 flex flex-col items-center text-center transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
                            {/* Icon Container */}
                            <div className="relative mb-8 group cursor-pointer">
                                {/* Corner Dots */}
                                <div className="absolute -top-2 -left-2 w-1 h-1 bg-[#2A1818] rounded-full" />
                                <div className="absolute -top-2 -right-2 w-1 h-1 bg-[#2A1818] rounded-full" />
                                <div className="absolute -bottom-2 -left-2 w-1 h-1 bg-[#2A1818] rounded-full" />
                                <div className="absolute -bottom-2 -right-2 w-1 h-1 bg-[#2A1818] rounded-full" />

                                {/* Icon Box */}
                                <div className="w-24 h-24 bg-[#FFFFFF] rounded-[1.5rem] border border-[#D6D1C5] flex items-center justify-center p-1.5 shadow-sm group-hover:scale-95 transition-transform duration-500 overflow-hidden relative z-10">
                                    {/* Blurred Image Effect */}
                                    <div className="w-full h-full rounded-[1.2rem] overflow-hidden relative">
                                        <img src="/images/work-model-2.jpg" alt="Visibility" className="w-full h-full object-cover opacity-90 blur-[1px] scale-110" />
                                        <div className="absolute inset-0 bg-white/10" />
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-[#2A1818] mb-4 tracking-tight">Full Visibility (Zero Black Boxes)</h3>
                            <p className="text-[#5A3E3E]/70 text-sm leading-relaxed max-w-[280px]">
                                Your team gets direct access to our project boards and staging environments. We act as an extension of your CTO, providing real-time validation.
                            </p>
                        </div>

                        {/* Item 3: Security & Scalability */}
                        <div className={`relative z-10 flex flex-col items-center text-center transition-all duration-1000 delay-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
                            {/* Icon Container */}
                            <div className="relative mb-8 group cursor-pointer">
                                {/* Corner Dots */}
                                <div className="absolute -top-2 -left-2 w-1 h-1 bg-[#2A1818] rounded-full" />
                                <div className="absolute -top-2 -right-2 w-1 h-1 bg-[#2A1818] rounded-full" />
                                <div className="absolute -bottom-2 -left-2 w-1 h-1 bg-[#2A1818] rounded-full" />
                                <div className="absolute -bottom-2 -right-2 w-1 h-1 bg-[#2A1818] rounded-full" />

                                {/* Icon Box */}
                                <div className="w-24 h-24 bg-[#FFFFFF] rounded-[1.5rem] border border-[#D6D1C5] flex items-center justify-center p-1.5 shadow-sm group-hover:scale-95 transition-transform duration-500 overflow-hidden relative z-10">
                                    {/* Blurred Image Effect */}
                                    <div className="w-full h-full rounded-[1.2rem] overflow-hidden relative">
                                        <img src="/images/work-model-3.jpg" alt="Compliance" className="w-full h-full object-cover opacity-90 blur-[1px] scale-110" />
                                        <div className="absolute inset-0 bg-white/10" />
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-[#2A1818] mb-4 tracking-tight">Sovereignty & Compliance</h3>
                            <p className="text-[#5A3E3E]/70 text-sm leading-relaxed max-w-[280px]">
                                We build with security-first principles (ZKP ready). We deliver the source code and full IP rights, allowing your clients to host their own data securely.
                            </p>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    )
}
