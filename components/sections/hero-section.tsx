"use client"

import dynamic from "next/dynamic"
import { CSSProperties, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { CustomMouse } from "@/components/custom-mouse"
import { Navbar } from "@/components/layout/navbar"
import { AwardLogo } from "@/components/ui/award-logo"

const Shader = dynamic(() => import("shaders/react").then((mod) => mod.Shader), { ssr: false })
const Swirl = dynamic(() => import("shaders/react").then((mod) => mod.Swirl), { ssr: false })
const ChromaFlow = dynamic(() => import("shaders/react").then((mod) => mod.ChromaFlow), { ssr: false })

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)
  const shaderContainerRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const frameVars: CSSProperties & Record<string, string | number> = {
    WebkitMaskImage: "radial-gradient(white, black)",
    "--mx": 0,
    "--my": 0,
    "--rotate": "0deg",
    "--scale": "1.1",
  }

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
    let time = 0

    const animate = () => {
      time += 0.01
      if (frameRef.current) {
        const waveRotate = Math.sin(time * 0.3) * 0.8
        const waveScale = 1.1 + Math.sin(time * 0.5) * 0.025

        frameRef.current.style.setProperty("--rotate", `${waveRotate}deg`)
        frameRef.current.style.setProperty("--scale", waveScale.toString())
      }
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

        frameRef.current.style.setProperty("--mx", x.toString())
        frameRef.current.style.setProperty("--my", y.toString())
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <>
      <CustomMouse />
      <Navbar isLoaded={isLoaded} />

      <div
        className={`fixed top-6 right-6 z-[90] hidden xl:flex items-center pointer-events-none transition-all duration-800 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
        style={{ transitionDelay: "500ms" }}
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-full px-4 py-1.5 pr-5 flex items-center gap-3 border border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.08)] pointer-events-auto">
          <span className="bg-[#E8BC59] text-[#1a1a1a] text-[10px] font-semibold px-3 py-1 rounded-full tracking-[0.2em] uppercase">New</span>
          <span className="text-[10px] font-medium tracking-[0.25em] text-gray-900 leading-none">Livv client management app</span>
        </div>
      </div>

      <section id="home" className="h-auto w-full p-4 sm:p-6 pt-2 pb-4 md:pb-8 flex items-start justify-center">
        <div
          ref={frameRef}
          className="relative w-full h-[80vh] max-w-[1800px] rounded-[2.5rem] overflow-hidden bg-white shadow-sm isolate transform-gpu"
          style={frameVars}
        >
          <div className="absolute inset-0 z-50 rounded-[2.5rem] border-[3px] border-[#1a1a1a] pointer-events-none" />

          <div
            className={`absolute inset-[-60px] z-0 transition-opacity duration-[1.5s] ease-out transform-gpu ${isLoaded ? "opacity-100" : "opacity-0"}`}
            style={{
              transform: `
                translate3d(calc(var(--mx) * 50px), calc(var(--my) * 50px), 0) 
                rotate(var(--rotate)) 
                scale(var(--scale))
              `,
              willChange: "transform"
            }}
          >
            <Image
              src="/images/gemini-generated-image-ndf416ndf416ndf4.png"
              alt="Background"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>

          <div
            className={`absolute inset-0 z-[2] pointer-events-none transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}
            style={{
              background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.15) 100%)",
              transitionDelay: "300ms"
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

          <div className="relative z-10 flex flex-col items-center justify-start h-full text-center px-4 pt-32 md:pt-40">
            <div className="mb-6 flex justify-center">
              <AwardLogo color="#ffffff" size={92} />
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl leading-tight md:leading-none font-light tracking-[-0.08em] max-w-4xl mx-auto text-gray-100 flex flex-col items-center">
              <span className="block overflow-hidden pb-1">
                <span
                  className={`block text-white transition-all duration-1000 ease-[cubic-bezier(0.2,0.65,0.3,0.9)] ${isLoaded ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-full blur-lg"}`}
                  style={{ transitionDelay: "200ms" }}
                >
                  We Build Digital Products
                </span>
              </span>
              <span className="block overflow-hidden pb-1">
                <span
                  className={`block text-white transition-all duration-1000 ease-[cubic-bezier(0.2,0.65,0.3,0.9)] ${isLoaded ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-full blur-lg"}`}
                  style={{ transitionDelay: "350ms" }}
                >
                  that Feel Like Art
                </span>
              </span>
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
              className={`mt-10 flex flex-wrap justify-center gap-3 transition-all duration-800 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
              style={{ transitionDelay: "500ms" }}
            >
              <a href="#work" className="group px-6 py-2.5 rounded-full bg-white text-[#1a1a1a] text-sm font-medium tracking-wide hover:bg-white/90 transition-all duration-300 flex items-center gap-2">
                See the Work
                <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <a href="/contact" className="px-6 py-2.5 rounded-full bg-transparent text-white text-sm font-medium tracking-wide border border-white/30 hover:bg-white/10 hover:border-white/50 transition-all duration-300">
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
