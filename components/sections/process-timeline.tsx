"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, FileText, Zap, Rocket, ArrowUpRight, Spline, PenTool, Target } from "lucide-react"
import { IconClarity, IconProposal, IconSprint, IconScale } from "@/components/ui/abstract-icons"
import { AnimatedBorders } from "@/components/ui/animated-borders"

const phases = [
    {
        id: "01",
        title: "Clarity Session",
        icon: IconClarity,
        desc: "We understand the root problem and your limitations. No aggressive sales, just pure strategy to define if we're the right fit.",
        activeBg: "#F3EFE7" // Warm Beige
    },
    {
        id: "02",
        title: "Flat-Fee Proposal",
        icon: IconProposal,
        desc: "We define deliverables, timeline and fixed price. No hidden costs. You know exactly what you get and when.",
        activeBg: "#F9F1F0" // Muted Rose
    },
    {
        id: "03",
        title: "Design Sprints",
        icon: IconSprint,
        desc: "Weekly iterations. You see progress in Figma in real time. Quick feedback, quick execution.",
        activeBg: "#F0EBE5" // Warm Gray
    },
    {
        id: "04",
        title: "Delivery & Scale",
        icon: IconScale,
        desc: "Flawless hand-off for devs or direct development in Webflow. We stay close to iterate post-launch.",
        activeBg: "#F5F0E6" // Muted Tan
    }
]

export function ProcessTimeline() {
    const [activeId, setActiveId] = useState(phases[0].id)

    const activePhase = phases.find(p => p.id === activeId) || phases[0]

    return (
        <div className="w-full relative z-10">
            <h2 className="section-heading text-[#2C0405] text-center mb-16">
                Design Project Timeline
            </h2>

            {/* Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-b border-[#E6E2D8] divide-y md:divide-y-0 md:divide-x divide-[#E6E2D8] mb-16">
                {phases.map((phase) => {
                    const isActive = activeId === phase.id
                    const Icon = phase.icon

                    return (
                        <div
                            key={phase.id}
                            onClick={() => setActiveId(phase.id)}
                            className={`
                                group relative aspect-square flex flex-col justify-between p-8 cursor-pointer transition-all duration-500
                                hover:bg-white
                            `}
                            style={{
                                backgroundColor: isActive ? phase.activeBg : undefined
                            }}
                        >
                            {/* Top row: Number */}
                            <div className="flex justify-between items-start">
                                <span className={`text-sm font-medium ${isActive ? 'text-[#2C0405]' : 'text-[#5A3E3E]/40 group-hover:text-[#2C0405]'}`}>
                                    {phase.id}
                                </span>
                            </div>

                            {/* Center: Icon */}
                            <div className="self-center">
                                <Icon
                                    strokeWidth={1.2}
                                    isActive={isActive}
                                    className={`w-12 h-12 transition-all duration-500 ${isActive ? 'text-[#2C0405] scale-110' : 'text-[#5A3E3E]/30 group-hover:text-[#2C0405] group-hover:scale-105'}`}
                                />
                            </div>

                            {/* Bottom: Title & Arrow */}
                            <div className="flex justify-between items-end">
                                <span className={`font-medium text-lg leading-tight ${isActive ? 'text-[#2C0405]' : 'text-[#5A3E3E]/60 group-hover:text-[#2C0405]'}`}>
                                    {phase.title}
                                </span>
                                <ArrowUpRight
                                    className={`w-5 h-5 transition-all duration-300 ${isActive ? 'text-[#2C0405] opacity-100 translate-x-0 translate-y-0' : 'text-[#5A3E3E]/20 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0'}`}
                                />
                            </div>

                            {/* Active Border Overlay (optional, if we want inner border) */}
                            {isActive && (
                                <div className="absolute inset-0 border-[1.5px] border-[#1a1a1a]/5 pointer-events-none" />
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Bottom Details Section */}
            <div className="grid md:grid-cols-12 gap-12 items-start">
                {/* List Summary */}
                <div className="md:col-span-4 hidden md:block opacity-40 hover:opacity-100 transition-opacity">
                    <ul className="space-y-2">
                        {phases.map(p => (
                            <li
                                key={p.id}
                                className={`text-xs font-mono tracking-widest cursor-pointer hover:text-[#2C0405] transition-colors ${activeId === p.id ? 'text-[#2C0405] font-bold' : 'text-[#5A3E3E]/50'}`}
                                onClick={() => setActiveId(p.id)}
                            >
                                {p.id}. {p.title.toUpperCase()}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Active Description */}
                <div className="md:col-span-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <p className="text-xl md:text-2xl font-light text-[#5A3E3E]/80 leading-relaxed max-w-2xl">
                                {activePhase.desc}
                            </p>

                            <div className="mt-8 flex items-center gap-4">
                                <div className="h-[1px] w-12 bg-[#2C0405]/20" />
                                <span className="text-xs font-mono uppercasetracking-widest text-[#5A3E3E]/40">STEP {activeId} OF 04</span>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* CTA Button floating */}
            <div className="mt-16 flex justify-center md:justify-end">
                <a href="#contact" className="group inline-flex items-center gap-3 bg-[#2C0405] hover:bg-[#3a0a0b] text-[#FDFBF7] px-6 py-3 rounded-xl transition-all shadow-sm hover:shadow-md border border-[#2C0405]">
                    <span className="text-sm font-medium">Make a project</span>
                    <span className="text-sm font-bold">Let's make it</span>
                    <ArrowUpRight className="w-4 h-4 text-[#FDFBF7] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
            </div>
        </div>
    )
}
