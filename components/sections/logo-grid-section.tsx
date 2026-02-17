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
        {
            src: "/logos-header/logo-6.png",
            alt: "ViewFi",
            href: "https://viewfi.live/",
            description: "Real-time monitoring and analytics.",
            hoverBg: "/assets/logo-bg-1.jpg",
        },
        {
            src: "/logos-header/logo-7.png",
            alt: "RE/MAX",
            href: "https://www.remax.com.ar/",
            description: "Venta y alquiler de propiedades.",
            hoverBg: "/assets/logo-bg-2.jpg",
        },
        {
            src: "/logos-header/sacoa.png",
            alt: "Sacoa",
            href: "https://sacoa.com/",
            description: "Entertainment experiences across LATAM.",
            hoverBg: "/assets/logo-bg-3.jpg",
        },
        {
            src: "/logos-header/wortise.png",
            alt: "Wortise",
            href: "https://wortise.com/es",
            description: "AI-powered monetization and ads insights.",
            hoverBg: "/assets/logo-bg-1.jpg",
        },
        {
            src: "/logos-header/blackbox.png",
            alt: "Blackbox AI",
            href: "https://www.blackbox.ai/",
            description: "Autonomous agents for software teams.",
            hoverBg: "/assets/logo-bg-2.jpg",
        },
        {
            src: "/logos-header/buda.png",
            alt: "Buda.com",
            href: "https://www.buda.com/argentina",
            description: "Cripto exchange, simple and secure.",
            hoverBg: "/assets/logo-bg-3.jpg",
        },
        {
            src: "/logos-header/heygen.png",
            alt: "HeyGen",
            href: "https://www.heygen.com/",
            description: "AI video generator with avatars.",
            hoverBg: "/assets/logo-bg-1.jpg",
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

                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5">
                    {logos.map((logo, index) => (
                        <a
                            key={index}
                            href={logo.href}
                            target="_blank"
                            rel="noreferrer"
                            className="group relative h-32 md:h-40 flex items-center justify-center border border-[#E8E4DC] overflow-hidden cursor-pointer bg-white"
                        >
                            <style jsx>{`
                                @media (max-width: 767px) {
                                    a:nth-child(2n) { border-right: none; }
                                }
                                @media (min-width: 768px) {
                                    a:nth-child(5n) { border-right: none; }
                                }
                            `}</style>

                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out z-0">
                                <Image
                                    src={logo.hoverBg!}
                                    alt="Background"
                                    fill
                                    className="object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/40" />
                            </div>

                            <div
                                className={`relative z-10 w-28 h-12 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                                style={{ transitionDelay: `${500 + index * 100}ms` }}
                            >
                                <Image
                                    src={logo.src}
                                    alt={logo.alt}
                                    fill
                                    className="object-contain filter transition-all duration-500 group-hover:invert"
                                />
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}
