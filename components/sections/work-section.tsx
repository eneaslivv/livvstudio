"use client"

import { useRef, useEffect, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { AnimatedBorders } from "@/components/ui/animated-borders"
import { RevealText } from "@/components/ui/reveal-text"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

const projects = [
  {
    number: "01",
    title: "Internal Management Systems",
    category: "Custom operational tools",
    year: "2024",
    color: "from-[#FFD700] to-[#FF8C00]",
    image: "/images/portfolio-1.png"
  },
  {
    number: "02",
    title: "Pr Tool",
    category: "Content Tech",
    year: "2024",
    color: "from-[#769268] to-[#4A5D3B]", // Keeping the original color of the replaced item, as per snippet's partial inclusion
    image: "/images/pr-tool.png", // Updated image
    description: "App for content creators, affiliate links y Tienda nube full custom integrations", // New description
    link: "/work/pr-tool" // New link
  },
  {
    number: "03",
    title: "SEO Blocks Generator",
    category: "Programmatic SEO for Webflow",
    year: "2024",
    color: "from-[#6DBEDC] to-[#2F4F75]",
    image: "/images/portfolio-3.jpg"
  },
]

export function WorkSection({ id }: { id?: string }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        } else {
          setIsVisible(false)
        }
      },
      { threshold: 0.35 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    setCursorPos({
      x: e.clientX,
      y: e.clientY
    })
  }

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative w-full"
      onMouseMove={handleMouseMove}
    >
      {/* Full-width Background color transition */}
      <div
        className={`absolute inset-0 transition-colors duration-[1500ms] ease-in-out z-0 pointer-events-none ${isVisible ? "bg-[#ede5d8]" : "bg-transparent"}`}
      />
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20 relative z-10">



        <AnimatedBorders className="hidden md:block z-20" />

        {/* Section Header */}
        <div className="relative w-full h-[1px]">
          <AnimatedBorders showLeft={false} showRight={false} showTop={true} fullWidth={true} />
        </div>

        <div className="w-full pt-16 md:pt-20 flex flex-col md:flex-row justify-between items-center gap-8 mb-12 md:mb-16 px-10 md:px-24 relative z-20">
          <div>
            <span className={`inline-block text-[11px] tracking-[0.3em] uppercase font-medium mb-4 transition-colors duration-1000 ${isVisible ? "text-[#2c0405]/40" : "text-[#1a1a1a]/40"}`}>
              Recent Work
            </span>
            <h2 className="section-heading mb-4 md:mb-0">
              {/* Pass text color to RevealText or handle it via parent class if supported, explicitly setting color here for safety */}
              <RevealText text="Products built in collaboration." className={`transition-colors duration-1000 ${isVisible ? "text-[#2c0405]" : "text-gradient-gold"}`} />
            </h2>
          </div>

          <div className="max-w-xl text-center md:text-right pb-2">
            <p className={`text-sm md:text-base leading-relaxed font-light transition-colors duration-1000 ${isVisible ? "text-[#2c0405]/70" : "text-[#1a1a1a]/60"}`}>
              We partner with startups, agencies, and teams to design and develop scalable digital systems.
            </p>
          </div>
        </div>

        {/* Floating Image Cursor */}
        <AnimatePresence>
          {hoveredIndex !== null && projects[hoveredIndex].image && (
            <motion.div
              className="fixed z-[60] pointer-events-none hidden md:block overflow-hidden rounded-lg shadow-2xl border border-white/20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: cursorPos.x + 20,
                y: cursorPos.y - 20 // Lowered significantly from -90
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 150, damping: 20, mass: 0.5 }}
              style={{
                width: '280px',
                height: '180px',
                left: 0,
                top: 0
              }}
            >
              <Image
                src={projects[hoveredIndex].image}
                alt="Project Preview"
                fill
                className="object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Projects List */}
        <div className="flex flex-col relative z-20">
          {projects.map((project, index) => (
            <div
              key={index}
              className={`group relative border-t border-dashed border-[#D1CDC2] transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Hover content overlay background - refined for brand consistency */}
              <div
                className="absolute inset-0 bg-[#C4A35A] opacity-0 group-hover:opacity-5 transition-opacity duration-500"
              />

              {/* Add a solid background color on hover to mask the section bg if needed, or blend */}

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-10 md:py-16 px-[10%] md:px-0">
                {/* Number */}
                <div className="md:col-start-2 md:col-span-1">
                  <span className={`font-mono text-xs md:text-sm transition-colors duration-1000 ${isVisible ? "text-[#2c0405]/40" : "text-[#1a1a1a]/40"} group-hover:text-[#C4A35A]`}>
                    {project.number}
                  </span>
                </div>

                {/* Title */}
                <div className="md:col-span-5 relative">
                  <h3 className={`text-2xl md:text-4xl lg:text-5xl font-light transition-colors duration-1000 ${isVisible ? "text-[#2c0405]" : "text-[#1a1a1a]"} group-hover:translate-x-4 transition-transform duration-500 ease-out`}>
                    {project.title}
                  </h3>
                </div>

                {/* Category */}
                <div className="md:col-span-3">
                  <span className={`text-sm md:text-base font-light transition-colors duration-1000 ${isVisible ? "text-[#2c0405]/60" : "text-[#1a1a1a]/60"} group-hover:text-[#2c0405]`}>
                    {project.category}
                  </span>
                </div>

                {/* Year & Arrow */}
                <div className="md:col-span-1 flex items-center justify-end gap-4 overflow-hidden">
                  <span className={`font-mono text-xs md:text-sm transition-colors duration-1000 ${isVisible ? "text-[#2c0405]/40" : "text-[#1a1a1a]/40"} group-hover:-translate-y-full transition-transform duration-300`}>
                    {project.year}
                  </span>
                  <div className="absolute right-0 md:relative translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <ArrowUpRight className={`w-6 h-6 transition-colors duration-1000 ${isVisible ? "text-[#2c0405]" : "text-[#1a1a1a]"} md:ml-auto`} />
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* Closing border */}
          <div className="relative w-full h-[1px]">
            <AnimatedBorders showLeft={false} showRight={false} showTop={true} fullWidth={true} />
          </div>
        </div>

        {/* View All Button */}
      </div>
    </section>
  )
}
