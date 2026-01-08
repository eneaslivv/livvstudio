"use client"

import { inter } from "@/app/fonts"
import { AnimatedBorders } from "@/components/ui/animated-borders"
import { TechStackTicker } from "@/components/ui/tech-stack-ticker"

export function AnalyticsSection() {
    return (
        <section className="relative w-full z-10 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20 relative">
                <AnimatedBorders className="hidden md:block" />

                <div className="flex flex-col items-center w-full mx-auto relative z-10">
                    {/* Header Section - Carbon AI Branding */}
                    <div className="text-center mb-16 md:mb-24 px-6 md:px-12 animate-reveal">
                        <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-[#C4A35A] font-medium mb-6">
                            Carbon AI in it
                        </span>
                        <h2 className="section-heading text-gradient-gold">
                            Precision Engineering + Soulful Design <br className="hidden md:block" />
                            = Scalable Assets.
                        </h2>
                    </div>

                    {/* Video Container with Premium Framing */}
                    <div className="w-full max-w-5xl px-6 md:px-12 animate-reveal delay-100">
                        <div className="aspect-video rounded-[10px] overflow-hidden shadow-2xl border border-stone-200/50 bg-[#FBFBF9] relative group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-stone-100/20 via-transparent to-stone-100/20 z-10 pointer-events-none" />

                            <div className="relative w-full h-full">
                                <iframe
                                    src="https://player.vimeo.com/video/839041538?h=689f95f6d1&autoplay=1&loop=1&title=0&byline=0&portrait=0&muted=1&background=1"
                                    className="absolute top-0 left-0 w-full h-full"
                                    frameBorder="0"
                                    allow="autoplay; fullscreen; picture-in-picture"
                                    allowFullScreen
                                    title="Livv Analytics Dashboard"
                                ></iframe>
                            </div>

                            {/* Glass Overlay on corners */}
                            <div className="absolute top-4 left-4 z-20 tech-glass px-3 py-1.5 rounded-full flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-mono uppercase tracking-widest text-[#171717]">Live Dashboard Preview</span>
                            </div>
                        </div>
                    </div>

                    {/* Brand Logos Section - preserved from showcase */}
                    <div className="w-full mt-24 md:mt-32 animate-reveal delay-300">
                        {/* Separator line */}
                        <div className="relative w-full h-[1px]">
                            <AnimatedBorders showLeft={false} showRight={false} showTop={true} fullWidth={true} />
                        </div>

                        <TechStackTicker />

                        {/* Bottom separator line */}
                        <div className="relative w-full h-[1px]">
                            <AnimatedBorders showLeft={false} showRight={false} showTop={true} fullWidth={true} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
