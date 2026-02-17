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
        {
            src: "/logos-header/logo-6.png",
            alt: "ViewFi",
            href: "https://viewfi.live/",
            description: "Real-time monitoring and analytics.",
        },
        {
            src: "/logos-header/logo-7.png",
            alt: "RE/MAX",
            href: "https://www.remax.com.ar/",
            description: "Venta y alquiler de propiedades.",
        },
        {
            src: "/logos-header/sacoa.png",
            alt: "Sacoa",
            href: "https://sacoa.com/",
            description: "Entertainment experiences across LATAM.",
        },
        {
            src: "/logos-header/wortise.png",
            alt: "Wortise",
            href: "https://wortise.com/es",
            description: "AI-powered monetization and ads insights.",
        },
        {
            src: "/logos-header/blackbox.png",
            alt: "Blackbox AI",
            href: "https://www.blackbox.ai/",
            description: "Autonomous agents for software teams.",
        },
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
                        <a
                            key={index}
                            href={logo.href}
                            target="_blank"
                            rel="noreferrer"
                            className="group relative h-32 md:h-40 flex items-center justify-center border border-[#E8E4DC] overflow-hidden cursor-pointer bg-white transition-all duration-300 hover:bg-[#2C0405]"
                        >
                            <style jsx>{`
                                @media (max-width: 767px) {
                                    a:nth-child(2n) { border-right: none; }
                                }
                                @media (min-width: 768px) {
                                    a:nth-child(5n) { border-right: none; }
                                }
                            `}</style>

                            <div
                                className={`w-28 h-12 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                            >
                                <div
                                    className="w-full h-full bg-transparent"
                                    style={{
                                        maskImage: `url(${logo.src})`,
                                        maskSize: "contain",
                                        maskRepeat: "no-repeat",
                                        maskPosition: "center",
                                        WebkitMaskImage: `url(${logo.src})`,
                                        WebkitMaskSize: "contain",
                                        WebkitMaskRepeat: "no-repeat",
                                        WebkitMaskPosition: "center",
                                        backgroundColor: "currentColor",
                                    }}
                                />
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}
