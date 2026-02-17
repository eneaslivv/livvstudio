"use client"

import { useRef, useEffect, useState } from "react"
import { useScroll, useTransform, useSpring, motion } from "framer-motion"
import { ArrowUpRight, Instagram, Linkedin, Github } from "lucide-react"
import { AnimatedBorders } from "@/components/ui/animated-borders"
import { AwardLogo } from "@/components/ui/award-logo"

export function FooterSection({ id }: { id?: string }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const contraButtonRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"]
    })

    const rawY = useTransform(scrollYProgress, [0.4, 1], [300, 0])
    const rawOpacity = useTransform(scrollYProgress, [0.6, 1], [0, 1])

    const springConfig = { stiffness: 60, damping: 20, mass: 1 }
    const y = useSpring(rawY, springConfig)
    const opacity = useSpring(rawOpacity, springConfig)

    // Load Contra embed script
    useEffect(() => {
        const script = document.createElement('script')
        script.src = 'https://contra.com/static/embed/sdk.js'
        script.async = true
        script.charset = 'utf-8'
        document.body.appendChild(script)
        return () => {
            document.body.removeChild(script)
            if (contraButtonRef.current) {
                contraButtonRef.current.innerHTML = ''
            }
        }
    }, [])

    return (
        <section id={id} ref={containerRef} className="relative w-full min-h-[80vh] flex flex-col justify-between overflow-hidden pb-0">

            {/* Full Height Vertical Lines - Moved to Root for continuous visibility */}
            <div className="absolute inset-0 w-full max-w-7xl mx-auto px-6 md:px-12 pointer-events-none z-0">
                <AnimatedBorders className="hidden md:block" />
            </div>

            {/* Top Header Content - Replaced with Merged Contact Info & Meta */}
            <div className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-12 md:pt-24 relative z-30 flex flex-col justify-between h-full">

                {/* Main Contact Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-20 md:mb-32">
                    {/* Left Column: Title */}
                        <div className="pl-0 lg:pl-[10%]">
                            <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-[#C4A35A] font-medium mb-4">
                                Get in Touch
                            </span>
                            <h2 className="section-heading text-gradient-gold mb-6">
                                Let's work together
                            </h2>
                            <div
                                ref={contraButtonRef}
                                className="contra-hire-me-button"
                                data-analyticsuserid="451cfc1e-e897-46ed-a701-9dd0533e7ec6"
                                data-theme="light"
                                data-username="eneas_aldabe"
                            />
                            <div className="mt-6 flex items-center gap-3">
                                <AwardLogo color="#4f32ff" size={56} />
                                <div className="text-[9px] uppercase tracking-[0.4em] text-[#1a1a1a]/70">
                                    <div className="font-semibold text-[10px]">DesignRush</div>
                                    <div className="text-[8px]">Top Digital Design Agency 2026</div>
                                </div>
                            </div>
                        </div>

                    {/* Right Column: Contact Info */}
                    <div className="pr-0 lg:pr-[10%] pt-4 lg:pt-12">
                        <div className="space-y-12">
                            <p className="text-xl md:text-2xl font-light text-[#1a1a1a] leading-relaxed max-w-md">
                                Have a project in mind? We'd love to hear about it.
                            </p>

                            <div>
                                <a
                                    href="mailto:hola@livv.systems"
                                    className="group inline-flex items-center gap-2 text-2xl md:text-4xl font-light text-[#1a1a1a] hover:text-[#C4A35A] transition-colors duration-300"
                                >
                                    hola@livv.systems
                                    <ArrowUpRight className="w-6 h-6 md:w-8 md:h-8 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                                </a>
                            </div>

                            <div className="flex gap-8 pt-8">
                                <div className="space-y-4">
                                    <h4 className="text-xs uppercase tracking-widest text-[#1a1a1a]/40">Socials</h4>
                                    <div className="flex gap-4">
                                        <a href="https://www.instagram.com/p/C5-FziFN5zM/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-[#1a1a1a]/10 flex items-center justify-center text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-all duration-300 group">
                                            <Instagram className="w-4 h-4" />
                                        </a>
                                        <a href="https://www.youtube.com/@livvagency5936" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-[#1a1a1a]/10 flex items-center justify-center text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-all duration-300 group">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                                        </a>
                                        <a href="https://www.linkedin.com/company/39648193/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-[#1a1a1a]/10 flex items-center justify-center text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-all duration-300 group">
                                            <Linkedin className="w-4 h-4" />
                                        </a>
                                        <a href="https://github.com/livvstudio" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-[#1a1a1a]/10 flex items-center justify-center text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-all duration-300 group">
                                            <Github className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Bottom Meta Bar (Originally in Footer) */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-[10px] uppercase tracking-widest text-[#1a1a1a]/60 pb-12 pt-8 w-full border-t border-[#E8E4DC]">
                    <div className="flex flex-col gap-1 mb-4 md:mb-0">
                        <span>Designed by Livv</span>
                        <span>Rebuilt in Next.js</span>
                        <span>By Antigravity</span>
                    </div>

                    <div className="flex gap-8 mb-4 md:mb-0">
                        {/* Social Text Links (Optional redundancy, removing or keeping based on user pref? Keeping for now as they were in footer) */}
                        {/* Actually user said "logos... also in footer", I added the logos above. I will remove text links to avoid clutter or keep them if they fit. I'll keep them but maybe simplify. */}
                    </div>

                    <div className="flex gap-8">
                        <span>Privacy Policy</span>
                        <span className="hidden md:inline">Current Status: Online</span>
                    </div>
                </div>
            </div>

            {/* Gradient Visual - Parallax Effect */}
            <div className="relative w-full flex-1 flex items-end justify-center z-10 overflow-visible">
                <motion.div
                    style={{ y, opacity }}
                    className="w-full relative flex flex-col items-end"
                >
                    {/* Stepped Gradient Image - User Provided Asset */}
                    <div className="relative w-full h-auto flex items-end justify-center">
                        <img
                            src="/images/footer-gradient.png"
                            alt="Footer Gradient"
                            className="w-full h-auto object-cover object-bottom"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
