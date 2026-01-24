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
      className="relative w-full overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32 relative z-10">
        <AnimatedBorders />

        <div className="relative">
          {/* Right side background square */}
          <div className="absolute inset-0 left-1/2 bg-[#EBE8DB] hidden md:block" />

          {/* Full Height Vertical Divider (Desktop) - Connects top and bottom lines */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#1a1a1a]/10 -translate-x-1/2" />

          {/* Section Header with Line */}
          <div className="w-full relative z-10 mb-20 md:mb-24">
            <div className="relative w-full h-[1px]">
              <AnimatedBorders showLeft={false} showRight={false} showTop={true} fullWidth={true} />
            </div>
            <div className="pt-6 flex justify-between items-center text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 px-6 md:px-12">
              <span>© About Us 私たち</span>
              <span>(WDX® — 04)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 relative">

            {/* Left Column: Text Content */}
            <div className="pl-6 md:pl-10 md:pr-16 lg:pr-24 md:py-8">
              <div
                className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
              >
                <h2 className="section-heading mb-10">
                  <RevealText text="Building the future of digital experiences." className="text-gradient-gold" isVisible={isVisible} />
                </h2>
                <div className="space-y-8 text-[#1a1a1a]/70 font-light text-base md:text-lg leading-relaxed max-w-md">
                  <p>
                    We are a collective of designers, developers, and creative technologists obsessed with crafting exceptional digital products.
                  </p>
                  <p>
                    Every project is an opportunity to explore new possibilities and push creative boundaries, delivering work that drives real business results.
                  </p>
                </div>

                <div className="mt-16">
                  <a href="#work" className="group flex items-center gap-3 text-sm tracking-widest uppercase text-[#1a1a1a] font-medium hover:text-[#C4A35A] transition-colors duration-300">
                    <span className="w-12 h-[1px] bg-[#1a1a1a] group-hover:bg-[#C4A35A] transition-colors duration-300" />
                    See Our Work
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Stats */}
            <div className="pl-6 md:pl-16 lg:pl-24 md:py-8 mt-16 md:mt-0 relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className={`relative transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                      }`}
                    style={{ transitionDelay: `${300 + index * 100}ms` }}
                  >
                    {/* Small aesthetic dash above each stat */}
                    <div className="w-4 h-[1px] bg-[#C4A35A] mb-6 opacity-60" />

                    <div className="text-4xl md:text-5xl font-light text-[#1a1a1a] mb-3">
                      {stat.value}
                    </div>
                    <div className="text-xs font-bold text-[#1a1a1a] uppercase tracking-[0.2em] mb-2 opacity-80">
                      {stat.label}
                    </div>
                    <div className="text-[10px] text-[#1a1a1a]/50 font-mono tracking-wide">
                      {stat.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Decorative Line */}
          <div className="mt-24 w-full h-[1px] bg-[#1a1a1a]/5" />
        </div>

      </div>
    </section>
  )
}
