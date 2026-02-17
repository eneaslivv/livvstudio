"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { AnimatedBorders } from "@/components/ui/animated-borders"
import { RevealText } from "@/components/ui/reveal-text"
import { Playfair_Display } from "next/font/google"

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600"] })

import { ScopeCard } from "@/components/button-styling/scope-card"
import { TickerBar } from "@/components/button-styling/ticker-bar"

export function PricingSection({ id }: { id?: string }) {
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
        <section id={id} ref={sectionRef} className="relative w-full overflow-hidden" style={{ backgroundColor: "#f5f2ed" }}>
            {/* Geometric Background Lines */}
            <div className="absolute inset-0 pointer-events-none z-0 hidden md:flex justify-center">
                <div className="relative h-full" style={{ width: "500px" }}>
                    <div className="absolute h-full" style={{ left: "0", width: "0", borderLeft: "1px solid rgba(224, 221, 216, 0.45)" }} />
                    <div className="absolute h-full" style={{ left: "100%", width: "0", borderLeft: "1px solid rgba(224, 221, 216, 0.45)" }} />
                </div>
            </div>

            <div className="absolute pointer-events-none z-[1] hidden md:flex justify-center" style={{ top: "0", left: "0", right: "0", bottom: "0" }}>
                <div className="relative" style={{ width: "500px", height: "100%" }}>
                    <div
                        className="absolute"
                        style={{
                            top: "50%",
                            left: "-40%",
                            width: "180%",
                            height: "0",
                            borderTop: "1px dashed rgba(200, 195, 188, 0.7)",
                        }}
                    />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20 relative z-10">
                <AnimatedBorders className="hidden md:block" />

                <div className="flex flex-col items-center w-full">
                    {/* Section Header */}
                    <div className="w-full relative z-10 mb-10 md:mb-16">
                        <div className="relative w-full h-[1px]">
                            <AnimatedBorders showLeft={false} showRight={false} showTop={true} fullWidth={true} />
                        </div>
                        <div className="pt-6 flex justify-between items-center text-[10px] uppercase tracking-widest text-[#5A3E3E]/60 px-6 md:px-12">
                            <span>© Pricing プライシング</span>
                            <span>(WDX® — 05)</span>
                        </div>
                    </div>

                    {/* Original Animated Header */}
                    <div className="text-center mb-10 md:mb-16 relative z-10">
                        <div
                            className="inline-flex items-center gap-2 mb-4"
                            style={{
                                padding: "6px 10px",
                                background: "rgba(212, 165, 116, 0.1)",
                                borderRadius: "4px",
                                border: "1px solid rgba(212, 165, 116, 0.2)",
                            }}
                        >
                            <div
                                style={{
                                    width: "6px",
                                    height: "6px",
                                    background: "#d4a574",
                                    borderRadius: "50%",
                                    boxShadow: "0 0 6px #d4a574",
                                }}
                            />
                            <span
                                className="font-sans"
                                style={{
                                    fontSize: "10px",
                                    textTransform: "lowercase",
                                    letterSpacing: "0.05em",
                                    color: "#2d2d2d",
                                    fontWeight: 500,
                                }}
                            >
                                instant quote
                            </span>
                        </div>

                        <h1
                            className="text-balance font-sans"
                            style={{
                                fontSize: "clamp(54px, 12vw, 120px)",
                                lineHeight: 1.1,
                                marginBottom: "24px",
                                paddingBottom: "8px",
                                fontWeight: 600,
                                letterSpacing: "-0.06em",
                            }}
                        >
                            <span className="text-gradient-gold animate-blur-in inline-flex items-center gap-4">
                                Pricing <span className="text-[#2C0405] text-[0.8em] font-normal" style={{ WebkitTextFillColor: "initial", WebkitBackgroundClip: "initial" }}>★</span>
                            </span>
                        </h1>
                        <p
                            className="text-pretty"
                            style={{
                                fontSize: "clamp(15px, 4vw, 18px)",
                                color: "#9a9490",
                                maxWidth: "540px",
                                margin: "0 auto",
                                fontWeight: 300,
                                lineHeight: 1.6,
                                animation: "fadeSlideIn 0.8s 0.5s ease-out both",
                            }}
                        >
                            Scope your project in seconds. Get a real-time quote, instantly.
                        </p>
                    </div>

                    {/* Radar + ScopeCard Section (Copied from button-styling app/page.tsx) */}
                    <div className="w-full flex flex-col items-center justify-center relative z-20 mb-20">
                        {/* Central area with radar + card */}
                        <div
                            style={{
                                position: "relative",
                                width: "clamp(280px, 100%, 500px)",
                                aspectRatio: "1",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {/* Radar rings */}
                            {/* Outermost ring */}
                            <div
                                className="absolute rounded-full"
                                style={{ width: "100%", height: "100%", border: "1px solid #e0ddd8" }}
                            />

                            {/* Conic glow sweep */}
                            <div
                                className="absolute rounded-full"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    background:
                                        "conic-gradient(from 230deg, transparent 0%, transparent 40%, rgba(44, 4, 5, 0.1) 60%, #2C0405 80%, transparent 100%)",
                                    maskImage: "radial-gradient(transparent 62%, black 63%)",
                                    WebkitMaskImage:
                                        "radial-gradient(transparent 62%, black 63%)",
                                    opacity: 0.6,
                                    filter: "blur(10px)",
                                    animation: "pulse-rotate 8s infinite linear",
                                }}
                            />

                            {/* Middle dashed ring */}
                            <div
                                className="absolute rounded-full"
                                style={{
                                    width: "80%",
                                    height: "80%",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    border: "1px dashed #e0ddd8",
                                    opacity: 0.5,
                                }}
                            />

                            {/* Inner dark ring */}
                            <div
                                className="absolute rounded-full"
                                style={{
                                    width: "60%",
                                    height: "60%",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    border: "1px solid #333",
                                }}
                            />

                            {/* Core dark circle */}
                            <div
                                className="absolute rounded-full"
                                style={{
                                    width: "40%",
                                    height: "40%",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    border: "1px solid #222",
                                    background: "radial-gradient(circle, #0a0a0a 0%, #000 100%)",
                                }}
                            />

                            {/* HUD labels */}
                            <div
                                className="absolute font-sans"
                                style={{
                                    top: "10px",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    color: "#8a8a8a",
                                    fontSize: "8px",
                                    letterSpacing: "0.05em",
                                    textTransform: "lowercase",
                                }}
                            >
                                explore services
                            </div>
                            <div
                                className="absolute font-sans"
                                style={{
                                    bottom: "10px",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    color: "#8a8a8a",
                                    fontSize: "8px",
                                    letterSpacing: "0.05em",
                                    textTransform: "lowercase",
                                }}
                            >
                                select to begin
                            </div>

                            {/* The white card */}
                            <ScopeCard />
                        </div>
                    </div>

                    {/* Ticker Bar Integration */}
                    <div className="w-full relative z-10">
                        <TickerBar />
                    </div>

                    {/* Section Footer */}
                    <div className="w-full relative z-10 mt-24">
                        <div className="relative w-full h-[1px]">
                            <AnimatedBorders showLeft={false} showRight={false} showTop={true} fullWidth={true} />
                        </div>
                        <div className="py-6 px-6 md:px-12 flex justify-between items-center text-[10px] uppercase tracking-widest text-[#5A3E3E]/60">
                            <span>© End of Section エンド</span>
                            <span>(WDX® — 06)</span>
                        </div>
                    </div>
                </div >
            </div >
            <style jsx>{`
                @keyframes scroll-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll-left {
                    animation: scroll-left 30s linear infinite;
                }
                @keyframes pulse-rotate {
                    0% { transform: rotate(0deg); opacity: 0.4; }
                    50% { opacity: 0.8; }
                    100% { transform: rotate(360deg); opacity: 0.4; }
                }
                @keyframes blurReveal {
                    0% {
                        opacity: 0;
                        filter: blur(12px);
                        transform: translateY(4px);
                    }
                    100% {
                        opacity: 1;
                        filter: blur(0px);
                        transform: translateY(0);
                    }
                }
                @keyframes fadeSlideIn {
                    0% {
                        opacity: 0;
                        transform: translateY(8px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </section >
    )
}
