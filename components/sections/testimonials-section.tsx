"use client"

import { useState } from "react"
import Image from "next/image"

const testimonials = [
    {
        quote: "Working with them transformed our entire brand identity. The attention to detail was exceptional.",
        name: "Sarah Chen",
        role: "CEO at Stripe",
        image: "https://images.unsplash.com/photo-1701615004837-40d8573b6652?w=900&auto=format&fit=crop&q=60",
    },
    {
        quote: "A rare talent who combines strategic thinking with flawless execution. Highly recommended.",
        name: "Marcus Johnson",
        role: "Design Lead at Linear",
        image: "https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=900&auto=format&fit=crop&q=60",
    },
    {
        quote: "The most seamless collaboration I've experienced. They truly understand modern design.",
        name: "Elena Voss",
        role: "Founder at Notion",
        image: "https://plus.unsplash.com/premium_photo-1689977830819-d00b3a9b7363?w=900&auto=format&fit=crop&q=60",
    },
]

export function TestimonialsSection() {
    const [active, setActive] = useState(0)

    return (
        <section className="w-full bg-[#FAF8F3] py-20">
            <div className="w-full max-w-xl mx-auto px-6">
                {/* Quote */}
                <div className="relative min-h-[120px] mb-12">
                    {testimonials.map((t, i) => (
                        <p
                            key={i}
                            className={`
                absolute inset-0 text-xl md:text-2xl font-light leading-relaxed text-[#1a1a1a]
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
                <div className="flex items-center gap-6">
                    {/* Avatars */}
                    <div className="flex -space-x-2">
                        {testimonials.map((t, i) => (
                            <button
                                key={i}
                                onClick={() => setActive(i)}
                                className={`
                  relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#FAF8F3]
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
                    <div className="relative flex-1 min-h-[44px]">
                        {testimonials.map((t, i) => (
                            <div
                                key={i}
                                className={`
                  absolute inset-0 flex flex-col justify-center
                  transition-all duration-400 ease-out
                  ${active === i ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"}
                `}
                            >
                                <span className="text-sm font-medium text-[#1a1a1a]">{t.name}</span>
                                <span className="text-xs text-[#5A3E3E]/70">{t.role}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
