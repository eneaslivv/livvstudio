"use client"

import { useRef } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { AnimatedBorders } from "@/components/ui/animated-borders"
import { Playfair_Display } from "next/font/google"
import { useRouter } from "next/navigation"
import { RevealText } from "@/components/ui/reveal-text"

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600"] })

const items = [
    {
        id: 1,
        title: "Internal Management Systems",
        subtitle: "Custom operational tools",
        img: "/images/internal-dashboard.png",
        link: "/projects/internal-management",
        stats: "2024",
        tech: ["Development", "Operational Tools"]
    },
    {
        id: 2,
        title: "Paper",
        subtitle: "Venue & nightlife software",
        img: "/images/portfolio-2.jpg",
        link: "/projects/paper",
        stats: "2024",
        tech: ["Product Strategy", "UI/UX"]
    },
    {
        id: 3,
        title: "SEO Blocks Generator",
        subtitle: "Programmatic SEO for Webflow",
        img: "/images/portfolio-3.jpg",
        link: "/projects/seo-blocks",
        stats: "2024",
        tech: ["Webflow Development", "SEO"]
    },
    {
        id: 4,
        title: "Azqira",
        subtitle: "Digital Experience",
        img: "/images/project-mobile.png",
        link: "/projects/azqira",
        stats: "2024",
        tech: ["UI/UX", "Development"]
    },
    {
        id: 5,
        title: "Pr Tool",
        subtitle: "Content Monetization",
        img: "/images/pr-tool.png",
        link: "/projects/pr-tool",
        stats: "2024",
        tech: ["App development", "Integrations"]
    },
    {
        id: 6,
        title: "Sacoa Cashless",
        subtitle: "Design & Animations",
        img: "/images/sacoa-cashless.png",
        link: "/projects/sacoa",
        stats: "2024",
        tech: ["Design", "Animations"]
    }
]

function PortfolioGrid() {
    const router = useRouter()
    const displayedItems = items.slice(0, 6)

    const handleCardClick = (link: string) => {
        router.push(link)
    }

    return (
        <div className="relative w-full px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] w-full">
                {displayedItems.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => handleCardClick(item.link)}
                        className="group/card relative w-full aspect-[3/2] rounded-[10px] overflow-hidden cursor-pointer border border-[#1a1a1a]/10 hover:border-[#F2D696]/50 transition-all duration-500"
                    >
                        {/* Image */}
                        <img
                            src={item.img}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110"
                        />

                        {/* Gradient Blur Overlay (Softened) */}
                        <div
                            className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-all duration-700 flex flex-col justify-end p-6 md:p-8 backdrop-blur-[6px]"
                            style={{
                                maskImage: 'linear-gradient(to top, black 10%, transparent 60%)',
                                WebkitMaskImage: 'linear-gradient(to top, black 10%, transparent 60%)'
                            }}
                        >
                            {/* Bottom Content (Title & Subtitle) */}
                            <div className="translate-y-4 group-hover/card:translate-y-0 opacity-0 group-hover/card:opacity-100 transition-all duration-700 ease-out delay-100">
                                <span className="inline-block px-2 py-0.5 mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-[#E8BC59] bg-white/5 border border-white/10 rounded-sm">
                                    {item.subtitle}
                                </span>

                                <h3 className={`${playfair.className} text-xl md:text-3xl text-white font-medium leading-tight`}>
                                    {item.title}
                                </h3>
                            </div>
                        </div>

                        {/* Top Metadata (Discreet) */}
                        <div className="absolute inset-x-0 top-0 p-4 md:p-6 flex justify-between items-start opacity-0 group-hover/card:opacity-100 transition-all duration-500 translate-y-[-10px] group-hover/card:translate-y-0">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[8px] uppercase tracking-widest text-white/40">Perf.</span>
                                <span className="text-white text-[10px] font-light tracking-wide">{item.stats}</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 justify-end max-w-[120px]">
                                {item.tech.map((t, i) => (
                                    <span key={i} className="text-[8px] text-[#E8BC59]/80 border border-[#E8BC59]/20 px-1.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Subtle Border Glow */}
                        <div className="absolute inset-0 rounded-[10px] ring-1 ring-white/10 group-hover/card:ring-white/30 transition-all duration-500 pointer-events-none" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export function PortfolioSection({ id }: { id?: string }) {
    return (
        <section id={id} className={`relative w-full text-slate-900 overflow-hidden`}>
            <div className="max-w-7xl mx-auto py-24 md:py-32 relative z-10">
                <AnimatedBorders className="hidden md:block" />

                {/* Section Header */}
                <div className="mx-6 md:mx-12 border-t border-dashed border-[#D1CDC2] relative z-10" />

                <div className="w-full pt-24 md:pt-32 flex flex-col md:flex-row justify-between items-center gap-8 mb-12 md:mb-16 px-10 md:px-24 relative z-10">
                    <div>
                        <h2 className="section-heading mb-4 md:mb-0">
                            <RevealText text="Our Projects" className="text-gradient-gold" />
                        </h2>
                    </div>

                    <div className="max-w-lg text-center md:text-right pb-2">
                        <p className="text-sm md:text-base text-[#5A3E3E]/70 leading-relaxed font-light">
                            Selected works that define our standard of excellence.
                        </p>
                    </div>
                </div>

                {/* Static Grid - "Grid de cuatro muy prolijo" */}
                <div className="w-full relative z-30">
                    <PortfolioGrid />
                </div>
            </div>
        </section>
    )
}
