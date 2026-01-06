"use client"

import { Shader, ChromaFlow, Swirl } from "shaders/react"
import { useRef, useEffect, useState } from "react"
import { ArrowRight, Menu } from "lucide-react"
import { CustomMouse } from "@/components/custom-mouse"
import { BusinessArtSection } from "@/components/sections/business-art-section"
import { ScrollingTextSection } from "@/components/sections/scrolling-text-section"
import { ServicesSection } from "@/components/sections/services-section"
import { WorkModelSection } from "@/components/sections/work-model-section"
import { PartnerInfrastructureSection } from "@/components/sections/partner-infrastructure-section"


import { LogoGridSection } from "@/components/sections/logo-grid-section"
import { PortfolioSection } from "@/components/sections/portfolio-section"
import { SphereSection } from "@/components/sections/sphere-section"
import { PricingSection } from "@/components/sections/pricing-section"
import { AnalyticsSection } from "@/components/sections/analytics-section"
import { WorkSection } from "@/components/sections/work-section"
import { AboutSection } from "@/components/sections/about-section"

import { ImageSliderSection } from "@/components/sections/image-slider-section"
import { VisionSection } from "@/components/sections/vision-section"
import { FooterSection } from "@/components/sections/footer-section"

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isButtonHovered, setIsButtonHovered] = useState(false)
  const shaderContainerRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [smoothMousePos, setSmoothMousePos] = useState({ x: 0, y: 0 })
  const frameRef = useRef<HTMLDivElement>(null)
  const [time, setTime] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const checkShaderReady = () => {
      if (shaderContainerRef.current) {
        const canvas = shaderContainerRef.current.querySelector("canvas")
        if (canvas && canvas.width > 0 && canvas.height > 0) {
          setIsLoaded(true)
          return true
        }
      }
      return false
    }

    if (checkShaderReady()) return

    const intervalId = setInterval(() => {
      if (checkShaderReady()) {
        clearInterval(intervalId)
      }
    }, 100)

    const fallbackTimer = setTimeout(() => {
      setIsLoaded(true)
    }, 1500)

    return () => {
      clearInterval(intervalId)
      clearTimeout(fallbackTimer)
    }
  }, [])

  useEffect(() => {
    let animationFrame: number
    const animate = () => {
      setTime((prev) => prev + 0.01)
      animationFrame = requestAnimationFrame(animate)
    }
    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (frameRef.current) {
        const rect = frameRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        setMousePos({ x, y })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor

    const smoothInterval = setInterval(() => {
      setSmoothMousePos((prev) => ({
        x: lerp(prev.x, mousePos.x, 0.05),
        y: lerp(prev.y, mousePos.y, 0.05),
      }))
    }, 16)

    return () => clearInterval(smoothInterval)
  }, [mousePos])

  const waveX = Math.sin(time * 0.5) * 10 + smoothMousePos.x * 25
  const waveY = Math.cos(time * 0.45) * 10 + smoothMousePos.y * 25
  const waveRotate = Math.sin(time * 0.3) * 0.8
  const waveScale = 1.1 + Math.sin(time * 0.5) * 0.025
  const waveSkewX = Math.sin(time * 0.35) * 0.5 + smoothMousePos.x * 2
  const waveSkewY = Math.cos(time * 0.4) * 0.3 + smoothMousePos.y * 1.5

  return (
    <div className="min-h-screen w-full bg-[#FFFFFF] cursor-none overflow-x-hidden">
      <CustomMouse />

      {/* FIXED NAVBAR - Moved outside of Hero flow to remain visible */}
      <nav className={`fixed left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ease-out ${isScrolled ? "top-4 w-[95%] md:w-auto scale-95" : "top-6 w-auto max-w-[90%] scale-100"}`}>
        <div className={`backdrop-blur-3xl border rounded-full px-2 py-1 pl-5 flex items-center justify-between gap-6 md:gap-10 shadow-2xl transition-all duration-500 ${isScrolled ? "bg-black/40 border-white/10 shadow-black/20" : "bg-black/15 border-white/20 shadow-black/10"}`}>
          {/* Logo Area */}
          <div
            className={`pr-1 transition-all duration-800 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
          >
            <div className="flex items-center">
              <img
                src="/assets/logo-new.png"
                alt="Livv Logo"
                className="h-7 md:h-9 w-auto object-contain brightness-0 invert"
              />
            </div>
          </div>

          <div
            className={`hidden md:flex items-center gap-8 text-[13px] font-medium text-white/90 transition-all duration-800 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
            style={{ transitionDelay: "100ms" }}
          >
            <a href="#home" className="relative hover:text-white transition-colors group py-1 flex items-center gap-1.5">
              <span className="text-[10px] text-white/50 font-normal">01</span>
              <span>Home</span>
              <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-white/80 group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#about" className="relative hover:text-white transition-colors group py-1 flex items-center gap-1.5">
              <span className="text-[10px] text-white/50 font-normal">02</span>
              <span>About</span>
              <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-white/80 group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#work" className="relative hover:text-white transition-colors group py-1 flex items-center gap-1.5">
              <span className="text-[10px] text-white/50 font-normal">03</span>
              <span>Work</span>
              <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-white/80 group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#blog" className="relative hover:text-white transition-colors group py-1 flex items-center gap-1.5">
              <span className="text-[10px] text-white/50 font-normal">04</span>
              <span>Blog</span>
              <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-white/80 group-hover:w-full transition-all duration-300" />
            </a>
          </div>

          {/* Mobile Menu Icon */}
          <div
            className={`md:hidden text-white px-2 transition-all duration-800 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
          >
            <Menu className="w-5 h-5" />
          </div>

          <a
            href="#contact"
            className={`relative bg-white text-[#1a1a1a] rounded-full pl-0.5 md:pl-4 pr-0.5 py-0.5 flex items-center gap-2 transition-all duration-500 ease-out group ml-1 overflow-hidden hover:bg-white/90 border border-white/40 shadow-md ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"}`}
            style={{ transitionDelay: "500ms", transitionDuration: "800ms" }}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            {/* Shimmer effect */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.05), transparent)",
                transform: isButtonHovered ? "translateX(100%)" : "translateX(-100%)",
                transition: "transform 0.8s ease-in-out",
              }}
            />

            <span className="hidden md:block text-[13px] font-medium tracking-wide relative z-10 transition-all duration-300 group-hover:tracking-wider">
              Get in touch
            </span>

            <div className="relative bg-[#1a1a1a] group-hover:bg-[#1a1a1a]/80 text-white rounded-full p-2 flex items-center justify-center w-7 h-7 overflow-hidden transition-all duration-500 ease-out group-hover:scale-110 border border-transparent group-hover:border-white/30">
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: "conic-gradient(from 0deg, #E8BC59, #769268, #6DBEDC, #E8BC59)",
                  animation: isButtonHovered ? "spin 2s linear infinite" : "none",
                }}
              />
              <div className="absolute inset-[2px] bg-[#1a1a1a] group-hover:bg-white/20 rounded-full z-10 transition-all duration-500" />
              <ArrowRight
                className="w-3.5 h-3.5 relative z-20 transition-all duration-300 ease-out group-hover:translate-x-[2px]"
                style={{
                  animation: isButtonHovered ? "arrowBounce 0.6s ease-in-out infinite" : "none",
                }}
              />
            </div>
          </a>
        </div>
      </nav>

      {/* Top Right Notification Badge - Fixed position */}
      <div
        className={`fixed top-8 right-8 z-[90] hidden xl:flex items-center pointer-events-none transition-all duration-800 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
        style={{ transitionDelay: "500ms" }}
      >
        <div className="bg-white/90 backdrop-blur-xl rounded-full px-1 py-1 pr-4 flex items-center gap-3 border border-white/50 shadow-lg pointer-events-auto">
          <span className="bg-[#E8BC59] text-[#1a1a1a] text-xs font-semibold px-2.5 py-1 rounded-full">New</span>
          <span className="text-xs font-medium tracking-wide text-gray-800">Livv client management app</span>
        </div>
      </div>

      {/* Hero Section */}
      <section id="home" className="h-auto w-full p-4 sm:p-6 pt-8 pb-4 md:pb-8 flex items-start justify-center">
        {/* Frame Container */}
        <div
          ref={frameRef}
          className="relative w-full h-[80vh] max-w-[1800px] rounded-[2.5rem] overflow-hidden bg-white shadow-sm isolate"
        >
          {/* Independent Border Layer */}
          <div className="absolute inset-0 z-50 rounded-[2.5rem] border-[3px] border-[#1a1a1a] pointer-events-none" />

          <div
            className={`absolute inset-[-60px] z-0 transition-all duration-[2s] ease-out ${isLoaded ? "opacity-100" : "opacity-0"}`}
            style={{
              transform: `
                translate3d(${waveX}px, ${waveY}px, 0) 
                rotate(${waveRotate}deg) 
                scale(${isLoaded ? waveScale : 1.15})
                skew(${waveSkewX}deg, ${waveSkewY}deg)
              `,
              willChange: "transform",
            }}
          >
            <img
              src="/images/gemini-generated-image-ndf416ndf416ndf4.png"
              alt="Background"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Vignette overlay */}
          <div
            className={`absolute inset-0 z-[2] pointer-events-none transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}
            style={{
              background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.15) 100%)",
              transitionDelay: "300ms",
            }}
          />

          <div className="absolute inset-0 z-[3] bg-black/10 pointer-events-none" />

          <div
            ref={shaderContainerRef}
            className={`absolute inset-0 z-[1] pointer-events-none transition-opacity duration-1000 ${isLoaded ? "opacity-70" : "opacity-0"}`}
            style={{ contain: "strict", mixBlendMode: "overlay" }}
          >
            <Shader className="h-full w-full">
              <Swirl
                colorA="#769268"
                colorB="#E8BC59"
                speed={1.0}
                detail={1.5}
                blend={70}
                coarseX={60}
                coarseY={60}
                mediumX={50}
                mediumY={50}
                fineX={40}
                fineY={40}
              />
              <ChromaFlow
                baseColor="#FFFFFF"
                upColor="#6DBEDC"
                downColor="#FFFFFF"
                leftColor="#769268"
                rightColor="#E8BC59"
                intensity={1.4}
                radius={3.0}
                momentum={35}
                maskType="alpha"
                opacity={0.98}
              />
            </Shader>
          </div>

          {/* Top Right Notification Badge */}




          {/* Main Hero Content */}
          <div className="relative z-10 flex flex-col items-center justify-start h-full text-center px-4 pt-32 md:pt-40">
            <h1 className="text-2xl md:text-4xl lg:text-5xl leading-tight md:leading-none font-light tracking-[-0.08em] max-w-4xl mx-auto text-gray-100 flex flex-col items-center">
              {/* Line 1 */}
              <span className="block overflow-hidden pb-1">
                <span
                  className={`block text-white transition-all duration-1000 ease-[cubic-bezier(0.2,0.65,0.3,0.9)] ${isLoaded ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-full blur-lg"}`}
                  style={{ transitionDelay: "200ms" }}
                >
                  We Build Digital Products
                </span>
              </span>

              {/* Line 2 */}
              <span className="block overflow-hidden pb-1">
                <span
                  className={`block text-white transition-all duration-1000 ease-[cubic-bezier(0.2,0.65,0.3,0.9)] ${isLoaded ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-full blur-lg"}`}
                  style={{ transitionDelay: "350ms" }}
                >
                  that Feel Like Art
                </span>
              </span>

              {/* Line 3 */}
              <span className="block overflow-hidden pb-1">
                <span
                  className={`block text-white transition-all duration-1000 ease-[cubic-bezier(0.2,0.65,0.3,0.9)] ${isLoaded ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-full blur-lg"}`}
                  style={{ transitionDelay: "500ms" }}
                >
                  and Perform Like Engines.
                </span>
              </span>
            </h1>

            <p
              className={`mt-8 text-sm md:text-base text-white max-w-2xl mx-auto font-light leading-relaxed transition-all duration-800 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
              style={{ transitionDelay: "500ms" }}
            >
              The white-label creative partner for agencies, startups and ecommerce sites. We merge aesthetic design, motion storytelling, and state of the art development strategies to turn your ideas into scalable businesses.
            </p>

            <div
              className={`mt-10 flex flex-wrap justify-center gap-4 transition-all duration-800 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
              style={{ transitionDelay: "500ms" }}
            >
              <button className="px-8 py-3 rounded-full bg-white text-[#1a1a1a] text-sm md:text-base font-medium tracking-wide shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                See the Work
              </button>
              <button className="px-8 py-3 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 text-sm md:text-base font-medium tracking-wide shadow-xl hover:shadow-2xl hover:bg-white/20 hover:scale-105 transition-all duration-300">
                Audit Infrastructure
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Video Section */}
      <AnalyticsSection />

      {/* Business Art Section - "Where Business Meets Art" */}
      <BusinessArtSection />

      <WorkModelSection />

      <ServicesSection />

      {/* Selected Work / Portfolio Section */}
      <PortfolioSection />

      {/* Logo Grid Section */}
      <LogoGridSection />

      {/* Pricing Section */}
      <PricingSection id="blog" />


      {/* Work/Projects Section */}
      <WorkSection id="work" />





      {/* About Section */}
      <AboutSection id="about" />



      {/* Image Slider "Final" Section */}
      <ImageSliderSection />

      {/* Vision "Measurable Things" Section */}
      <VisionSection />

      {/* Footer Section */}
      <FooterSection id="contact" />

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes arrowBounce {
          0%, 100% { transform: translateX(2px) scale(1.1); }
          50% { transform: translateX(5px) scale(1.1); }
        }
      `}</style>
    </div>
  )
}

