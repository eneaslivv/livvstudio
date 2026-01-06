"use client"

import { useRef, useEffect, useState } from "react"
import { ArrowRight, Check, Circle } from "lucide-react"
import { AnimatedBorders } from "@/components/ui/animated-borders"
import { HarmoniousLayout } from "@/components/ui/harmonious-layout"

export function HiddenPartnerSection() {
    const sectionRef = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.2 }
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => observer.disconnect()
    }, [])

    const tasks = [
        { title: "Lead list", status: "70% prepared", checked: false },
        { title: "Payment reminder", status: "Sent to selected clients", checked: true },
        { title: "Payroll management", status: "Due on 2nd July", checked: false },
        { title: "Employee Tracking", status: "2 days ago", checked: false },
        { title: "Social media post", status: "Canceled by user", checked: false },
    ]

    return (
        <section ref={sectionRef} className="relative w-full overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32 relative z-10">
                <AnimatedBorders className="hidden md:block" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">


                    {/* Left Column: UI Card Visual */}
                    <div className={`relative w-full flex items-center justify-center transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}>

                        {/* The Card - Harmonious Layout */}
                        <div className="relative z-10 w-full transform transition-transform duration-500 hover:scale-[1.02]">
                            <HarmoniousLayout />
                        </div>
                    </div>

                    {/* Right Column: Text Content */}
                    <div className="pl-[5%] px-6 md:px-12">
                        <div className={`transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#5A3E3E] tracking-tight leading-[1.1] mb-8">
                                Your Hidden Partner for <span className="text-[#C4A35A]">Agencies & Startups</span>
                            </h2>

                            <p className="text-[#5A3E3E]/80 text-lg font-light leading-relaxed mb-10 max-w-lg">
                                We help you deliver more, faster. Apps, dashboards, websites, built quietly behind the scenes, so you can close deals, scale projects, and look great to your clients.
                            </p>

                            <button className="group flex items-center space-x-3 bg-[#F5F5F0] pr-6 py-2 rounded-full border border-[#E8E4DC] hover:scale-105 transition-transform duration-300">
                                <div className="w-10 h-10 rounded-full bg-[#2A1818] flex items-center justify-center text-[#C4A35A] group-hover:rotate-[-45deg] transition-transform duration-300">
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium text-[#2A1818] uppercase tracking-wide">
                                    Get in touch
                                </span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
