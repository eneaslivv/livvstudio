"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Layers, ArrowRight, CheckCircle2, ChevronRight, ShoppingCart, ShieldCheck, Zap, Globe, Users } from "lucide-react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Navbar } from "@/components/layout/navbar"
import { FooterSection } from "@/components/sections/footer-section"

const productData = {
    "payper": {
        name: "Payper",
        industry: "Hospitality",
        target: "Restaurant owners, hotel managers, and hospitality chains",
        headline: "A complete system built for Hospitality Operations.",
        subheadline: "A ready-to-use platform designed specifically for the hospitality sector, delivered as a white-label solution.",
        problem: [
            "Disconnected tools and manual order workflows",
            "Poor visibility over operations and kitchen data",
            "High costs and slow development for custom POS systems",
            "Generic tools that don't fit real hospitality workflows"
        ],
        solution: "Payper is a fully built system created specifically for Hospitality operations. Instead of developing software from scratch, you get a proven platform that already covers the core workflows — adapted to your business and delivered under your brand.",
        features: [
            "Industry-specific order workflows and logic",
            "Role-based access (Waiters, Kitchen, Admin)",
            "Centralized dashboard and real-time reporting",
            "Automation for repetitive inventory tasks",
            "Payment gateway and POS integrations",
            "White-label branding (logo, colors, domain)"
        ],
        pricing: {
            monthly: "$49",
            setup: "$499",
            includes: ["Full system access", "Custom branding setup", "Initial configuration", "Deployment support"]
        },
        accentColor: "#d4734b",
    },
    "prtool": {
        name: "PRTool",
        industry: "Creator Economy",
        target: "PR agencies, talent managers, and brand marketing teams",
        headline: "A complete system built for Partnership Management.",
        subheadline: "A ready-to-use platform designed specifically for the creator economy, delivered as a white-label solution.",
        problem: [
            "Chaotic spreadsheet-based campaign management",
            "Manual payment tracking for hundreds of creators",
            "Difficulty measuring real ROI on partnerships",
            "Segmented communication across multiple platforms"
        ],
        solution: "PRTool centralizes the entire collaboration lifecycle. From campaign briefing to automated payments and performance tracking, it provides a professional infrastructure for agencies to scale their operations.",
        features: [
            "Campaign creator and tracking dashboard",
            "Automated payout system for influencers",
            "Contract management and digital signing",
            "Performance analytics and ROI reporting",
            "Client-facing portals for campaign visibility",
            "Full white-label customization"
        ],
        pricing: {
            monthly: "$29",
            setup: "$299",
            includes: ["Campaign manager tools", "Brand customization", "Secure payment flows", "Cloud hosting"]
        },
        accentColor: "#e8a87c",
    },
    "legalflow": {
        name: "LegalFlow",
        industry: "Legal Tech",
        target: "Law firms, legal consultants, and corporate legal departments",
        headline: "A complete system built for Legal Automation.",
        subheadline: "A ready-to-use platform designed specifically for modern law firms, delivered as a white-label solution.",
        problem: [
            "Manual document preparation and filing",
            "Inefficient case tracking and deadline management",
            "Security concerns with generic cloud storage",
            "Slow client communication and manual onboarding"
        ],
        solution: "LegalFlow automates the administrative burden of legal practices. It provides a secure, structured environment for case management, document automation, and client collaboration.",
        features: [
            "Automated case management and timelines",
            "Secure document vault with encryption",
            "Role-based access for attorneys and clerks",
            "Client onboarding for automated intake",
            "Time tracking and integrated billing",
            "Company branding throughout the portal"
        ],
        pricing: {
            monthly: "$59",
            setup: "$999",
            includes: ["End-to-end case workflows", "Advanced security features", "Onboarding support", "Custom domain setup"]
        },
        accentColor: "#845ec2",
    }
}

export default function ProductDetailPage() {
    const params = useParams()
    const slug = (params.slug as string)?.toLowerCase()
    const data = productData[slug as keyof typeof productData] || productData["payper"]

    const pricingRef = useRef<HTMLElement>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
        window.scrollTo(0, 0)
    }, [])

    const scrollToPricing = () => {
        pricingRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    return (
        <div className="text-stone-800 min-h-screen flex flex-col overflow-x-hidden relative bg-[#FDFBF9] selection:bg-stone-200 selection:text-stone-900">
            <Navbar isLoaded={isVisible} theme="light" />
            {/* Subtle Grain Background */}
            <div
                className="fixed inset-0 pointer-events-none z-0 opacity-[0.12]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`
                }}
            />

            <main className="relative z-10 flex-1">
                {/* 1. HERO */}
                <section className="relative pt-28 pb-28 px-6 md:px-12 overflow-hidden">
                    <div className="absolute inset-0 -z-10">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                                backgroundImage: "url('https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1800&q=80')",
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/90 to-white/95" />
                    </div>
                    <div className="max-w-6xl mx-auto text-center space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-3 px-5 py-1.5 rounded-full border border-stone-200 bg-white/60 shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] uppercase tracking-[0.35em] text-stone-500 font-semibold">Livv Marketplace</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light leading-tight tracking-tight text-stone-900">
                                {data.headline}
                            </h1>
                            <p className="text-lg md:text-2xl text-stone-500 font-light leading-relaxed max-w-3xl mx-auto">
                                {data.subheadline}
                            </p>
                            <p className="text-xs uppercase tracking-[0.4em] text-stone-400 font-semibold">
                                Buy it. Customize it. Launch it under your brand.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button onClick={scrollToPricing} className="flex items-center gap-2 bg-stone-900 text-white px-12 py-4 rounded-full text-xs font-semibold uppercase tracking-[0.35em] shadow-2xl shadow-stone-900/40 transition-all hover:bg-stone-800">
                                    <ShoppingCart className="w-4 h-4" />
                                    buy white-label system
                                </button>
                                <button className="px-12 py-4 rounded-full text-xs font-semibold tracking-[0.35em] uppercase border border-stone-200 text-stone-600 hover:border-stone-900 transition-all">
                                    explore features
                                </button>
                            </div>
                        </motion.div>
                        <div className="h-[1px] bg-gradient-to-r from-transparent via-stone-300 to-transparent" />
                    </div>
                </section>

                {/* 2. WHO THIS IS FOR */}
                <section className="py-24 px-6 bg-stone-100/50 border-y border-stone-200/60">
                    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-light tracking-tight text-stone-900 mb-6">Who this product is for</h2>
                            <p className="text-stone-500 text-lg mb-8 leading-relaxed">
                                If you already work in this industry and need a proven system instead of building from scratch, this product is for you.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-start gap-4">
                                <Users className="w-6 h-6 text-stone-300 mt-1" />
                                <span className="text-stone-700 font-medium">{data.target}</span>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-start gap-4 opacity-75">
                                <Globe className="w-6 h-6 text-stone-300 mt-1" />
                                <span className="text-stone-700 font-medium">Teams managing multiple clients or internal workflows</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. THE PROBLEM */}
                <section className="py-24 px-6 max-w-5xl mx-auto">
                    <h2 className="text-xs uppercase tracking-[0.2em] text-stone-400 font-bold mb-12">The problem we solve</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                        <div>
                            <p className="text-2xl font-light text-stone-800 leading-snug">
                                Most {data.industry} businesses struggle with manual workflows and generic tools that don't fit real industry logic.
                            </p>
                        </div>
                        <ul className="space-y-6">
                            {data.problem.map((item, i) => (
                                <li key={i} className="flex items-start gap-4">
                                    <div className="w-1.5 h-1.5 rounded-full bg-stone-300 mt-2.5 shrink-0" />
                                    <span className="text-stone-600 leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* 4. THE SOLUTION */}
                <section className="py-32 px-6 bg-stone-900 text-stone-50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-stone-800/20 to-transparent" />
                    <div className="max-w-5xl mx-auto relative z-10">
                        <h2 className="text-xs uppercase tracking-[0.2em] text-stone-500 font-bold mb-12">The Solution — Product Pitch</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                            <h3 className="text-3xl md:text-5xl font-light tracking-tighter">The Livv {data.name} System</h3>
                            <div className="space-y-6">
                                <p className="text-lg text-stone-400 leading-relaxed">
                                    {data.solution}
                                </p>
                                <div className="pt-6 border-t border-stone-800">
                                    <p className="text-stone-500 text-sm font-medium italic">
                                        "Delivered as a complete white-label solution, ready to launch."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. CORE FEATURES */}
                <section className="py-24 px-6 max-w-5xl mx-auto">
                    <h2 className="text-xs uppercase tracking-[0.2em] text-stone-400 font-bold mb-16">What's included</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {data.features.map((feature, i) => (
                            <div key={i} className="group p-8 rounded-3xl border border-stone-200 hover:border-stone-900 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mb-6 group-hover:bg-stone-900 group-hover:text-white transition-colors">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <h4 className="text-stone-900 font-semibold mb-2">{feature}</h4>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 6. WHITE-LABEL EXPLANATION */}
                <section className="py-24 px-6 bg-emerald-50/30 border-y border-emerald-100/50">
                    <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 items-center">
                        <div className="flex-1">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center mb-8 shadow-lg shadow-emerald-200/50">
                                <ShieldCheck className="text-white w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-light tracking-tight text-stone-900 mb-6">White-label, done properly</h2>
                            <p className="text-stone-600 text-lg leading-relaxed">
                                We adapt branding, structure, and integrations so the system looks and works as if it was built in-house by your company. Your clients or team never see Livv.
                            </p>
                        </div>
                        <div className="flex-1 bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Layers size={120} />
                            </div>
                            <ul className="space-y-4 relative z-10">
                                <li className="flex items-center gap-3 text-stone-700">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    <span>Company Logo & Identity</span>
                                </li>
                                <li className="flex items-center gap-3 text-stone-700">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    <span>Custom Domain & SSL</span>
                                </li>
                                <li className="flex items-center gap-3 text-stone-700">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    <span>Tailored Color Palette</span>
                                </li>
                                <li className="flex items-center gap-3 text-stone-700">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    <span>Industry Specific Logic</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 7. PRICING */}
                <section ref={pricingRef} id="pricing" className="py-32 px-6">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-xs uppercase tracking-[0.2em] text-stone-400 font-bold mb-16 text-center">Pricing</h2>
                        <div className="max-w-md mx-auto relative">
                            <div className="absolute -inset-1 bg-gradient-to-br from-stone-900 to-stone-400 rounded-[2.25rem] blur opacity-10" />
                            <div className="relative bg-white border border-stone-200 rounded-[2rem] p-10 overflow-hidden">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h3 className="text-xl font-bold text-stone-900">White-label access</h3>
                                        <p className="text-stone-500 text-sm">Full industry system</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-3xl font-bold text-stone-900">{data.pricing.monthly}</span>
                                        <span className="text-stone-400 text-sm">/mo</span>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-10">
                                    {data.pricing.includes.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            <span className="text-stone-600 text-sm">{item}</span>
                                        </div>
                                    ))}
                                    <div className="pt-4 border-t border-stone-100 flex justify-between items-center text-stone-700">
                                        <span className="text-sm font-semibold">One-time setup:</span>
                                        <span className="text-lg font-bold">{data.pricing.setup}</span>
                                    </div>
                                </div>

                                <button className="w-full bg-stone-900 text-stone-50 py-4 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-stone-800 transition-all flex items-center justify-center gap-2">
                                    <span>Buy now</span>
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 8. IMPLEMENTATION FLOW */}
                <section className="py-24 px-6 bg-stone-900 text-stone-50">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-xs uppercase tracking-[0.2em] text-stone-500 font-bold mb-16">How it works</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { step: "01", title: "Purchase", desc: "Select and buy the system access" },
                                { step: "02", title: "Configure", desc: "We set up your branding & flows" },
                                { step: "03", title: "Review", desc: "You approve the implementation" },
                                { step: "04", title: "Launch", desc: "We deploy under your brand" }
                            ].map((s, i) => (
                                <div key={i} className="space-y-4">
                                    <span className="text-stone-800 text-4xl font-bold">{s.step}</span>
                                    <h4 className="text-lg font-semibold">{s.title}</h4>
                                    <p className="text-stone-500 text-sm leading-relaxed">{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 9. RESELLERS */}
                <section className="py-24 px-6 border-b border-stone-200">
                    <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
                        <div className="max-w-xl">
                            <h2 className="text-2xl font-semibold text-stone-900 mb-4">Resell this system to your clients</h2>
                            <p className="text-stone-500 leading-relaxed">
                                Agencies and consultants can resell this system under their own brand. No development, no maintenance — just implementation and margin.
                            </p>
                        </div>
                        <button className="px-8 py-3 rounded-xl border-2 border-stone-900 text-stone-900 font-bold text-sm uppercase tracking-wider hover:bg-stone-900 hover:text-white transition-all">
                            Become a reseller
                        </button>
                    </div>
                </section>

                {/* 10. FINAL CTA */}
                <section className="py-32 px-6 text-center">
                    <div className="max-w-4xl mx-auto">
                        <p className="text-stone-400 uppercase tracking-widest text-[10px] font-bold mb-8">Ready to go</p>
                        <h2 className="text-4xl md:text-5xl font-light tracking-tight text-stone-900 mb-12">
                            A proven system. Built for your industry. Ready to launch.
                        </h2>
                        <button onClick={scrollToPricing} className="bg-stone-900 text-stone-50 px-12 py-5 rounded-2xl text-base font-bold uppercase tracking-wider hover:bg-stone-800 transition-all shadow-2xl shadow-stone-300">
                            Buy white-label system
                        </button>
                    </div>
                </section>
            </main>

            <FooterSection id="contact" />
        </div>
    )
}
