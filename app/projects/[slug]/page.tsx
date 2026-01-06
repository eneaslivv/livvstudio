"use client"

import { ArrowLeft, ArrowUpRight, ArrowRight, Download, Monitor, Palette, Type, Check, X } from "lucide-react"
import Link from "next/link"
import { Inter, Playfair_Display } from "next/font/google"
import { Navbar } from "@/components/layout/navbar"
import { FooterSection } from "@/components/sections/footer-section"
import { RecommendedProjects } from "@/components/sections/recommended-projects"

const inter = Inter({ subsets: ["latin"] })
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600"] })

export default function ProjectPage({ params }: { params: { slug: string } }) {
    return (
        <main className={`bg-[#FAF8F3] text-[#2A1818] selection:bg-[#E6E2D6] min-h-screen ${inter.className}`}>
            <Navbar />
            <div className="pt-40 md:pt-52">
                <div className="max-w-6xl mx-auto px-6 pb-12 md:pb-20">

                    {/* Header Section */}
                    <header className="flex flex-col items-center text-center mb-16">
                        <div className="flex items-center gap-2 mb-8">
                            <span className="px-3 py-1 border border-[#D6D1C5] rounded-full text-xs uppercase tracking-wide text-[#5A3E3E] font-medium bg-[#FAFAFA]">Product</span>
                            <span className="px-3 py-1 border border-[#D6D1C5] rounded-full text-xs uppercase tracking-wide text-[#5A3E3E] font-medium bg-[#FAFAFA]">2024</span>
                            <span className="px-3 py-1 border border-[#D6D1C5] rounded-full text-xs uppercase tracking-wide text-[#5A3E3E] font-medium bg-[#FAFAFA]">System</span>
                        </div>

                        <h1 className={`text-5xl md:text-7xl tracking-tighter mb-6 text-[#2A1818] ${playfair.className}`}>
                            Global Payments
                        </h1>

                        <p className="text-lg md:text-xl text-[#5A3E3E]/80 max-w-2xl leading-relaxed">
                            Reimagining the infrastructure of global commerce with a focus on developer experience and conversion optimization.
                        </p>
                    </header>

                    {/* Hero Image Mockup */}
                    <div className="relative w-full rounded-2xl overflow-hidden mb-24 md:mb-32 shadow-2xl shadow-[#2A1818]/5">
                        {/* Background Texture - kept subtle */}
                        <div className="absolute inset-0 z-0 bg-[#E6E2D6] opacity-30">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                        </div>

                        {/* Browser Window Mockup */}
                        <div className="relative z-10 pt-12 md:pt-20 px-4 md:px-12 pb-0">
                            <div className="bg-[#FAF8F3] rounded-t-xl shadow-2xl border border-[#D6D1C5]/50 overflow-hidden">
                                <div className="h-10 bg-[#FAF8F3] border-b border-[#D6D1C5] flex items-center px-4 gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#E6E2D6] border border-[#D6D1C5]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#E6E2D6] border border-[#D6D1C5]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#E6E2D6] border border-[#D6D1C5]"></div>
                                </div>
                                <div className="bg-[#2A1818] aspect-video w-full relative group overflow-hidden">
                                    <img
                                        src="/images/task-ui.png"
                                        alt="Dashboard"
                                        className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 1: Problem Definition */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 mb-24 md:mb-32">
                        <div className="md:col-span-8">
                            <span className="text-xs font-medium text-[#C4A35A] uppercase tracking-widest mb-4 block">The Challenge</span>
                            <h2 className={`text-3xl md:text-4xl text-[#2A1818] tracking-tight mb-8 leading-tight ${playfair.className}`}>
                                Defining the core problem and finding an elegant, scalable solution for fragmented payment gateways.
                            </h2>
                            <div className="space-y-6 text-lg text-[#5A3E3E]/70 leading-relaxed">
                                <p>
                                    We started with a robust discovery phase, unpacking user needs and technical bottlenecks. The goal was to reduce friction at checkout while engaging the user seamlessly through the payment journey, ensuring the development stack integrated APIs with minimal latency.
                                </p>
                                <p>
                                    By unifying the data, API documentation, and user interface, we created a consistent experience across all touchpoints.
                                </p>
                            </div>
                        </div>

                        <div className="md:col-span-4 space-y-12">
                            <div>
                                <h3 className="text-xs font-semibold text-[#2A1818] uppercase tracking-widest mb-4">Tools Used</h3>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1.5 bg-[#FAFAFA] border border-[#D6D1C5] rounded text-xs font-medium text-[#5A3E3E]">Figma</span>
                                    <span className="px-3 py-1.5 bg-[#FAFAFA] border border-[#D6D1C5] rounded text-xs font-medium text-[#5A3E3E]">Next.js</span>
                                    <span className="px-3 py-1.5 bg-[#FAFAFA] border border-[#D6D1C5] rounded text-xs font-medium text-[#5A3E3E]">React</span>
                                    <span className="px-3 py-1.5 bg-[#FAFAFA] border border-[#D6D1C5] rounded text-xs font-medium text-[#5A3E3E]">Tailwind</span>
                                    <span className="px-3 py-1.5 bg-[#FAFAFA] border border-[#D6D1C5] rounded text-xs font-medium text-[#5A3E3E]">Vercel</span>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-semibold text-[#2A1818] uppercase tracking-widest mb-4">KPI Summary</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2 text-sm text-[#5A3E3E]">
                                        <ArrowUpRight className="w-4 h-4 text-[#C4A35A] mt-0.5" />
                                        Increased conversion by 12%
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-[#5A3E3E]">
                                        <ArrowUpRight className="w-4 h-4 text-[#C4A35A] mt-0.5" />
                                        Reduced API latency by 40%
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-[#5A3E3E]">
                                        <ArrowUpRight className="w-4 h-4 text-[#C4A35A] mt-0.5" />
                                        Zero downtime peak
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Wireframe/Structure */}
                    <div className="mb-24 md:mb-32">
                        <p className="text-xs text-[#5A3E3E]/60 mb-4 ml-1 uppercase tracking-widest">Campaign structure layer</p>
                        <div className="bg-[#E6E2D6]/30 border border-[#D6D1C5] rounded-xl p-6 md:p-12">
                            <div className="bg-[#FAF8F3] rounded-lg shadow-sm border border-[#D6D1C5] p-4 aspect-[16/9] flex flex-col gap-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-[#2A1818]"></div>
                                    <div className="w-2 h-2 rounded-full bg-[#E6E2D6]"></div>
                                    <div className="w-2 h-2 rounded-full bg-[#E6E2D6]"></div>
                                </div>
                                <div className="flex-1 flex gap-4">
                                    <div className="w-1/4 bg-[#E6E2D6]/50 rounded h-full border border-[#D6D1C5]/30"></div>
                                    <div className="flex-1 flex flex-col gap-4">
                                        <div className="h-1/3 w-full bg-[#E6E2D6]/50 rounded flex items-center justify-center border border-[#D6D1C5]/30"></div>
                                        <div className="h-2/3 w-full bg-[#E6E2D6]/50 rounded flex items-center justify-center relative border border-[#D6D1C5]/30">
                                            <Monitor className="w-8 h-8 text-[#D6D1C5] absolute" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: High Fidelity Interface */}
                    <div className="mb-24 md:mb-32">
                        <div className="flex justify-between items-end mb-6">
                            <h3 className="text-sm font-medium text-[#2A1818] uppercase tracking-widest">High fidelity interface</h3>
                            <span className="text-xs text-[#5A3E3E]/60">1/2</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Light Mode Card */}
                            <div className="bg-[#FFFFFF] rounded-xl border border-[#D6D1C5] p-12 flex justify-center items-center h-[500px]">
                                <div className="w-[200px] h-[380px] bg-white rounded-[2rem] border-4 border-white shadow-[0_20px_50px_rgba(42,24,24,0.1)] relative overflow-hidden flex flex-col">
                                    <div className="h-6 w-full flex justify-center items-center bg-[#FAFAFA]">
                                        <div className="w-16 h-4 bg-[#E5E5E5] rounded-b-xl"></div>
                                    </div>
                                    <div className="p-4 space-y-3 flex-1">
                                        <div className="w-12 h-12 bg-[#F5F5F5] rounded-full mb-4"></div>
                                        <div className="h-2 w-20 bg-[#E5E5E5] rounded"></div>
                                        <div className="h-2 w-32 bg-[#F5F5F5] rounded"></div>
                                    </div>
                                    <div className="p-4 pt-0">
                                        <div className="h-10 w-full bg-[#171717] rounded-lg"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Dark Mode Card */}
                            <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-12 flex justify-center items-center h-[500px]">
                                <div className="w-[200px] h-[380px] bg-[#171717] rounded-[2rem] border-4 border-[#171717] shadow-2xl relative overflow-hidden flex flex-col">
                                    <div className="h-6 w-full flex justify-center items-center bg-[#0A0A0A]">
                                        <div className="w-16 h-4 bg-[#262626] rounded-b-xl"></div>
                                    </div>
                                    <div className="p-4 space-y-3 flex-1">
                                        <div className="flex gap-2">
                                            <div className="w-8 h-8 bg-[#262626] rounded-lg"></div>
                                            <div className="flex-1 h-8 bg-[#262626] rounded-lg"></div>
                                        </div>
                                    </div>
                                    <div className="p-4 pt-0 flex justify-center">
                                        <div className="w-1/3 h-1 bg-white/20 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Atomic Foundation */}
                    <div className="mb-24 md:mb-32">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                            <div className="max-w-xl">
                                <span className="text-xs font-semibold text-[#C4A35A] uppercase tracking-widest mb-3 block">Design Language</span>
                                <h2 className={`text-3xl md:text-4xl text-[#2A1818] mb-4 ${playfair.className}`}>System & Assets</h2>
                                <p className="text-base md:text-lg text-[#5A3E3E]/70 leading-relaxed">A comprehensive set of foundational elements defining the visual hierarchy and interaction patterns.</p>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-[#FFFFFF] border border-[#D6D1C5] rounded-lg text-xs font-medium text-[#5A3E3E] hover:bg-[#FAFAFA] hover:border-[#C4A35A]/50 transition-all shadow-sm group whitespace-nowrap">
                                <Download className="w-3.5 h-3.5 text-[#C4A35A] group-hover:text-[#5A3E3E] transition-colors" />
                                Download Brand Assets
                            </button>
                        </div>

                        {/* Grid System */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                            {/* Left Column: Typeface */}
                            <div className="lg:col-span-5 bg-white rounded-3xl border border-[#D6D1C5] p-8 flex flex-col justify-between relative overflow-hidden h-[600px] lg:h-auto shadow-[0_2px_20px_rgba(42,24,24,0.03)]">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-mono text-[10px] uppercase tracking-widest text-[#D6D1C5] font-medium">Typeface</span>
                                        <Type className="w-4 h-4 text-[#D6D1C5]" />
                                    </div>
                                    <h3 className="text-sm font-medium text-[#2A1818] mb-16">Inter Display</h3>

                                    <div className="text-8xl md:text-9xl font-medium tracking-tighter text-[#2A1818] mb-8 leading-none">Aa</div>

                                    <p className="text-2xl md:text-3xl tracking-tight text-[#D6D1C5] leading-tight font-light">
                                        The quick brown fox jumps over the lazy dog.
                                    </p>
                                </div>

                                <div className="grid grid-cols-3 gap-4 pt-12 mt-auto relative z-10">
                                    <div>
                                        <div className="font-mono text-[10px] text-[#D6D1C5] mb-1">400</div>
                                        <div className="text-xs font-normal text-[#2A1818]">Regular</div>
                                    </div>
                                    <div>
                                        <div className="font-mono text-[10px] text-[#D6D1C5] mb-1">500</div>
                                        <div className="text-xs font-medium text-[#2A1818]">Medium</div>
                                    </div>
                                    <div>
                                        <div className="font-mono text-[10px] text-[#D6D1C5] mb-1">600</div>
                                        <div className="text-xs font-semibold text-[#2A1818]">Semibold</div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="lg:col-span-7 flex flex-col gap-6">

                                {/* Colors */}
                                <div className="bg-white rounded-3xl border border-[#D6D1C5] p-8 shadow-[0_2px_20px_rgba(42,24,24,0.03)]">
                                    <div className="flex justify-between items-start mb-8">
                                        <span className="font-mono text-[10px] uppercase tracking-widest text-[#D6D1C5] font-medium">Color Variables</span>
                                        <Palette className="w-4 h-4 text-[#D6D1C5]" />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                        {/* Color 1 */}
                                        <div className="group cursor-default">
                                            <div className="aspect-[4/3] w-full bg-[#18181B] rounded-xl mb-4 shadow-sm border border-neutral-100 group-hover:scale-[1.02] transition-transform duration-300"></div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-medium text-[#2A1818]">Zinc 900</p>
                                                <p className="font-mono text-[10px] text-[#D6D1C5]">#18181B</p>
                                            </div>
                                        </div>
                                        {/* Color 2 */}
                                        <div className="group cursor-default">
                                            <div className="aspect-[4/3] w-full bg-[#FAF8F3] rounded-xl mb-4 shadow-sm border border-[#D6D1C5] group-hover:scale-[1.02] transition-transform duration-300"></div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-medium text-[#2A1818]">Cream</p>
                                                <p className="font-mono text-[10px] text-[#D6D1C5]">#FAF8F3</p>
                                            </div>
                                        </div>
                                        {/* Color 3 */}
                                        <div className="group cursor-default">
                                            <div className="aspect-[4/3] w-full bg-[#C4A35A] rounded-xl mb-4 shadow-sm border border-neutral-200 group-hover:scale-[1.02] transition-transform duration-300"></div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-medium text-[#2A1818]">Gold</p>
                                                <p className="font-mono text-[10px] text-[#D6D1C5]">#C4A35A</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Split */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
                                    {/* Components (Dark) */}
                                    <div className="bg-[#18181B] rounded-3xl border border-neutral-800 p-8 shadow-xl flex flex-col justify-between sm:col-span-2">
                                        <div className="flex justify-between items-start mb-6">
                                            <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 font-medium">Components</span>
                                            <div className="flex gap-1">
                                                <div className="w-1 h-1 rounded-full bg-neutral-600"></div>
                                                <div className="w-1 h-1 rounded-full bg-neutral-600"></div>
                                            </div>
                                        </div>

                                        <div className="space-y-5 flex-1 flex flex-col justify-center">
                                            <div>
                                                <p className="font-mono text-[10px] text-neutral-600 mb-2">Btn.Primary</p>
                                                <button className="w-full bg-white text-neutral-900 text-xs font-medium py-2.5 rounded-lg shadow-lg hover:bg-neutral-100 transition">Action</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* REPLACED BANNER */}
                    <div className="relative w-full rounded-[2.5rem] overflow-hidden mb-12 bg-[#2A1818] h-72 md:h-80 shadow-2xl shadow-[#2A1818]/20">
                        {/* Background Gradient Overlay for depth */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#1A0F0F] via-[#2A1818] to-[#1A0F0F] opacity-100"></div>

                        {/* Content Container */}
                        <div className="relative z-10 h-full p-8 md:p-14 flex flex-col justify-between">
                            {/* Text */}
                            <h2 className={`text-3xl md:text-5xl tracking-tight leading-tight text-[#FAF8F3] max-w-lg ${playfair.className}`}>
                                Redefine wellness <span className="text-[#FAF8F3]/30">with<br />exclusive specials</span>
                            </h2>

                            {/* Controls */}
                            <div className="absolute bottom-10 right-10 flex flex-col items-end gap-4">
                                {/* Arrows */}
                                <div className="flex gap-3">
                                    <button className="w-10 h-10 rounded-full border border-[#FAF8F3]/10 bg-[#FAF8F3]/5 flex items-center justify-center text-[#FAF8F3]/70 hover:bg-[#FAF8F3]/10 hover:text-[#FAF8F3] transition-all">
                                        <ArrowLeft className="w-4 h-4" />
                                    </button>
                                    <button className="w-10 h-10 rounded-full border border-[#FAF8F3]/10 bg-[#FAF8F3]/5 flex items-center justify-center text-[#FAF8F3]/70 hover:bg-[#FAF8F3]/10 hover:text-[#FAF8F3] transition-all">
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Pagination Dots */}
                                <div className="flex gap-1.5 mr-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#FAF8F3]"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#FAF8F3]/20"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#FAF8F3]/20"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#FAF8F3]/20"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div> {/* End max-w-6xl */}
            </div> {/* End pt-24 */}

            <RecommendedProjects />
            <FooterSection />
        </main>
    )
}
