"use client"

import { useRef, useEffect, useState } from "react"
import { Play } from "lucide-react"
import { AnimatedBorders } from "@/components/ui/animated-borders"
import { TechStackTicker } from "@/components/ui/tech-stack-ticker"



export function ShowcaseSection() {
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
        <section
            ref={sectionRef}
            className="relative w-full"
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20 relative">
                <AnimatedBorders className="hidden md:block" />
                {/* Header Section - "Carbon AI in it" */}
                <div
                    className={`text-center mb-16 md:mb-24 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                >
                    {/* Small label */}
                    <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-[#C4A35A] font-medium mb-6">
                        Carbon AI in it
                    </span>

                    {/* Main Title with Staggered Animation */}
                    <h2 className="section-heading text-gradient-gold">
                        Precision Engineering + Soulful Design = Scalable Assets.
                    </h2>
                </div>

                {/* Video Showcase Container - Aligned to Grid */}
                <div
                    className={`relative w-full transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                        }`}
                >
                    {/* Shadow layer for depth */}
                    <div className="absolute -inset-4 bg-gradient-to-b from-transparent via-black/5 to-black/10 rounded-[2rem] blur-2xl" />

                    {/* Main Container */}
                    <div className="relative bg-[#1a1a1a] rounded-[10px] overflow-hidden shadow-2xl border border-gray-800/50">
                        {/* Browser-like top bar */}
                        <div className="absolute top-0 left-0 right-0 h-8 md:h-10 bg-[#2a2a2a] flex items-center px-4 z-10">
                            <div className="flex gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                            </div>
                            <div className="ml-4 flex-1 flex justify-center">
                                <div className="bg-[#1a1a1a] rounded-md px-4 py-1 max-w-[200px] md:max-w-xs w-full">
                                    <span className="text-[10px] text-gray-500 truncate block">livv-analytics.com</span>
                                </div>
                            </div>
                        </div>

                        {/* Content Area - Background Blur Image */}
                        <div className="relative aspect-[16/10] mt-8 md:mt-10 overflow-hidden group">
                            <img
                                src="/images/showcase-blur.png"
                                alt="Background"
                                className="absolute inset-0 w-full h-full object-cover opacity-80"
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-60" />

                            {/* Centered Task UI Card - Code Replication */}
                            <div className="absolute inset-0 flex items-center justify-center p-4 md:p-12">
                                <div className="w-full max-w-lg bg-[#222222] rounded-3xl p-6 shadow-2xl border border-white/5 relative overflow-hidden transform transition-transform duration-500 hover:scale-[1.02]">
                                    {/* Radial Gradient Glow */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                                    {/* Header Tabs */}
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-[#333333] px-4 py-1.5 rounded-full border border-white/10">
                                            <span className="text-white text-xs font-medium">All Tasks</span>
                                        </div>
                                        <span className="text-gray-500 text-xs font-medium">Waiting for approval</span>
                                    </div>

                                    {/* Task List */}
                                    <div className="flex flex-col gap-4">
                                        {/* Task 1 */}
                                        <div className="group/item flex items-center justify-between p-4 bg-[#2A2A2A] rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                                            <div>
                                                <h4 className="text-white text-[15px] font-medium mb-1">Lead list</h4>
                                                <p className="text-gray-500 text-[11px]">70% prepared</p>
                                            </div>
                                            <div className="w-6 h-6 rounded-full border border-gray-600 group-hover/item:border-gray-400 transition-colors" />
                                        </div>

                                        {/* Task 2: Active */}
                                        <div className="group/item flex items-center justify-between p-4 bg-[#2A2A2A] rounded-2xl border border-white/5 hover:border-white/10 transition-colors relative overflow-hidden">
                                            {/* Highlight glow */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#C4A35A]/5 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                            <div className="relative z-10">
                                                <h4 className="text-white text-[15px] font-medium mb-1">Payment reminder</h4>
                                                <p className="text-gray-400 text-[11px]">Sent to selected clients</p>
                                            </div>
                                            <div className="relative z-10 w-6 h-6 rounded-full bg-[#C4A35A] flex items-center justify-center">
                                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1 4L3.5 6.5L9 1" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Task 3 */}
                                        <div className="group/item flex items-center justify-between p-4 bg-[#2A2A2A] rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                                            <div>
                                                <h4 className="text-white text-[15px] font-medium mb-1">Payroll management</h4>
                                                <p className="text-gray-500 text-[11px]">Due on 2nd July</p>
                                            </div>
                                            <div className="w-6 h-6 rounded-full border border-gray-600 group-hover/item:border-gray-400 transition-colors" />
                                        </div>

                                        {/* Task 4 */}
                                        <div className="group/item flex items-center justify-between p-4 bg-[#2A2A2A] rounded-2xl border border-white/5 hover:border-white/10 transition-colors opacity-50">
                                            <div>
                                                <h4 className="text-white text-[15px] font-medium mb-1">Employee Tracking</h4>
                                            </div>
                                            <div className="w-6 h-6 rounded-full border border-gray-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Brand Logos Section */}
                <div
                    className={`mt-20 md:mt-28 transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        }`}
                >
                    {/* Separator line */}
                    <div className="relative w-full h-[1px]">
                        <AnimatedBorders showLeft={false} showRight={false} showTop={true} fullWidth={true} />
                    </div>

                    {/* Logos grid replaced by Ticker */}
                    <TechStackTicker />

                    {/* Bottom separator line */}
                    <div className="relative w-full h-[1px]">
                        <AnimatedBorders showLeft={false} showRight={false} showTop={true} fullWidth={true} />
                    </div>
                </div>
            </div>

            {/* CSS Animation keyframes */}
            <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(20px, -20px) scale(1.05);
          }
        }
      `}</style>
        </section>
    )
}
