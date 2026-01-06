"use client"

import { useRef, useEffect, useState } from "react"
import { AnimatedBorders } from "@/components/ui/animated-borders"

const images = [
    { src: "/images/projects/orb.jpg", width: 400, height: "h-[300px] md:h-[450px]" },
    { src: "/images/projects/entrance.jpg", width: 300, height: "h-[350px] md:h-[500px]" },
    { src: "/images/projects/pirana.jpg", width: 500, height: "h-[280px] md:h-[380px]" },
    { src: "/images/projects/man.jpg", width: 350, height: "h-[320px] md:h-[420px]" },
    { src: "/images/projects/orb.jpg", width: 450, height: "h-[300px] md:h-[400px]" },
    { src: "/images/projects/entrance.jpg", width: 300, height: "h-[350px] md:h-[480px]" },
    { src: "/images/projects/pirana.jpg", width: 400, height: "h-[290px] md:h-[390px]" },
    { src: "/images/projects/man.jpg", width: 350, height: "h-[320px] md:h-[450px]" },
]

export function ImageSliderSection() {
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
            className="relative w-full overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32 relative z-10">
                <AnimatedBorders className="hidden md:block" />

                {/* Header */}
                <div
                    className={`flex flex-col md:flex-row px-6 md:px-12 justify-between items-start md:items-center text-[10px] uppercase tracking-widest text-[#5A3E3E]/60 mb-12 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                >
                    <span>© FINAL SECTION クローイング</span>
                    <span className="hidden md:block">(WDX® — 12)</span>
                    <span className="md:text-right">STUDIO WRAP</span>
                </div>

                {/* Slider Container */}
                <div
                    className={`relative w-full overflow-hidden transition-all duration-1000 delay-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
                >
                    {/* Reduced gap and vertically aligned to center or bottom? Let's center align items */}
                    <div className="flex gap-[2px] animate-marquee hover:[animation-play-state:paused] items-center">
                        {/* Track 1 */}
                        {[...images, ...images].map((img, index) => (
                            <div
                                key={index}
                                className={`relative flex-shrink-0 ${img.height} bg-[#E8E4DC] overflow-hidden group cursor-pointer transition-all duration-500 rounded-[10px]`}
                                style={{
                                    width: `${img.width}px`
                                }}
                            >
                                {/* Actual Images from array */}
                                <div className="absolute inset-0 bg-[#D4D4D4]">
                                    <div
                                        className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                        style={{ backgroundImage: `url(${img.src})` }}
                                    />
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .animate-marquee {
                    animation: marquee 40s linear infinite;
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </section>
    )
}
