"use client"

import { useEffect, useRef } from 'react'
import { Navbar } from "@/components/layout/navbar"
import { Terminal, ArrowRight, Layers, Ghost, Quote, Lock, Command, LayoutDashboard, FolderGit2, ChevronRight, Figma, Code2, Globe } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function AgenciesPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const container = containerRef.current

        if (canvas && container) {
            const ctx = canvas.getContext('2d')
            if (!ctx) return;

            let width: number, height: number
            let particles: Array<{
                ox: number; oy: number; oz: number;
                projX: number; projY: number; scale: number; alpha: number;
                neighbors: number[];
            }> = []

            const SETTINGS = {
                radius: 400, particleCount: 500, baseSize: 1.2,
                perspective: 800, color: '20, 20, 20', lineColor: '40, 40, 40',
                lineOpacity: 0.1
            }

            let rotation = { x: 0, y: 0 }

            function resize() {
                if (container && canvas) {
                    width = canvas.width = container.offsetWidth
                    height = canvas.height = container.offsetHeight
                    SETTINGS.radius = width > 768 ? 400 : 180
                }
            }

            function initParticles() {
                particles = []
                const phi = Math.PI * (3 - Math.sqrt(5))
                for (let i = 0; i < SETTINGS.particleCount; i++) {
                    const y = 1 - (i / (SETTINGS.particleCount - 1)) * 2
                    const theta = Math.acos(y)
                    const anglePhi = phi * i
                    particles.push({
                        ox: Math.sin(theta) * Math.cos(anglePhi),
                        oy: Math.sin(theta) * Math.sin(anglePhi),
                        oz: Math.cos(theta),
                        projX: 0, projY: 0, scale: 0, alpha: 0,
                        neighbors: []
                    })
                }
                for (let i = 0; i < particles.length; i++) {
                    const p1 = particles[i]
                    let distances: { id: number, dist: number }[] = []
                    for (let j = 0; j < particles.length; j++) {
                        if (i === j) continue
                        const dx = p1.ox - particles[j].ox, dy = p1.oy - particles[j].oy, dz = p1.oz - particles[j].oz
                        distances.push({ id: j, dist: dx * dx + dy * dy + dz * dz })
                    }
                    distances.sort((a, b) => a.dist - b.dist)
                    p1.neighbors = distances.slice(0, 2).map(n => n.id)
                }
            }

            let animationFrameId: number

            function animate() {
                if (!ctx || !canvas) return

                ctx.clearRect(0, 0, width, height)

                rotation.y += 0.002
                rotation.x += 0.001

                const cosRX = Math.cos(rotation.x), sinRX = Math.sin(rotation.x)
                const cosRY = Math.cos(rotation.y), sinRY = Math.sin(rotation.y)

                particles.forEach(p => {
                    let x1 = p.ox * SETTINGS.radius * cosRY + p.oz * SETTINGS.radius * sinRY
                    let z1 = p.oz * SETTINGS.radius * cosRY - p.ox * SETTINGS.radius * sinRY
                    let y1 = p.oy * SETTINGS.radius

                    let y2 = y1 * cosRX - z1 * sinRX
                    let z2 = z1 * cosRX + y1 * sinRX

                    const scale = SETTINGS.perspective / (SETTINGS.perspective + z2 + SETTINGS.radius)
                    p.projX = width / 2 + x1 * scale
                    p.projY = height / 2 + y2 * scale
                    p.scale = scale
                    p.alpha = Math.max(0.05, (z2 + SETTINGS.radius) / (2 * SETTINGS.radius))
                })

                ctx.lineWidth = 0.5
                particles.forEach(p1 => {
                    p1.neighbors.forEach(nid => {
                        const p2 = particles[nid]
                        const dx = p1.projX - p2.projX
                        const dy = p1.projY - p2.projY
                        const distSq = dx * dx + dy * dy
                        if (distSq < 3000) {
                            ctx.beginPath()
                            ctx.moveTo(p1.projX, p1.projY)
                            ctx.lineTo(p2.projX, p2.projY)
                            ctx.strokeStyle = `rgba(${SETTINGS.lineColor}, ${Math.min(p1.alpha, p2.alpha) * SETTINGS.lineOpacity})`
                            ctx.stroke()
                        }
                    })

                    const size = p1.scale * SETTINGS.baseSize
                    ctx.beginPath()
                    ctx.arc(p1.projX, p1.projY, size, 0, Math.PI * 2)
                    ctx.fillStyle = `rgba(${SETTINGS.color}, ${p1.alpha})`
                    ctx.fill()
                })

                animationFrameId = requestAnimationFrame(animate)
            }

            const handleResize = () => { resize(); initParticles() }

            window.addEventListener('resize', handleResize)

            resize()
            initParticles()
            animate()

            return () => {
                window.removeEventListener('resize', handleResize)
                cancelAnimationFrame(animationFrameId)
            }
        }
    }, [])

    return (
        <div className="min-h-screen w-full bg-white text-[#1a1a1a] antialiased relative">
            <Navbar theme="light" />

            {/* Hero Section */}
            <header className="relative pt-32 pb-24 md:pt-48 md:pb-40 px-6 overflow-hidden min-h-screen flex flex-col justify-center">
                <div className="absolute inset-0 z-0 pointer-events-none" ref={containerRef}>
                    <canvas ref={canvasRef} className="w-full h-full" />
                </div>
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/80 via-transparent to-white/90 z-[1]" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto text-center relative z-10"
                >
                    <div className="flex justify-center mb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1a1a1a]/10 bg-white/50 backdrop-blur-md text-[10px] uppercase tracking-widest text-[#1a1a1a]/60">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                            </span>
                            System Online v2.1
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-[-0.04em] text-[#1a1a1a] mb-6 leading-[0.95]">
                        Your Agency,<br />
                        <span className="text-[#1a1a1a]/40">Supercharged.</span>
                    </h1>

                    <p className="text-base md:text-lg text-[#1a1a1a]/60 max-w-xl mx-auto mb-10 leading-relaxed font-light">
                        Invisible <span className="italic text-[#1a1a1a] font-medium">white-label</span> engineering. The technical infrastructure allowing top creative agencies to scale without friction.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <Link href="/#contact" className="h-12 px-6 rounded-full bg-[#1a1a1a] text-white flex items-center gap-2 text-sm font-medium hover:bg-[#1a1a1a]/90 transition-colors shadow-lg">
                            Request Access
                            <ArrowRight size={16} />
                        </Link>
                        <a href="#system" className="h-12 px-6 rounded-full bg-white border border-[#1a1a1a]/10 text-[#1a1a1a]/70 text-sm font-medium flex items-center gap-2 hover:border-[#1a1a1a]/30 hover:text-[#1a1a1a] transition-all">
                            Explore System
                        </a>
                    </div>

                    <div className="border-t border-[#1a1a1a]/10 pt-8 max-w-md mx-auto">
                        <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 font-medium mb-5">Powering Next-Gen Stacks</p>
                        <div className="flex justify-center items-center gap-8 opacity-40">
                            <svg className="w-5 h-5" viewBox="0 0 76 65" fill="currentColor"><path d="M37.5 0L75 65H0L37.5 0z" /></svg>
                            <Code2 size={20} />
                            <Terminal size={18} />
                            <Globe size={20} />
                        </div>
                    </div>
                </motion.div>
            </header>

            {/* Services Section */}
            <section id="method" className="py-24 px-6 bg-[#FAFAFA] border-t border-[#1a1a1a]/5">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-left mb-16"
                    >
                        <span className="text-[10px] font-semibold tracking-widest text-[#1a1a1a]/40 uppercase mb-3 block">Capabilities</span>
                        <h2 className="text-3xl md:text-4xl font-light text-[#1a1a1a] tracking-tight mb-4">Invisible Infrastructure</h2>
                        <p className="text-[#1a1a1a]/60 max-w-lg">Everything you need to deliver world-class projects, without hiring a single in-house engineer.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="lg:col-span-2 bg-white rounded-2xl border border-[#1a1a1a]/5 p-8 relative overflow-hidden h-[380px] flex flex-col hover:border-[#1a1a1a]/20 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="relative z-10 max-w-md">
                                <div className="w-10 h-10 bg-[#1a1a1a] text-white rounded-lg flex items-center justify-center mb-5">
                                    <Layers size={20} />
                                </div>
                                <h3 className="text-xl font-medium text-[#1a1a1a] mb-3 tracking-tight">End-to-End Development</h3>
                                <p className="text-sm text-[#1a1a1a]/60 leading-relaxed">
                                    We integrate into your workflow. From Figma wireframes to global deploy on Vercel/AWS, managing the entire software lifecycle.
                                </p>
                            </div>

                            <div className="absolute right-0 bottom-0 left-0 h-48 flex items-center justify-center pointer-events-none">
                                <div className="flex items-center gap-4 translate-y-4">
                                    <div className="w-20 h-20 bg-white border border-[#1a1a1a]/10 rounded-xl flex items-center justify-center shadow-sm">
                                        <Figma className="text-[#1a1a1a]/40" size={24} />
                                    </div>
                                    <div className="w-12 h-[1px] bg-[#1a1a1a]/10" />
                                    <div className="w-20 h-20 bg-white border border-[#1a1a1a]/10 rounded-xl flex items-center justify-center shadow-sm">
                                        <Code2 className="text-[#1a1a1a]/40" size={24} />
                                    </div>
                                    <div className="w-12 h-[2px] bg-emerald-100 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-emerald-400 animate-pulse" />
                                    </div>
                                    <div className="w-20 h-20 bg-white border border-emerald-500/30 rounded-xl flex items-center justify-center shadow-lg">
                                        <Globe className="text-emerald-500" size={24} />
                                        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl border border-[#1a1a1a]/5 p-8 relative overflow-hidden h-[380px] hover:border-[#1a1a1a]/20 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-50" />
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                            <div className="relative z-10 h-full flex flex-col">
                                <div className="w-10 h-10 bg-white border border-[#1a1a1a]/10 rounded-lg flex items-center justify-center mb-5 shadow-sm">
                                    <Ghost size={20} className="text-[#1a1a1a]/60" />
                                </div>
                                <h3 className="text-lg font-medium text-[#1a1a1a] mb-2 tracking-tight">Invisible Partner</h3>
                                <p className="text-sm text-[#1a1a1a]/60 leading-relaxed mb-auto">
                                    We sign strict NDAs. We operate completely under your brand identity as your technical department.
                                </p>
                                <div className="flex-1 flex items-center justify-center relative opacity-30 mt-8">
                                    <div className="w-32 h-32 border border-dashed border-[#1a1a1a]/20 rounded-full flex items-center justify-center animate-spin" style={{ animationDuration: '12s' }}>
                                        <div className="w-24 h-24 border border-dashed border-[#1a1a1a]/20 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Philosophy Section */}
            <section id="philosophy" className="bg-[#0a0a0a] text-white py-32 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />

                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                        <div className="hidden lg:block">
                            <div className="sticky top-32">
                                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center mb-6">
                                    <Quote className="text-white/40" size={16} />
                                </div>
                                <h2 className="text-4xl font-light tracking-tight mb-6 leading-tight">
                                    The Engineering<br />
                                    <span className="text-white/40">Manifesto.</span>
                                </h2>
                                <p className="text-white/40 text-sm max-w-xs leading-relaxed">
                                    We don't just write code. We craft resilient systems designed for scale, speed, and silence.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-20">
                            {[
                                { num: '01', label: 'VELOCITY', color: 'emerald', title: 'Speed is a Feature.', desc: 'Latency kills conversion. We obsess over milliseconds. Using Edge computing and ISR, we deliver content instantly, globally.' },
                                { num: '02', label: 'CRAFTSMANSHIP', color: 'indigo', title: 'Code is Literature.', desc: '"If it works, don\'t touch it" is not in our vocabulary. We write self-documenting, strongly-typed code.' },
                                { num: '03', label: 'RELIABILITY', color: 'orange', title: 'Failure is Impossible.', desc: 'Automated CI/CD pipelines. 99.99% Uptime SLA. End-to-end testing suites.' },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group"
                                >
                                    <span className={`text-[10px] font-mono text-${item.color}-500 mb-2 block`}>{item.num} / {item.label}</span>
                                    <h3 className="text-2xl md:text-3xl font-light tracking-tight mb-4">{item.title}</h3>
                                    <p className="text-white/40 leading-relaxed text-sm md:text-base border-l border-white/10 pl-4">
                                        {item.desc}
                                    </p>
                                </motion.div>
                            ))}

                            <div className="pt-12 border-t border-white/10">
                                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-6">Built With Best-in-Class</p>
                                <div className="flex flex-wrap gap-3">
                                    {['Next.js 14', 'TypeScript', 'Turborepo', 'Supabase', 'Prisma', 'Vercel Edge'].map(tech => (
                                        <span key={tech} className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] text-white/50 hover:border-white/30 hover:text-white transition-colors cursor-default">{tech}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* LIVV OS Section */}
            <section id="system" className="py-24 px-6 bg-white border-t border-[#1a1a1a]/5 relative overflow-hidden">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8"
                    >
                        <div className="max-w-xl">
                            <span className="text-[10px] font-semibold tracking-widest text-emerald-600 uppercase mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Live Dashboard
                            </span>
                            <h2 className="text-3xl md:text-4xl font-light text-[#1a1a1a] tracking-tight mb-4">Livv OS Command Center</h2>
                            <p className="text-[#1a1a1a]/60">Real-time visibility into every project. Track development progress, deployments, and resource allocation.</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-[#1a1a1a]/50 bg-[#1a1a1a]/5 px-3 py-1.5 rounded-md border border-[#1a1a1a]/10">
                            <Lock size={12} />
                            Partner Access Only
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative w-full rounded-2xl bg-[#FAFAFA] border border-[#1a1a1a]/5 p-2 md:p-4 shadow-2xl"
                    >
                        <div className="bg-white rounded-xl border border-[#1a1a1a]/10 shadow-sm overflow-hidden flex flex-col md:flex-row h-[500px] md:h-[550px]">
                            <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-[#1a1a1a]/5 bg-[#FAFAFA] flex flex-col p-4">
                                <div className="flex items-center gap-2 mb-8 px-2">
                                    <div className="w-6 h-6 bg-[#1a1a1a] rounded-[4px] flex items-center justify-center text-white">
                                        <Command size={14} />
                                    </div>
                                    <span className="text-xs font-semibold text-[#1a1a1a]">Workspace</span>
                                </div>
                                <div className="space-y-1 mb-8">
                                    <div className="px-2 py-1.5 bg-white border border-[#1a1a1a]/10 rounded-md shadow-sm text-xs font-medium text-[#1a1a1a] flex items-center gap-2">
                                        <LayoutDashboard size={14} />
                                        Overview
                                    </div>
                                    <div className="px-2 py-1.5 text-xs font-medium text-[#1a1a1a]/50 hover:text-[#1a1a1a] hover:bg-[#1a1a1a]/5 rounded-md flex items-center gap-2 cursor-pointer transition-colors">
                                        <FolderGit2 size={14} />
                                        Projects
                                    </div>
                                </div>
                                <div className="mt-auto pt-4 border-t border-[#1a1a1a]/10">
                                    <div className="px-2 py-1.5 text-[10px] font-medium text-[#1a1a1a]/40 uppercase tracking-wider mb-2">Active Builds</div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-xs text-[#1a1a1a]/60">Client A / API</span>
                                        </div>
                                        <span className="text-[10px] text-[#1a1a1a]/40">2m</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col bg-white overflow-hidden">
                                <div className="h-14 border-b border-[#1a1a1a]/5 flex items-center justify-between px-6">
                                    <div className="flex items-center gap-2 text-xs text-[#1a1a1a]/40">
                                        <span>Overview</span>
                                        <ChevronRight size={10} />
                                        <span className="text-[#1a1a1a] font-medium">Dashboard</span>
                                    </div>
                                    <div className="flex -space-x-2">
                                        <div className="w-6 h-6 rounded-full bg-[#1a1a1a]/5 border-2 border-white flex items-center justify-center text-[8px] text-[#1a1a1a]/50">JP</div>
                                        <div className="w-6 h-6 rounded-full bg-[#1a1a1a] border-2 border-white flex items-center justify-center text-[8px] text-white">AS</div>
                                    </div>
                                </div>
                                <div className="p-6 overflow-y-auto flex-1">
                                    <div className="grid grid-cols-3 gap-4 mb-8">
                                        {[
                                            { label: 'Total Requests', value: '2.4M' },
                                            { label: 'Avg. Latency', value: '34ms' },
                                            { label: 'Success Rate', value: '99.9%' },
                                        ].map((stat, i) => (
                                            <div key={i} className="border border-[#1a1a1a]/5 rounded-lg p-4">
                                                <div className="text-[10px] text-[#1a1a1a]/50 uppercase tracking-wide mb-1">{stat.label}</div>
                                                <div className="text-xl font-semibold text-[#1a1a1a]">{stat.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border border-[#1a1a1a]/5 rounded-xl p-6">
                                        <h4 className="text-xs font-semibold text-[#1a1a1a] mb-6">System Activity</h4>
                                        <div className="h-32 flex items-end justify-between gap-1">
                                            {[20, 35, 60, 70, 80, 85, 75, 95, 40].map((h, i) => (
                                                <div key={i} className="w-full rounded-sm transition-all duration-300" style={{ height: `${h}%`, backgroundColor: i === 7 ? '#1a1a1a' : '#e5e5e5' }} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Partner Section / Footer */}
            <section id="partner" className="py-24 px-6 bg-[#0a0a0a] text-white relative overflow-hidden">
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-[-0.08em] text-white mb-8">
                        Scale your operation.<br />Not your problems.
                    </h2>
                    <p className="text-white/50 text-xl mb-16 max-w-xl mx-auto font-light leading-relaxed">
                        We accept a limited number of partners each quarter to guarantee code quality and dedicated attention.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-24">
                        <a href="mailto:hola@livv.systems" className="group h-14 px-10 rounded-full bg-white text-[#1a1a1a] font-medium flex items-center justify-center hover:bg-white/90 transition-all w-full sm:w-auto hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] duration-300">
                            Start Conversation
                            <ArrowRight className="w-5 h-5 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                        </a>
                    </div>

                    <div className="grid grid-cols-3 gap-8 border-t border-white/10 pt-8 max-w-lg mx-auto text-center mb-16">
                        {[
                            { value: '24h', label: 'Response' },
                            { value: '3', label: 'Slots Q4' },
                            { value: '100%', label: 'White Label' },
                        ].map((stat, i) => (
                            <div key={i}>
                                <div className="text-2xl font-semibold tracking-tight text-white mb-1">{stat.value}</div>
                                <div className="text-[10px] uppercase tracking-widest text-white/40">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-white/30 font-light">
                        <div className="font-medium text-white/40">Livv Studio © 2025</div>
                        <div className="flex gap-8">
                            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                            <a href="#" className="hover:text-white transition-colors">Twitter</a>
                            <a href="#" className="hover:text-white transition-colors">Instagram</a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
