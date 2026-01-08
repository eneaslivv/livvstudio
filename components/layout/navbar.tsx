"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Menu, X, ChevronDown } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface NavbarProps {
    isLoaded?: boolean
    theme?: "light" | "dark"
}

export function Navbar({ isLoaded = true, theme = "dark" }: NavbarProps) {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isButtonHovered, setIsButtonHovered] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isServicesOpen, setIsServicesOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false)
        setIsServicesOpen(false)
    }, [pathname])

    const getLink = (id: string) => {
        if (pathname === "/") return `#${id}`
        return `/#${id}`
    }

    const handleMobileNavClick = () => {
        setIsMobileMenuOpen(false)
    }

    const isLightPage = theme === "light"

    const navItems = [
        { id: "home", label: "Home", num: "01" },
        { id: "about", label: "About", num: "02" },
        { id: "work", label: "Work", num: "03" },
        { id: "services", label: "Services", num: "04", hasDropdown: true },
    ]

    const serviceItems = [
        { label: "Creative Engineering", desc: "React / Flutter / Native" },
        { label: "Product Strategy & UI", desc: "Business Logic / Design" },
        { label: "Motion & Narrative", desc: "3D / WebGL / Storytelling" },
    ]

    return (
        <>
            <nav className={`fixed left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ease-out ${isScrolled ? "top-4 w-[92%] md:w-auto scale-95" : "top-8 w-[92%] md:w-auto scale-100"}`}>
                <div className={`backdrop-blur-3xl border rounded-full px-3 py-1.5 pl-4 flex items-center justify-between gap-4 md:gap-10 shadow-2xl transition-all duration-500 ${isScrolled
                    ? isLightPage ? "bg-white/80 border-black/10 shadow-black/5" : "bg-black/40 border-white/10 shadow-black/20"
                    : isLightPage ? "bg-white/40 border-black/10 shadow-black/5" : "bg-black/15 border-white/20 shadow-black/10"
                    }`}>
                    {/* Logo Area */}
                    <div className={`transition-all duration-800 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
                        <Link href="/" className="flex items-center">
                            <img
                                src="/assets/logo-new.png"
                                alt="Livv Logo"
                                className={`h-6 md:h-9 w-auto object-contain ${!isLightPage ? "brightness-0 invert" : ""}`}
                            />
                        </Link>
                    </div>

                    {/* Desktop Nav Links */}
                    <div className={`hidden md:flex items-center gap-8 text-[13px] font-medium transition-all duration-800 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"} ${isLightPage ? "text-black/80" : "text-white/90"}`} style={{ transitionDelay: "100ms" }}>
                        {navItems.map((item) => (
                            <div
                                key={item.id}
                                className="relative group"
                                onMouseEnter={() => item.hasDropdown && setIsServicesOpen(true)}
                                onMouseLeave={() => item.hasDropdown && setIsServicesOpen(false)}
                            >
                                <a href={getLink(item.id)} className={`relative hover:opacity-100 transition-opacity group py-1 flex items-center gap-1.5 ${isLightPage ? "opacity-60 hover:text-black" : "opacity-90 hover:text-white"}`}>
                                    <span className="text-[10px] opacity-50 font-normal">{item.num}</span>
                                    <span>{item.label}</span>
                                    {item.hasDropdown && <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isServicesOpen ? "rotate-180" : ""}`} />}
                                    <span className={`absolute -bottom-0.5 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full ${isLightPage ? "bg-black/80" : "bg-white/80"}`} />
                                </a>

                                {/* Dropdown */}
                                <AnimatePresence>
                                    {item.hasDropdown && isServicesOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className={`absolute top-full left-1/2 -translate-x-1/2 pt-6 w-64`}
                                        >
                                            <div className={`p-1.5 rounded-2xl backdrop-blur-xl border shadow-xl overflow-hidden ${isLightPage ? "bg-white/90 border-black/5" : "bg-[#1a1a1a]/90 border-white/10"}`}>
                                                {serviceItems.map((service, idx) => (
                                                    <a
                                                        key={idx}
                                                        href={getLink("services")} // Link to services section
                                                        className={`block p-3 rounded-xl transition-all duration-300 group/item ${isLightPage ? "hover:bg-black/5" : "hover:bg-white/5"}`}
                                                    >
                                                        <div className={`text-sm font-medium mb-0.5 ${isLightPage ? "text-black" : "text-white"}`}>{service.label}</div>
                                                        <div className={`text-[10px] ${isLightPage ? "text-black/50" : "text-white/50"}`}>{service.desc}</div>
                                                    </a>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`md:hidden p-2 rounded-full transition-all duration-300 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"} ${isLightPage ? "text-black hover:bg-black/10" : "text-white hover:bg-white/10"}`}
                    >
                        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>

                    {/* CTA Button */}
                    <a
                        href={getLink("contact")}
                        className={`hidden md:flex relative rounded-full pl-4 pr-0.5 py-0.5 items-center gap-2 transition-all duration-500 ease-out group ml-1 overflow-hidden shadow-md ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"} ${isLightPage ? "bg-black text-white hover:bg-black/90 border border-black/40" : "bg-white text-[#1a1a1a] hover:bg-white/90 border border-white/40"
                            }`}
                        style={{ transitionDelay: "500ms", transitionDuration: "800ms" }}
                        onMouseEnter={() => setIsButtonHovered(true)}
                        onMouseLeave={() => setIsButtonHovered(false)}
                    >
                        <span className="text-[13px] font-medium tracking-wide relative z-10 transition-all duration-300 group-hover:tracking-wider">
                            Get in touch
                        </span>

                        <div className={`relative rounded-full p-2 flex items-center justify-center w-7 h-7 overflow-hidden transition-all duration-500 ease-out group-hover:scale-110 border border-transparent group-hover:border-white/30 ${isLightPage ? "bg-white text-black" : "bg-[#1a1a1a] text-white"}`}>
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{
                                    background: "conic-gradient(from 0deg, #E8BC59, #769268, #6DBEDC, #E8BC59)",
                                    animation: isButtonHovered ? "spin 2s linear infinite" : "none",
                                }}
                            />
                            <div className={`absolute inset-[2px] rounded-full z-10 transition-all duration-500 ${isLightPage ? "bg-white group-hover:bg-black/10" : "bg-[#1a1a1a] group-hover:bg-white/20"}`} />
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

            {/* Mobile Menu Dropdown */}
            <div className={`fixed inset-x-0 top-0 z-[99] md:hidden transition-all duration-500 ease-out ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isMobileMenuOpen ? "opacity-100" : "opacity-0"}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ height: "100vh" }}
                />

                {/* Menu Panel */}
                <div className={`relative mx-4 mt-20 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 transform ${isMobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"} ${isLightPage ? "bg-white border border-black/10" : "bg-[#1a1a1a] border border-white/10"}`}>
                    <div className="p-6 space-y-2">
                        {navItems.map((item, index) => (
                            <div key={item.id}>
                                <a
                                    href={getLink(item.id)}
                                    onClick={handleMobileNavClick}
                                    className={`flex items-center justify-between py-4 px-4 rounded-xl transition-all duration-300 ${isLightPage ? "text-black hover:bg-black/5" : "text-white hover:bg-white/5"}`}
                                    style={{ transitionDelay: `${index * 50}ms` }}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className={`text-xs font-mono ${isLightPage ? "text-black/40" : "text-white/40"}`}>{item.num}</span>
                                        <span className="text-lg font-medium">{item.label}</span>
                                    </div>
                                    <ArrowRight className={`w-4 h-4 ${isLightPage ? "text-black/30" : "text-white/30"}`} />
                                </a>
                                {/* Mobile Dropdown Items */}
                                {item.hasDropdown && (
                                    <div className="pl-14 pr-4 space-y-1 mb-2">
                                        {serviceItems.map((service, idx) => (
                                            <a
                                                key={idx}
                                                href={getLink("services")}
                                                onClick={handleMobileNavClick}
                                                className={`block py-2 text-sm ${isLightPage ? "text-black/60" : "text-white/60"}`}
                                            >
                                                {service.label}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Mobile CTA */}
                        <a
                            href={getLink("contact")}
                            onClick={handleMobileNavClick}
                            className={`flex items-center justify-center gap-3 py-4 mt-4 rounded-xl font-medium transition-all duration-300 ${isLightPage ? "bg-black text-white" : "bg-white text-black"}`}
                        >
                            <span>Get in touch</span>
                            <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes arrowBounce {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(2px); }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </>
    )
}
