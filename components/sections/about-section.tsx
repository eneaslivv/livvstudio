"use client"

import { useRef, useEffect, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { AnimatedBorders } from "@/components/ui/animated-borders"
import { RevealText } from "@/components/ui/reveal-text"

const stats = [
  { value: "150+", label: "Projects Delivered", description: "Across 12 countries" },
  { value: "08", label: "Years Experience", description: "Design & Development" },
  { value: "12", label: "Design Awards", description: "International recognition" },
  { value: "24/7", label: "Support", description: "Dedicated team" },
]

export function AboutSection({ id }: { id?: string }) {
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
      id={id}
      ref={sectionRef}
      className="relative w-full"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20 relative z-10">
        <AnimatedBorders className="hidden md:block" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Left Column: Text Content */}
          <div className="pl-[10%] lg:pl-[20%]">
            <div
              className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
            >
              <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-gradient-gold font-medium mb-4">
                About Us
              </span>
              <h2 className="section-heading mb-8">
                <RevealText text="Building the future of digital experiences." className="text-gradient-gold" isVisible={isVisible} />
              </h2>
              <div className="space-y-6 text-[#1a1a1a]/70 font-light text-base md:text-lg leading-relaxed max-w-md">
                <p>
                  We are a collective of designers, developers, and creative technologists obsessed with crafting exceptional digital products.
                </p>
                <p>
                  Every project is an opportunity to explore new possibilities and push creative boundaries, delivering work that drives real business results.
                </p>
              </div>

              <div className="mt-12">
                <a href="#work" className="group flex items-center gap-3 text-sm tracking-widest uppercase text-[#1a1a1a] font-medium hover:text-[#C4A35A] transition-colors duration-300">
                  <span className="w-8 h-[1px] bg-[#1a1a1a] group-hover:bg-[#C4A35A] transition-colors duration-300" />
                  See Our Work
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Stats */}
          <div className="pr-[5%] lg:pr-[10%]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`border-l border-[#1a1a1a]/10 pl-6 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                    }`}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                >
                  <div className="text-4xl md:text-5xl font-light text-[#1a1a1a] mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-[#1a1a1a] uppercase tracking-wide mb-1">
                    {stat.label}
                  </div>
                  <div className="text-xs text-[#1a1a1a]/50 font-mono">
                    {stat.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Section Footer - Grid Consistency */}
        <div className="mt-20 py-8 px-6 md:px-12 w-full border-t border-dotted border-[#E8E4DC] flex justify-between items-center text-[10px] uppercase tracking-widest text-[#1a1a1a]/60">
          <span>© About Us 私たち</span>
          <span>(WDX® — 04)</span>
        </div>

      </div>
    </section>
  )
}
