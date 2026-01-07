"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { AnimatedBorders } from "@/components/ui/animated-borders"

const testimonials = [
    {
        quote: "Was great working together, we will work together again in the future.",
        name: "Ronen Wasserman",
        role: "Founder & President",
        image: "/images/ronen-wasserman.jpg",
        website: "https://srpro.marketing",
        stars: 5,
    },
    {
        quote: "It was great working with Eneas! He was so understanding and also very patient. He followed through all the revisions, communicated via looms and delivered excellent work!",
        name: "Fidan Alizada",
        role: "Creator | Marketer | Storyteller",
        image: "/images/fidan-alizada.jpg",
        website: "https://www.instagram.com/thealizada/",
        stars: 5,
    },
    {
        quote: "I hired Eneas for a critical Webflow build and was seriously impressed. He brought my vision to life with clean, responsive design, fast load times, and no drama. Communication was sharp, turnaround was quick, and the end result was exactly what I needed. Highly recommend.",
        name: "Sabrina Guler",
        role: "Advisor, Author & Founder of Intuitive CEO",
        image: "/images/sabrina-guler.jpg",
        website: "https://sabrinaguler.com/",
        stars: 5,
    },
]

export function TestimonialsSection() {
    const [active, setActive] = useState(0)

    // Auto-loop through testimonials every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setActive((prev) => (prev + 1) % testimonials.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    return (
        <section className="w-full relative">
            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 py-8 md:py-10">
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

                    {/* Quote - Dynamic height based on content */}
                    <div className="relative mb-8" style={{ minHeight: active === 2 ? '180px' : active === 1 ? '120px' : '60px' }}>
                        {testimonials.map((t, i) => (
                            <p
                                key={i}
                                className={`
                                    absolute inset-x-0 top-0 text-lg md:text-xl font-light leading-relaxed text-[#1a1a1a]
                                    transition-all duration-500 ease-out
                                    ${active === i
                                        ? "opacity-100 translate-y-0 blur-0"
                                        : "opacity-0 translate-y-4 blur-sm pointer-events-none"
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
                            {testimonials.map((t, i) => (
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
                        <div className="relative min-h-[44px] text-left">
                            {testimonials.map((t, i) => (
                                <div
                                    key={i}
                                    className={`
                                        absolute inset-0 flex flex-col justify-center whitespace-nowrap
                                        transition-all duration-400 ease-out
                                        ${active === i ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"}
                                    `}
                                >
                                    <a
                                        href={t.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium text-[#1a1a1a] hover:underline"
                                    >
                                        {t.name}
                                    </a>
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
