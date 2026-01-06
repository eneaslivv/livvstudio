"use client"

import { useRef, useEffect, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { AnimatedBorders } from "@/components/ui/animated-borders"
import { RevealText } from "@/components/ui/reveal-text"

export function ServicesSection() {
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

  const services = [
    {
      title: "Creative Engineering",
      description: "Fluid web experiences and native apps built on React & Flutter. We write code that enables complex interactions and silky-smooth performance.",
      color: "bg-transparent",
      textColor: "text-[#EDE5D8]",
      cardBg: "bg-[#2C1A1A]",
      imageClass: "opacity-100 scale-[1.15]",
      bgImage: "/images/service-tech-bg.jpg",
      hoverLabel: "TECH"
    },
    {
      title: "Product Strategy & UI",
      description: "We design with business logic. From wireframes to high-fidelity UI, every pixel has a purpose: conversion, retention, and brand authority.",
      color: "bg-[#A8C8C0]",
      textColor: "text-[#D4D884]",
      cardBg: "bg-[#5C553A]",
      imageClass: "opacity-100 scale-[1.15]",
      bgImage: "/images/service-bg-new.jpg",
      hoverLabel: "BUSINESS"
    },
    {
      title: "Motion & Narrative",
      description: "Static is boring. We produce high-end motion graphics, 3D visuals, and dynamic content that tell your product's story and capture attention instantly.",
      color: "bg-[#BFABCC]",
      textColor: "text-[#D199C2]",
      cardBg: "bg-[#1A1016]",
      imageClass: "opacity-100 scale-[1.15]",
      bgImage: "/images/service-bg-animations.jpg",
      hoverLabel: "ART"
    },
  ]

  return (
    <section ref={sectionRef} className="relative w-full">
      <div className={`relative z-10 transition-all duration-1000 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20 relative">
          <AnimatedBorders className="hidden md:block" />
          {/* Section Header */}
          <div className="w-full border-t border-dashed border-[#D1CDC2] pt-6 flex justify-between items-center text-[10px] uppercase tracking-widest text-[#5A3E3E]/60 mb-20 md:mb-32 px-6 md:px-12 relative z-10">
            <span>© Services サービス</span>
            <span>(WDX® — 01)</span>
          </div>

          {/* Typography Header */}

          {/* Typography Header with Loop Animation */}
          <div className="mb-20 md:mb-32 overflow-hidden w-full">
            <div className="flex animate-marquee whitespace-nowrap">
              <h1 className="text-[12vw] leading-[0.8] font-light tracking-tighter text-[#2A1818] mr-12 md:mr-24 shrink-0 flex items-center">
                livv <RevealText text="services" className="text-gradient-gold ml-4 mr-4" isVisible={isVisible} delay={200} /><span className="text-gradient-gold align-top text-[4vw]">©</span>
              </h1>
              <h1 className="text-[12vw] leading-[0.8] font-light tracking-tighter text-[#2A1818] mr-12 md:mr-24 shrink-0 flex items-center">
                livv <RevealText text="services" className="text-gradient-gold ml-4 mr-4" isVisible={isVisible} delay={200} /><span className="text-gradient-gold align-top text-[4vw]">©</span>
              </h1>
              <h1 className="text-[12vw] leading-[0.8] font-light tracking-tighter text-[#2A1818] mr-12 md:mr-24 shrink-0 flex items-center">
                livv <RevealText text="services" className="text-gradient-gold ml-4 mr-4" isVisible={isVisible} delay={200} /><span className="text-gradient-gold align-top text-[4vw]">©</span>
              </h1>
              <h1 className="text-[12vw] leading-[0.8] font-light tracking-tighter text-[#2A1818] mr-12 md:mr-24 shrink-0 flex items-center">
                livv <RevealText text="services" className="text-gradient-gold ml-4 mr-4" isVisible={isVisible} delay={200} /><span className="text-gradient-gold align-top text-[4vw]">©</span>
              </h1>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-16">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative flex flex-col h-[500px] md:h-[650px] overflow-hidden rounded-[10px] cursor-pointer transition-transform duration-500 hover:-translate-y-2"
              >
                {/* Image Area */}
                <div className={`flex-grow w-full ${service.color} relative`}>
                  {service.bgImage ? (
                    <img
                      src={service.bgImage}
                      className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${service.imageClass}`}
                      alt={typeof service.title === 'string' ? service.title : "Service Image"}
                    />
                  ) : (
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black/10 to-transparent" />
                  )}

                  {/* Hover Label Overlay */}
                  <div className="absolute top-6 left-6 right-6 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                    <span className="text-white text-base md:text-lg font-light tracking-[0.2em] uppercase">
                      {service.hoverLabel}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className={`${service.cardBg} p-5 text-white min-h-[160px] flex flex-col justify-between relative`}>
                  {/* Gradient line top */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C4A35A] to-transparent opacity-60" />

                  <div className="mt-2">
                    <h3 className={`text-2xl font-medium leading-tight mb-3 tracking-tight ${service.textColor}`}>
                      {service.title}
                    </h3>
                    <p className="text-sm text-white/70 font-light leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <button className="group relative px-8 py-3 bg-[#F5F5F0] rounded-full flex items-center space-x-3 transition-all duration-300 hover:bg-[#E8E4DC] hover:scale-105 border border-[#E8E4DC]">
              <span className="w-8 h-8 rounded-full bg-[#2A1818] flex items-center justify-center text-[#C4A35A] group-hover:bg-[#C4A35A] group-hover:text-[#2A1818] transition-colors duration-300">
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
              </span>
              <span className="text-[#2A1818] text-sm font-medium tracking-wide uppercase">
                Get in touch
              </span>
            </button>
          </div>

          {/* Section Footer - Grid Consistency */}


        </div>
      </div>
    </section>
  )
}
