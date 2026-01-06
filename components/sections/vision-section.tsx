"use client"

import { useRef, useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"
import { AnimatedBorders } from "@/components/ui/animated-borders"

export function VisionSection() {
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

                <div className="flex flex-col items-center justify-center text-center">
                    {/* Headline */}
                    <h2
                        className={`text-4xl md:text-6xl lg:text-7xl font-light text-[#1a1a1a] tracking-tight leading-[1.1] max-w-5xl mx-auto mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                    >
                        <span className="text-[#999999]">Let's turn your vision into</span>
                        <br />
                        <span className="text-[#A69C8E]">measurable</span>

                        {/* Inline Image */}
                        <div className="inline-block mx-2 md:mx-4 w-16 h-10 md:w-24 md:h-16 rounded-lg overflow-hidden align-middle relative top-[-4px] md:top-[-8px] shadow-sm transform rotate-3 hover:rotate-0 transition-transform duration-300">
                            <img
                                src="/images/vision-hands.jpg"
                                alt="Hands framing vision"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <span className="text-[#C8BFA9]">things.</span>
                    </h2>

                    {/* Gradient Input Container */}
                    <div
                        className={`relative w-full max-w-xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                    >
                        {/* Soft colored shadow behind */}
                        <div className="absolute inset-4 bg-gradient-to-r from-pink-300 via-yellow-200 to-blue-200 opacity-40 blur-xl rounded-full" />

                        {/* Gradient Border Wrapping */}
                        <div className="relative p-[2px] rounded-full bg-gradient-to-r from-[#FF9CA4] via-[#FFE58A] to-[#8EB5FF]">
                            <div className="relative bg-white rounded-full flex items-center p-2 pr-2">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="flex-grow bg-transparent border-none outline-none px-6 text-[#1a1a1a] placeholder:text-gray-400 font-light text-lg"
                                />
                                <button className="bg-black hover:bg-gray-900 text-white rounded-full px-6 py-3 flex items-center gap-2 transition-transform duration-300 hover:scale-105">
                                    <span className="text-sm font-medium pr-1">Contact us</span>
                                    <div className="w-4 h-4 text-white">
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                            <path d="M12 4L12 20M12 4L4 12M12 4L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(45 12 12)" />
                                            <path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" fill="currentColor" />
                                        </svg>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
