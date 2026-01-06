"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Menu } from "lucide-react"

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isButtonHovered, setIsButtonHovered] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <nav className={`fixed left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ease-out ${isScrolled ? "top-6 w-[95%] md:w-auto scale-95" : "top-8 w-auto max-w-[90%] scale-100"}`}>
            <div className={`backdrop-blur-3xl border rounded-full px-2 py-1.5 pl-5 flex items-center justify-between gap-6 md:gap-10 shadow-2xl transition-all duration-500 ${isScrolled ? "bg-black/40 border-white/10 shadow-black/20" : "bg-black/15 border-white/20 shadow-black/10"}`}>
                {/* Logo Area */}
                <div className="pr-1 transition-all duration-800 opacity-100 translate-y-0">
                    <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                        <svg viewBox="0 0 50 20" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="text-white w-full h-full p-4">
                            <path d="M2 10 Q 12 20 22 10 T 42 10" />
                        </svg>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-white/90 transition-all duration-800 opacity-100 translate-y-0">
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
                <div className="md:hidden text-white px-2 transition-all duration-800 opacity-100 translate-y-0">
                    <Menu className="w-5 h-5" />
                </div>

                <a
                    href="#contact"
                    className="relative bg-white text-[#1a1a1a] rounded-full pl-4 pr-1 py-1 flex items-center gap-2 transition-all duration-500 ease-out group ml-1 overflow-hidden hover:bg-white/90 border border-white/40 shadow-md opacity-100 translate-y-0"
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

                    <span className="text-[13px] font-medium tracking-wide relative z-10 transition-all duration-300 group-hover:tracking-wider">
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
    )
}
