"use client"

import { useRef, useEffect, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { AnimatedBorders } from "@/components/ui/animated-borders"
import { RevealText } from "@/components/ui/reveal-text"

const projects = [
  {
    number: "01",
    title: "Kinetic Typography",
    category: "Interactive Experience",
    year: "2024",
    color: "from-[#FFD700] to-[#FF8C00]"
  },
  {
    number: "02",
    title: "Generative Patterns",
    category: "Visual System",
    year: "2024",
    color: "from-[#769268] to-[#4A5D3B]"
  },
  {
    number: "03",
    title: "Spatial Interface",
    category: "3D Navigation",
    year: "2023",
    color: "from-[#6DBEDC] to-[#2F4F75]"
  },
  {
    number: "04",
    title: "Digital Ecosystem",
    category: "Platform Design",
    year: "2023",
    color: "from-[#E8BC59] to-[#C4A35A]"
  },
]

export function WorkSection({ id }: { id?: string }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

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

        {/* Section Header */}
        <div className="mx-6 md:mx-12 border-t border-dashed border-[#D1CDC2] relative z-10" />

        <div className="w-full pt-16 md:pt-20 flex flex-col md:flex-row justify-between items-center gap-8 mb-12 md:mb-16 px-10 md:px-24 relative z-10">
          <div>
            <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-[#1a1a1a]/40 font-medium mb-4">
              Recent Work
            </span>
            <h2 className="section-heading mb-4 md:mb-0">
              <RevealText text="Products built in collaboration." className="text-gradient-gold" />
            </h2>
          </div>

          <div className="max-w-xl text-center md:text-right pb-2">
            <p className="text-sm md:text-base text-[#1a1a1a]/60 leading-relaxed font-light">
              We partner with startups, agencies, and teams to design and develop scalable digital systems.
            </p>
          </div>
        </div>

        {/* Projects List */}
        <div className="flex flex-col">
          {projects.map((project, index) => (
            <div
              key={index}
              className={`group relative border-t border-dashed border-[#D1CDC2] transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Hover content overlay background */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${project.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              />

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-10 md:py-16 px-[10%] md:px-0">
                {/* Number */}
                <div className="md:col-start-2 md:col-span-1">
                  <span className="font-mono text-xs md:text-sm text-[#1a1a1a]/40 group-hover:text-[#C4A35A] transition-colors duration-300">
                    {project.number}
                  </span>
                </div>

                {/* Title */}
                <div className="md:col-span-5 relative">
                  <h3 className="text-2xl md:text-4xl lg:text-5xl font-light text-[#1a1a1a] group-hover:translate-x-4 transition-transform duration-500 ease-out">
                    {project.title}
                  </h3>
                </div>

                {/* Category */}
                <div className="md:col-span-3">
                  <span className="text-sm md:text-base text-[#1a1a1a]/60 font-light group-hover:text-[#1a1a1a] transition-colors duration-300">
                    {project.category}
                  </span>
                </div>

                {/* Year & Arrow */}
                <div className="md:col-span-1 flex items-center justify-end gap-4 overflow-hidden">
                  <span className="font-mono text-xs md:text-sm text-[#1a1a1a]/40 group-hover:-translate-y-full transition-transform duration-300">
                    {project.year}
                  </span>
                  <div className="absolute right-0 md:relative translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <ArrowUpRight className="w-6 h-6 text-[#1a1a1a] md:ml-auto" />
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* Closing border */}
          <div className="border-t border-dashed border-[#D1CDC2]" />
        </div>

        {/* View All Button */}
        <div
          className={`mt-20 flex justify-center transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <button className="group relative px-8 py-3 rounded-full border border-[#1a1a1a]/10 hover:border-[#1a1a1a] transition-colors duration-300 overflow-hidden">
            <span className="relative z-10 text-sm tracking-widest uppercase text-[#1a1a1a] font-medium">View All Projects</span>
            <div className="absolute inset-0 bg-[#1a1a1a] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out -z-0" />
            <span className="absolute inset-0 z-10 flex items-center justify-center text-sm tracking-widest uppercase text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">View All Projects</span>
          </button>
        </div>
      </div>
    </section>
  )
}
