import { AnimatedBorders } from "@/components/ui/animated-borders"
import { Server, ShieldCheck, ArrowRight } from "lucide-react"
import { inter } from "@/app/fonts"

export function PartnerInfrastructureSection() {
    return (
        <section className="relative w-full z-10">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20 relative z-10">
                <AnimatedBorders className="hidden md:block mx-6 md:mx-12" />

                <div className="flex flex-col items-center w-full px-6 md:px-12 mx-auto relative z-10 w-[calc(100%-3rem)] md:w-[calc(100%-6rem)]">

                    {/* Main Content Grid */}
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-24 items-center">

                        {/* LEFT COLUMN: Typography */}
                        <div className={`flex flex-col justify-center order-2 lg:order-1 animate-reveal ${inter.className}`}>

                            <div className="flex items-center gap-3 mb-8">
                                <div className="px-3 py-1 rounded-full border border-[#E8E4DC] bg-white shadow-sm flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#171717] animate-pulse"></div>
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#5A3E3E]/60">System Status: Optimal</span>
                                </div>
                            </div>

                            <h2 className="section-heading text-gradient-gold mb-8">
                                The silent partner <br />
                                behind your growth.
                            </h2>

                            <p className="max-w-md text-[#5A3E3E]/80 leading-relaxed text-sm font-medium mb-10">
                                We build the heavy-lifting technology—apps, integrations, and platforms—so your agency can focus on client relationships and scaling revenue.
                            </p>

                            <div className="flex flex-wrap items-center gap-4">
                                <button className="group flex items-center justify-center gap-2 bg-[#171717] text-white rounded-full px-8 py-3.5 hover:bg-stone-800 transition-all duration-300 shadow-xl shadow-stone-900/10 hover:shadow-2xl hover:scale-105">
                                    <span className="text-sm font-medium tracking-wide">Start Collaboration</span>
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 opacity-70" />
                                </button>

                                <button className="px-6 py-3.5 rounded-full text-sm font-medium text-[#171717] border border-stone-200 hover:bg-stone-50 transition-all duration-300 hover:scale-105">
                                    View capability deck
                                </button>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Sophisticated UI Graphic */}
                        <div className="relative w-full h-[400px] lg:h-[500px] flex items-center justify-center order-1 lg:order-2 animate-reveal delay-100">

                            {/* Main Container Canvas */}
                            <div className="relative w-full h-full rounded-[10px] overflow-hidden border border-stone-100/20">

                                {/* Background Image */}
                                <img
                                    src="/images/infra-bg.png"
                                    alt="Infrastructure"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />

                                {/* UI COMPONENTS */}
                                <div className="flex z-10 absolute top-0 right-0 bottom-0 left-0 items-center justify-center">

                                    {/* Center Hub (Main Dashboard) */}
                                    <div className="relative w-full max-w-[380px] tech-glass rounded-[10px] overflow-hidden hover-lift z-20 group/hub">

                                        {/* Header */}
                                        <div className="border-b border-stone-100 px-5 py-4 flex items-center justify-between bg-white/40">
                                            <span className="text-xs font-mono font-medium text-stone-400 uppercase tracking-wider">Main_Cluster</span>
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover/hub:animate-pulse"></div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-10 h-10 rounded-[8px] bg-[#171717] flex items-center justify-center text-white shadow-lg group-hover/hub:scale-105 transition-transform duration-300">
                                                    <Server className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-semibold text-[#171717]">Production API</h3>
                                                    <p className="text-[11px] text-stone-500">v2.4.0 (Stable)</p>
                                                </div>
                                            </div>

                                            {/* Metric List */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between p-2.5 rounded-[8px] hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-100 group">
                                                    <span className="text-[11px] font-medium text-stone-500">Latency</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-mono text-[#171717]">24ms</span>
                                                        <div className="w-12 h-1 bg-stone-100 rounded-full overflow-hidden">
                                                            <div className="h-full bg-[#171717] w-[20%] group-hover/hub:animate-[grow-bar-1_1s_ease-out_forwards]"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between p-2.5 rounded-[8px] hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-100 group">
                                                    <span className="text-[11px] font-medium text-stone-500">Uptime</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-mono text-[#171717]">99.99%</span>
                                                        <div className="w-12 h-1 bg-stone-100 rounded-full overflow-hidden">
                                                            <div className="h-full bg-emerald-500 w-[98%] group-hover/hub:animate-[grow-bar-2_1.2s_ease-out_forwards]"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card 1: Static Left (Feature) - REFINED POSITION: LEFT & ON TOP */}
                                    <div className="absolute top-[8%] left-[2%] md:left-[8%] lg:left-[12%] animate-reveal delay-200 z-30">
                                        <div className="tech-glass p-3 pr-4 rounded-[10px] flex items-center gap-3 hover-lift cursor-default group/security relative overflow-hidden shadow-lg">
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] opacity-0 group-hover/security:opacity-100 group-hover/security:animate-shimmer pointer-events-none"></div>
                                            <div className="w-8 h-8 rounded-[6px] bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-600 relative z-10">
                                                <ShieldCheck className="w-4 h-4 transition-colors group-hover/security:text-[#171717]" />
                                            </div>
                                            <div className="relative z-10">
                                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-0.5 group-hover/security:text-stone-500 transition-colors">Security</p>
                                                <p className="text-[11px] font-semibold text-[#171717]">SOC2 Compliant</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card 2: Interactive Right (Terminal) - REFINED POSITION: RIGHT */}
                                    <div className="absolute bottom-[10%] right-[2%] md:right-[8%] lg:right-[12%] animate-reveal delay-300 z-30 hidden md:block">
                                        <div className="tech-glass-dark p-4 rounded-[10px] w-[240px] hover-lift group/terminal cursor-default shadow-xl">
                                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                                                <span className="text-[10px] font-mono text-stone-400">worker.ts</span>
                                                <div className="flex gap-1.5">
                                                    <div className="w-2 h-2 rounded-full bg-stone-600 group-hover/terminal:bg-red-500 transition-colors duration-300"></div>
                                                    <div className="w-2 h-2 rounded-full bg-stone-600 group-hover/terminal:bg-yellow-500 transition-colors duration-300 delay-75"></div>
                                                </div>
                                            </div>
                                            <div className="font-mono text-[10px] space-y-1.5">
                                                <div className="opacity-70">
                                                    <span className="text-stone-400">// Initialize infrastructure</span>
                                                </div>
                                                <div>
                                                    <span className="text-purple-400">const</span>{' '}
                                                    <span className="text-white">node</span>{' '}
                                                    <span className="text-stone-400">=</span>{' '}
                                                    <span className="text-blue-400">new</span>{' '}
                                                    <span className="text-yellow-300">Cluster</span><span className="text-stone-400">();</span>
                                                </div>
                                                <div>
                                                    <span className="text-white">node</span><span className="text-stone-400">.</span><span className="text-yellow-300">scale</span><span className="text-stone-400">({'{'}</span> <span className="text-emerald-400">auto: true</span> <span className="text-stone-400">{'}'});</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
