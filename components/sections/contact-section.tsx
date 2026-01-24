"use client"

import { useRef, useEffect, useState } from "react"
import { RevealText } from "@/components/ui/reveal-text"
import { ContactForm } from "./contact-form"

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

    // Load Contra embed script
    const script = document.createElement('script')
    script.src = 'https://contra.com/static/embed/sdk.js'
    script.async = true
    script.charset = 'utf-8'
    document.body.appendChild(script)

    return () => {
        observer.disconnect()
        document.body.removeChild(script)
    }
  }, [])

  return (
    <div ref={sectionRef} className="relative">
      {/* --- Banner Section (Subtler Height) --- */}
      <div className="relative w-full h-56 md:h-64 lg:h-72 overflow-hidden rounded-3xl mb-24">
        <iframe
          src="https://player.vimeo.com/video/1157793938?background=1&autoplay=1&loop=1&muted=1&dnt=1"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          className="absolute top-1/2 left-1/2 w-full h-full z-0 opacity-40"
          style={{
            width: '100vw',
            height: '100vh',
            transform: 'translate(-50%, -50%) rotate(90deg) scale(1.5)',
          }}
          title="Background Video"
        ></iframe>
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div className="relative z-20 h-full flex flex-col justify-center items-start px-8 md:px-12 lg:px-16">
          <h1 className="text-4xl md:text-5xl font-light tracking-[-0.08em] text-white mb-4">
            Let's talk about your project
          </h1>
          <p className="text-white/60 max-w-md mb-8">
            Start a conversation to create something amazing together. Fill out the form or send us an email.
          </p>
        </div>
      </div>

      {/* --- Form Section --- */}
      <div className="relative z-20 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-96 px-6 md:px-12">
        <div className="pl-[10%] lg:pl-[10%]">
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-[#C4A35A] font-medium mb-4">
              Contact Form
            </span>
            <h2 className="section-heading mb-8">
              <RevealText text="Send your details" className="text-gradient-gold" isVisible={isVisible} />
            </h2>
            <div className="space-y-4">
                <p className="text-sm text-white/60">
                    Olivos, Buenos Aires, Argentina
                </p>
                <div
                    className="contra-hire-me-button"
                    data-analyticsuserid="451cfc1e-e897-46ed-a701-9dd0533e7ec6"
                    data-theme="dark"
                    data-username="eneas_aldabe"
                 />
            </div>
          </div>
        </div>
        <div className="pr-[5%] lg:pr-[10%]">
          <div
            className={`transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
          >
            <ContactForm />
          </div>
        </div>
      </div>

      {/* --- Footer Bottom --- */}
      <div className="relative z-20 flex flex-col md:flex-row justify-between items-center pt-8 pb-32 border-t border-dashed border-white/20 px-6 md:px-12">
        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-4 md:mb-0">
          © 2026 Livv Design. All rights reserved.
        </p>
        <div className="flex gap-8">
          <a href="#" className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  )
}
