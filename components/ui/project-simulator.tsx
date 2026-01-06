"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Settings, Cpu, Zap, Activity } from "lucide-react"

export type SimulationData = {
    platform: string
    intelligence: string
    velocity: string
    complexity: number
}

interface ProjectSimulatorProps {
    onComplete: (data: SimulationData) => void
}

export function ProjectSimulator({ onComplete }: ProjectSimulatorProps) {
    const [platform, setPlatform] = useState<"Web" | "Mobile" | "Ecosystem">("Web")
    const [intelligence, setIntelligence] = useState<"Standard" | "Dynamic" | "AI-Agentic">("Standard")
    const [velocity, setVelocity] = useState<"Standard" | "Rush Mode">("Standard")
    const [complexity, setComplexity] = useState(0)

    // Calculate Complexity Logic
    useEffect(() => {
        let score = 0
        if (platform === "Web") score += 20
        if (platform === "Mobile") score += 40
        if (platform === "Ecosystem") score += 80

        if (intelligence === "Standard") score += 10
        if (intelligence === "Dynamic") score += 30
        if (intelligence === "AI-Agentic") score += 70

        if (velocity === "Standard") score += 0
        if (velocity === "Rush Mode") score += 20

        // Cap at 100 for visual
        setComplexity(Math.min(score, 100))
    }, [platform, intelligence, velocity])

    const handleInitialize = () => {
        onComplete({
            platform,
            intelligence,
            velocity,
            complexity
        })
    }

    const getComplexityColor = (val: number) => {
        if (val < 40) return "bg-emerald-500"
        if (val < 70) return "bg-amber-500"
        return "bg-rose-500"
    }

    return (
        <div className="w-full h-full flex flex-col justify-center px-6 py-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full bg-white/50 backdrop-blur-xl border border-stone-200/60 rounded-2xl p-6 shadow-2xl shadow-stone-200/40 relative overflow-hidden group"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-amber-600" />
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
                            CARBON AI IN IT
                        </span>
                    </div>
                    <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-stone-200" />
                        <div className="w-1.5 h-1.5 rounded-full bg-stone-200" />
                    </div>
                </div>

                {/* Controls */}
                <div className="space-y-6 mb-8">
                    {/* Platform */}
                    <ControlRow
                        label="Infrastructure"
                        options={["Web", "Mobile", "Ecosystem"]}
                        selected={platform}
                        onChange={(val) => setPlatform(val as any)}
                        icon={<Cpu className="w-3.5 h-3.5" />}
                    />

                    {/* Intelligence */}
                    <ControlRow
                        label="Intelligence Level"
                        options={["Standard", "Dynamic", "AI-Agentic"]}
                        selected={intelligence}
                        onChange={(val) => setIntelligence(val as any)}
                        icon={<Activity className="w-3.5 h-3.5" />}
                    />

                    {/* Velocity */}
                    <ControlRow
                        label="Delivery Velocity"
                        options={["Standard", "Rush Mode"]}
                        selected={velocity}
                        onChange={(val) => setVelocity(val as any)}
                        icon={<Zap className="w-3.5 h-3.5" />}
                    />
                </div>

                {/* Complexity Meter */}
                <div className="mb-8 p-4 bg-stone-50/80 rounded-xl border border-stone-100">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] font-mono uppercase text-stone-400 tracking-wider">
                            System Complexity
                        </span>
                        <span className="text-xs font-bold text-stone-700 font-mono">
                            {complexity}%
                        </span>
                    </div>
                    <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
                        <motion.div
                            className={`h-full ${getComplexityColor(complexity)}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${complexity}%` }}
                            transition={{ type: "spring", bounce: 0, duration: 0.8 }}
                        />
                    </div>
                    <div className="mt-2 flex justify-between items-center opacity-70">
                        <span className="text-[9px] text-stone-400 font-mono">
                            EST. LOAD: {complexity > 80 ? 'HEAVY' : complexity > 40 ? 'MODERATE' : 'LIGHT'}
                        </span>
                        <span className="text-[9px] text-stone-400 font-mono animate-pulse">
                            CALCULATING RESOURCES...
                        </span>
                    </div>
                </div>

                {/* Action Button */}
                <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0,0,0,0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleInitialize}
                    className="w-full py-4 bg-stone-900 text-white rounded-xl text-xs font-mono font-medium tracking-widest uppercase flex items-center justify-center gap-3 group relative overflow-hidden"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        [ INITIALIZE BUILD PROTOCOL ]
                        <Zap className="w-3.5 h-3.5 group-hover:text-yellow-400 transition-colors" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:animate-shine" />
                </motion.button>

                {/* Decorative Background Gradients */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -z-10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/5 rounded-full blur-[80px] -z-10 pointer-events-none" />
            </motion.div>
        </div>
    )
}

function ControlRow({ label, options, selected, onChange, icon }: {
    label: string,
    options: string[],
    selected: string,
    onChange: (val: string) => void,
    icon: React.ReactNode
}) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] text-stone-400 uppercase tracking-wider font-medium">
                {icon}
                {label}
            </div>
            <div className="flex p-1 bg-stone-100/50 rounded-lg border border-stone-100">
                {options.map((opt) => {
                    const isActive = selected === opt
                    return (
                        <button
                            key={opt}
                            onClick={() => onChange(opt)}
                            className={`
                                flex-1 py-1.5 px-3 rounded-md text-[11px] font-medium transition-all duration-300 relative
                                ${isActive ? 'text-stone-800 shadow-sm' : 'text-stone-400 hover:text-stone-600'}
                            `}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId={`bg-${label}`}
                                    className="absolute inset-0 bg-white rounded-md shadow-sm border border-stone-200/50"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{opt}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
