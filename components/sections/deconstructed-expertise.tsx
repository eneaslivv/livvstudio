"use client"

import React, { useEffect, useRef } from "react"
import { LayoutGrid, Cpu, Image as ImageIcon, Check, Sparkles } from "lucide-react"
import { inter } from "@/app/fonts"

export const DeconstructedExpertise = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const rotatorRef = useRef<HTMLDivElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const scrollHintRef = useRef<HTMLDivElement>(null)
    const cardsRef = useRef<HTMLDivElement[]>([])

    useEffect(() => {
        const rotator = rotatorRef.current
        const header = headerRef.current
        const scrollHint = scrollHintRef.current
        const cards = cardsRef.current.filter(Boolean)
        const container = containerRef.current

        if (!rotator || !container) return

        const initialRotateY = -25
        const initialRotateX = 10
        let currentScrollProgress = 0
        let mouseX = 0
        let mouseY = 0
        let targetRotateX = initialRotateX
        let targetRotateY = initialRotateY
        let animationFrameId: number | null = null

        const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3)

        // Smooth interpolation for mouse movement
        const lerp = (start: number, end: number, factor: number) => {
            return start + (end - start) * factor
        }

        let exitProgressValue = 0

        const updateTransform = () => {
            const scrollRotY = initialRotateY * (1 - currentScrollProgress)
            const scrollRotX = initialRotateX * (1 - currentScrollProgress)
            const dampen = 1 - currentScrollProgress
            // Reduced sensitivity from 10 to 3 for subtle premium feel
            const mouseEffectX = (mouseY * 3) * dampen
            const mouseEffectY = (mouseX * 3) * dampen

            // Smooth interpolation with inverted X for natural physics
            targetRotateX = scrollRotX + mouseEffectX // Inverted: moving up tilts away
            targetRotateY = scrollRotY + mouseEffectY

            // Add exit scale transition
            const exitScale = 1 - (exitProgressValue * 0.05)
            rotator.style.opacity = String(1 - exitProgressValue)
            rotator.style.transform = `rotateY(${targetRotateY}deg) rotateX(${targetRotateX}deg) scale(${exitScale})`
        }

        const handleScroll = () => {
            const containerRect = container.getBoundingClientRect()
            const scrollY = -containerRect.top
            const windowHeight = window.innerHeight

            let rawProgress = Math.min(Math.max(scrollY / (windowHeight * 1.2), 0), 1)
            currentScrollProgress = easeOutCubic(rawProgress)

            // Calculate exit progress for a smoother transition out of the section
            const exitStart = windowHeight * 1.2
            const exitRange = windowHeight * 0.3
            exitProgressValue = Math.min(Math.max((scrollY - exitStart) / exitRange, 0), 1)

            const isMobile = window.innerWidth < 768
            const startMargin = isMobile ? -180 : -140
            const endMargin = isMobile ? 10 : 24
            const currentMargin = startMargin + (endMargin - startMargin) * currentScrollProgress

            cards.forEach((card, index) => {
                if (index < cards.length - 1) {
                    card.style.marginRight = `${currentMargin}px`
                }
                // Use CSS custom property instead of direct transform to avoid conflicting with hover
                // Increased depth from 5 to 15 for better 3D layering
                const zValue = index * 15 * (1 - currentScrollProgress)
                card.style.setProperty('--card-z', `${zValue}px`)
            })

            if (header) {
                header.style.opacity = String(Math.max(1 - rawProgress * 2, 0))
                header.style.transform = `translateY(-${rawProgress * 50}px) scale(${1 - rawProgress * 0.1})`
            }

            if (scrollHint) {
                scrollHint.style.opacity = String(Math.max(1 - rawProgress * 3, 0))
            }

            updateTransform()
        }

        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1
            const y = (e.clientY / window.innerHeight) * 2 - 1

            mouseX = x
            mouseY = y

            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId)
            }

            animationFrameId = requestAnimationFrame(updateTransform)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        document.addEventListener('mousemove', handleMouseMove)
        handleScroll()

        return () => {
            window.removeEventListener('scroll', handleScroll)
            document.removeEventListener('mousemove', handleMouseMove)
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId)
            }
        }
    }, [])

    const setCardRef = (index: number) => (el: HTMLDivElement | null) => {
        if (el) cardsRef.current[index] = el
    }

    return (
        <div ref={containerRef} className={`relative h-[220vh] bg-[#FDFBF7] ${inter.className}`}>
            <main className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">

                {/* Dynamic Background */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-zinc-200/50 to-transparent rounded-full blur-[100px] opacity-50"></div>
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-emerald-500/5 to-transparent rounded-full blur-[80px] opacity-30"></div>
                </div>

                {/* Header */}
                <div ref={headerRef} className="text-center mb-16 px-4 z-10 transition-opacity duration-500 origin-bottom">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E8E4DC] mb-6 shadow-sm hover:shadow-md transition-shadow cursor-default">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#171717] animate-pulse"></span>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#5A3E3E]/60">System Mechanics</span>
                    </div>
                    <h2 className="section-heading text-[#2C0405] mb-6 cursor-default">
                        Inside the <span className="text-[#C18972]">Process</span>
                    </h2>
                    <p className="text-sm font-medium text-[#5A3E3E]/80 max-w-md mx-auto leading-relaxed">
                        Every pixel is engineered. Hover to inspect the layers of our craft.
                    </p>
                </div>

                {/* 3D Transform Container */}
                <div className="relative w-full max-w-7xl flex items-center justify-center perspective-container z-20 h-[500px] group">

                    {/* Inner Rotator */}
                    <div
                        ref={rotatorRef}
                        className="flex items-center justify-center hardware-accel origin-center transition-transform duration-100 ease-out"
                        style={{ transform: 'rotateY(-25deg) rotateX(10deg)', transformStyle: 'preserve-3d' }}
                    >

                        {/* CARD 1: Wireframe */}
                        <div
                            ref={setCardRef(0)}
                            className="card-transition relative w-60 h-80 md:w-64 md:h-96 rounded-2xl glass-panel flex-shrink-0 z-10 hardware-accel origin-center shadow-xl cursor-pointer hover:!opacity-100 hover:bg-white/90 group-hover:opacity-40"
                            style={{ marginRight: '-140px' }}
                        >
                            <div className="absolute inset-0 p-6 flex flex-col justify-between opacity-60 hover:opacity-100 transition-opacity duration-300">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-semibold text-[#5A3E3E]/60 uppercase tracking-widest">L-01</span>
                                    <LayoutGrid className="w-4 h-4 text-[#5A3E3E]/60" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-[#2C0405] tracking-tight">Wireframe</h3>
                                    <p className="text-xs text-[#5A3E3E]/60 mt-1">Structural foundation.</p>
                                </div>
                                <div className="space-y-2 opacity-50">
                                    <div className="h-1.5 w-full bg-zinc-300 rounded-full"></div>
                                    <div className="h-1.5 w-2/3 bg-zinc-300 rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* CARD 2: Logic */}
                        <div
                            ref={setCardRef(1)}
                            className="card-transition relative w-60 h-80 md:w-64 md:h-96 rounded-2xl glass-panel flex-shrink-0 z-20 hardware-accel origin-center shadow-xl bg-white/40 cursor-pointer hover:!opacity-100 hover:bg-white/90 group-hover:opacity-40"
                            style={{ marginRight: '-140px' }}
                        >
                            <div className="absolute inset-0 p-6 flex flex-col">
                                <span className="text-[10px] font-semibold text-[#5A3E3E]/60 uppercase tracking-widest mb-4">L-02</span>
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="relative w-24 h-24 hover:scale-110 transition-transform duration-500">
                                        <div className="absolute inset-0 border border-[#2C0405]/20 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
                                        <div className="absolute inset-4 border border-[#2C0405]/30 rounded-full border-dashed animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }}></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Cpu className="w-6 h-6 text-[#2C0405]" />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-lg font-medium text-[#2C0405] tracking-tight">Logic</h3>
                                </div>
                            </div>
                        </div>

                        {/* CARD 3: Assets */}
                        <div
                            ref={setCardRef(2)}
                            className="card-transition relative w-60 h-80 md:w-64 md:h-96 rounded-2xl glass-panel flex-shrink-0 z-30 hardware-accel origin-center shadow-xl overflow-hidden bg-white/60 cursor-pointer hover:!opacity-100 hover:bg-white/95 group-hover:opacity-40"
                            style={{ marginRight: '-140px' }}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/20 rounded-full blur-[40px]"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/20 rounded-full blur-[40px]"></div>

                            <div className="absolute inset-0 p-6 flex flex-col">
                                <div className="flex justify-between items-start mb-6">
                                    <span className="text-[10px] font-semibold text-[#5A3E3E]/60 uppercase tracking-widest">L-03</span>
                                    <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">
                                        <ImageIcon className="w-3.5 h-3.5 text-[#5A3E3E]" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 flex-1 content-center opacity-80">
                                    <div className="aspect-square rounded-lg bg-gradient-to-br from-[#FDFBF7] to-[#F5F2EB] border border-white"></div>
                                    <div className="aspect-square rounded-lg bg-gradient-to-br from-[#FDFBF7] to-[#F5F2EB] border border-white"></div>
                                    <div className="aspect-square rounded-lg bg-gradient-to-br from-[#FDFBF7] to-[#F5F2EB] border border-white"></div>
                                    <div className="aspect-square rounded-lg bg-gradient-to-br from-[#FDFBF7] to-[#F5F2EB] border border-white flex items-center justify-center">
                                        <span className="text-[10px] text-[#5A3E3E]/60">+12</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CARD 4: Data */}
                        <div
                            ref={setCardRef(3)}
                            className="card-transition relative w-60 h-80 md:w-64 md:h-96 rounded-2xl bg-white border border-zinc-100 flex-shrink-0 z-40 hardware-accel origin-center shadow-2xl cursor-pointer hover:!opacity-100 group-hover:opacity-40"
                            style={{ marginRight: '-140px' }}
                        >
                            <div className="absolute inset-0 p-6 flex flex-col justify-between">
                                <div>
                                    <span className="text-[10px] font-semibold text-[#5A3E3E]/60 uppercase tracking-widest">L-04</span>
                                    <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter text-[#2C0405] mt-4 group-hover:text-[#C18972] transition-colors">98.2<span className="text-[#5A3E3E]/30">%</span></h2>
                                </div>

                                <div className="relative h-32 w-full mt-4">
                                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                        <path d="M0,80 C20,70 40,90 60,60 C80,30 100,50 120,40 C140,30 160,10 180,20 C200,30 220,10 240,5" fill="none" stroke="#2C0405" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                                    </svg>
                                    <div className="absolute top-0 right-0 px-2 py-1 bg-[#2C0405] text-[#FDFBF7] text-[10px] rounded">Live</div>
                                </div>
                            </div>
                        </div>

                        {/* CARD 5: Result */}
                        <div
                            ref={setCardRef(4)}
                            className="card-transition relative w-60 h-80 md:w-64 md:h-96 rounded-2xl bg-[#F5F2EB] border border-white/50 flex-shrink-0 z-50 hardware-accel origin-center shadow-2xl p-2 cursor-pointer hover:!opacity-100 group-hover:opacity-40"
                        >
                            <div className="w-full h-full bg-white rounded-xl overflow-hidden relative border border-[#E6E2D8]">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.1),transparent)]"></div>

                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="relative w-28 h-36 shadow-xl transition-transform duration-700 hover:[transform:rotateY(180deg)] preserve-3d">
                                        {/* Front */}
                                        <div className="absolute inset-0 bg-[#2C0405] rounded-[2px] flex flex-col items-center justify-center gap-2 backface-hidden z-10">
                                            <div className="w-8 h-8 rounded-full bg-[#3a0a0b] flex items-center justify-center border border-[#4d1011]">
                                                <Check className="w-4 h-4 text-[#C18972] stroke-[3]" />
                                            </div>
                                            <span className="text-[10px] text-[#A8A29A] font-medium">Complete</span>
                                        </div>
                                        {/* Back */}
                                        <div className="absolute inset-0 bg-[#C18972] rounded-[2px] flex flex-col items-center justify-center gap-2 backface-hidden" style={{ transform: 'rotateY(180deg)' }}>
                                            <Sparkles className="w-6 h-6 text-[#2C0405]" />
                                            <span className="text-[10px] text-[#2C0405] font-medium">Ready</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute bottom-4 left-0 right-0 text-center">
                                    <span className="text-xs font-semibold text-[#2C0405]">Final Output</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Scroll Hint */}
                <div ref={scrollHintRef} className="absolute bottom-8 transition-opacity duration-300">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-[10px] font-medium text-[#5A3E3E]/50 uppercase tracking-widest">Scroll to Align</span>
                        <div className="w-[1px] h-8 bg-[#E6E2D8] rounded-full overflow-hidden">
                            <div className="w-full h-1/2 bg-[#2C0405] animate-drop"></div>
                        </div>
                    </div>
                </div>

            </main >
        </div >
    )
}
