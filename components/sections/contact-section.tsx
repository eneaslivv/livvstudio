"use client"

import { useRef, useEffect, useState } from "react"
import { ArrowUpRight, Mail, MapPin, Instagram, Twitter, Linkedin, Github } from "lucide-react"
import { AnimatedBorders } from "@/components/ui/animated-borders"
import { RevealText } from "@/components/ui/reveal-text"

export function ContactSection() {
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
      className="relative w-full"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 pb-24 md:pt-32 md:pb-12 relative z-10">
        <AnimatedBorders className="hidden md:block" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-32">

          {/* Left Column: Title */}
          <div className="pl-[10%] lg:pl-[10%]">
            <div
              className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
            >
              <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-[#C4A35A] font-medium mb-4">
                Get in Touch
              </span>
              <h2 className="section-heading mb-8">
                <RevealText text="Let's work together" className="text-gradient-gold" isVisible={isVisible} />
              </h2>
            </div>
          </div>

          {/* Right Column: Contact Info */}
          <div className="pr-[5%] lg:pr-[10%] pt-4 lg:pt-12">
            <div
              className={`space-y-12 transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
            >
              <p className="text-xl md:text-2xl font-light text-[#1a1a1a] leading-relaxed max-w-md">
                Have a project in mind? We'd love to hear about it.
              </p>

              <div>
                <a
                  href="mailto:hello@livv.design"
                  className="group inline-flex items-center gap-2 text-2xl md:text-4xl font-light text-[#1a1a1a] hover:text-[#C4A35A] transition-colors duration-300"
                >
                  hello@livv.design
                  <ArrowUpRight className="w-6 h-6 md:w-8 md:h-8 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                </a>
              </div>

              <div className="flex gap-8 pt-8">
                <div className="space-y-4">
                  <h4 className="text-xs uppercase tracking-widest text-[#1a1a1a]/40">Socials</h4>
                  <div className="flex gap-4">
                    {[Instagram, Twitter, Linkedin, Github].map((Icon, i) => (
                      <a key={i} href="#" className="w-10 h-10 rounded-full border border-[#1a1a1a]/10 flex items-center justify-center text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-all duration-300 group">
                        <Icon className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-dashed border-[#E8E4DC] pl-[10%] pr-[10%]">
          <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 mb-4 md:mb-0">
            © 2024 Livv Design. All rights reserved.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors">Privacy Policy</a>
            <a href="#" className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors">Terms of Service</a>
          </div>
        </div>

      </div>
    </section>
  )
}
