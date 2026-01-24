"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { AnimatedBorders } from "@/components/ui/animated-borders"

const reviews = [
    {
      quote: "Eneas is great to work with an came prepared to get the product done in the most efficient manner possible",
      name: "Chris Green",
      role: "Founder, CEO | madhatterai.com",
      image: "/images/Chris.jpeg",
      website: "https://www.linkedin.com/in/chrisgreen100",
      stars: 5,
    },
    {
        quote: "Definitely work with Eneas",
        name: "Sergio Gongora",
        role: "Bubble Dev - Co Found Datamatic Software",
        image: "/images/Sergio.jpeg",
        website: "https://www.linkedin.com/in/segongora/",
        stars: 5,
    },
    {
        quote: "Talented and very quick to respond. Gracias Eneas.",
        name: "Joaquin",
        role: "Inversor | Boca de Agua Hotel",
        image: "/placeholder-user.jpg",
        website: "#",
        stars: 5,
    },
  ];

export function ReviewsSection() {
    const [active, setActive] = useState(0)

    // This is the animation loop that was missing. It changes the active review every 5 seconds.
    useEffect(() => {
        const interval = setInterval(() => {
            setActive((prev) => (prev + 1) % reviews.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    return (
        <section className="w-full relative bg-white py-20">
            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <AnimatedBorders className="hidden md:block" />

                <div className="w-full max-w-2xl mx-auto text-center">
                    {/* Stars Rating */}
                    <div className="flex justify-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-6 h-6 bg-[#1a1a1a] flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                        ))}
                    </div>

                    {/* Quote */}
                    <div className="grid grid-cols-1 grid-rows-1 mb-10 overflow-hidden" style={{ minHeight: '160px' }}>
                        {reviews.map((t, i) => (
                            <p
                                key={i}
                                style={{ gridArea: "1 / 1 / 2 / 2" }}
                                className={`
                                    text-lg md:text-xl font-light leading-relaxed text-[#1a1a1a]
                                    transition-all duration-700 ease-out
                                    ${active === i
                                        ? "opacity-100 translate-y-0 blur-0"
                                        : "opacity-0 translate-y-8 blur-sm pointer-events-none"
                                    }
                                `}
                            >
                                "{t.quote}"
                            </p>
                        ))}
                    </div>

                    {/* Author Row */}
                    <div className="flex items-center justify-center gap-6">
                        {/* Avatars */}
                        <div className="flex -space-x-2">
                            {reviews.map((t, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActive(i)}
                                    className={`
                                        relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white
                                        transition-all duration-300 ease-out
                                        ${active === i ? "z-10 scale-110" : "grayscale hover:grayscale-0 hover:scale-105"}
                                    `}
                                >
                                    <Image src={t.image} alt={t.name} fill className="object-cover" />
                                </button>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="h-8 w-px bg-[#D6D1C5]" />

                        {/* Active Author Info */}
                        <div className="grid grid-cols-1 grid-rows-1 text-left">
                            {reviews.map((t, i) => (
                                <div
                                    key={i}
                                    style={{ gridArea: "1 / 1 / 2 / 2" }}
                                    className={`
                                        flex flex-col justify-center whitespace-nowrap
                                        transition-all duration-500 ease-out
                                        ${active === i ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"}
                                    `}
                                >
                                    <Link
                                        href={t.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium text-[#1a1a1a] hover:underline"
                                    >
                                        {t.name}
                                    </Link>
                                    <span className="text-xs text-[#5A3E3E]/70">{t.role}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
