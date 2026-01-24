"use client"

import Link from "next/link"
import { ArrowRight, Check, ChevronDown, } from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import Image from "next/image"
import { AnimatedBorders } from "@/components/ui/animated-borders"
import { PixelCanvas } from "@/components/ui/pixel-canvas"
import { TechStackTicker } from "@/components/ui/tech-stack-ticker"
import { ProcessIllustration } from "@/components/ui/process-illustration"
import { ProcessTimeline } from "@/components/sections/process-timeline"
import { ScrollTypewriter } from "@/components/ui/scroll-typewriter"
import { ExperienceStats } from "@/components/ui/experience-stats"
import { SectionReveal } from "@/components/ui/section-reveal"
import { DeconstructedExpertise } from "@/components/sections/deconstructed-expertise"

export default function AboutPage() {
    return (
        <div className="min-h-screen w-full bg-white text-[#1a1a1a] antialiased relative">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <PixelCanvas />
            </div>

            <div className="relative z-10">
                <Navbar />

                {/* Hero Section */}
                <header className="relative pt-32 pb-20 md:pt-48 md:pb-40 px-6 overflow-hidden flex items-center justify-center min-h-[50vh] md:min-h-[60vh]">

                    {/* Animated Stats in Corners */}
                    <ExperienceStats />

                    <div className="max-w-4xl mx-auto relative z-10 text-center pointer-events-none">
                        <Link href="/admin/login" className="inline-flex items-center gap-3 px-1.5 py-1.5 pr-4 rounded-full bg-[#1a1a1a]/5 border border-[#1a1a1a]/5 backdrop-blur-md mb-8 cursor-pointer group hover:bg-[#1a1a1a]/10 transition-all duration-300 pointer-events-auto">
                            <span className="px-3 py-1 rounded-full bg-[#E8BC59] text-[#1a1a1a] text-[10px] font-bold tracking-wider uppercase leading-none flex items-center">
                                New
                            </span>
                            <span className="text-[13px] font-medium text-[#1a1a1a]/80 group-hover:text-[#1a1a1a] transition-colors">
                                Livv client management app
                            </span>
                        </Link>

                        <h1 className="text-2xl md:text-4xl lg:text-5xl leading-tight md:leading-none font-light tracking-[-0.08em] text-[#1a1a1a] mb-8">
                            Design That<br />
                            <span className="text-gradient-gold pb-2 block mt-2">Scales.</span>
                        </h1>

                        <p className="text-sm md:text-base text-[#1a1a1a]/70 max-w-2xl mx-auto leading-relaxed mb-10 font-light">
                            Boutique design and digital product studio. We transform complexity into scalable systems and experiences that feel inevitable.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pointer-events-auto">
                            <a href="#contact" className="h-12 px-8 rounded-full bg-[#1a1a1a] text-white text-sm font-medium flex items-center justify-center hover:bg-[#1a1a1a]/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-300">
                                Let's Start Together
                            </a>
                            <a href="#team" className="group h-12 px-8 rounded-full bg-transparent border border-[#1a1a1a]/20 text-[#1a1a1a] text-sm font-medium flex items-center justify-center hover:bg-[#1a1a1a]/5 transition-all">
                                Meet the Studio
                                <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                            </a>
                        </div>
                    </div>
                </header>

                {/* Clients Ticker */}
                <SectionReveal>
                    <TechStackTicker />
                </SectionReveal>

                {/* Intro Text - ALREADY ANIMATED WITH SCROLLTYPEWRITER */}
                <section className="py-20 md:py-32 px-6 bg-[#FAFAFA] border-b border-[#1a1a1a]/5 relative group">
                    <AnimatedBorders className="hidden md:block pointer-events-none opacity-20 absolute inset-0 z-0" />
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <ScrollTypewriter as="h2" className="section-heading text-[#1a1a1a] mb-10 block">
                            We design digital products that work like <span className="font-light tracking-[-0.08em] text-gradient-gold">living organisms.</span>
                        </ScrollTypewriter>
                        <div className="space-y-6 text-xl text-[#1a1a1a]/60 leading-relaxed font-light max-w-2xl mx-auto">
                            <ScrollTypewriter as="p">
                                We're not a traditional agency. We're <span className="text-[#1a1a1a] font-normal">livvvv</span>: a boutique studio obsessed with the intersection between flawless aesthetics and business logic.
                            </ScrollTypewriter>
                            <ScrollTypewriter as="p">
                                We design without ego. We don't seek awards, we seek for your users to understand and love your product. We work with founders who value clarity in a noisy digital world.
                            </ScrollTypewriter>
                        </div>
                    </div>
                </section>

                {/* Team */}
                <section id="team" className="py-20 md:py-32 px-6 bg-[#FAFAFA] border-b border-[#1a1a1a]/5 relative">
                    <AnimatedBorders className="hidden md:block pointer-events-none opacity-20 absolute inset-0 z-0" />
                    <SectionReveal className="max-w-6xl mx-auto relative z-10">
                        <h2 className="section-heading text-[#1a1a1a] mb-8 relative z-10">Senior Team Only</h2>
                        <div className="grid grid-cols-2 gap-4 relative z-10 min-h-[500px]">
                            {[
                                {
                                    name: 'Eneas Aldabe',
                                    role: 'Digital Product Builder & Founder',
                                    img: '/images/senior-team-eneas.jpg',
                                    linkedin: 'https://www.linkedin.com/in/eneas-aldabe-creativedigital/'
                                },
                                {
                                    name: 'Luis Cabral',
                                    role: 'Operations Lead',
                                    img: '/assets/team-ana.jpg',
                                    linkedin: '#'
                                }
                            ].map((member, i) => (
                                <a
                                    key={i}
                                    href={member.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group cursor-pointer flex flex-col gap-4 relative h-full transition-transform duration-500 hover:-translate-y-1"
                                >
                                    <div className="w-full h-full bg-[#1a1a1a]/5 overflow-hidden rounded-[4px] relative border border-[#1a1a1a]/5 shadow-sm">
                                        <Image
                                            src={member.img}
                                            alt={member.name}
                                            fill
                                            quality={95}
                                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 40vw, 33vw"
                                            className="object-cover object-top grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                                        />

                                        {/* Overlay gradient for text readability and to hide low-res artifacts */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500"></div>

                                        <div className="absolute bottom-6 left-6 text-white opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                            <h3 className="font-medium text-3xl mb-1">{member.name}</h3>
                                            <p className="text-xs uppercase tracking-[0.2em] font-medium opacity-80">{member.role}</p>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </SectionReveal>
                </section>

                {/* Global Reach Section */}
                <SectionReveal>
                    <section className="py-20 md:py-32 px-6 overflow-hidden bg-[#FAFAFA] text-[#1a1a1a] relative group border-b border-[#1a1a1a]/5">
                        <AnimatedBorders className="hidden md:block pointer-events-none opacity-20 absolute inset-0 z-0" />
                        {/* Abstract Background */}
                        <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-1000" style={{ backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

                        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
                            <div>
                                <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#C18972] mb-8 border border-[#1a1a1a]/10 rounded-full px-4 py-1.5 bg-[#1a1a1a]/5 backdrop-blur-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#C18972] animate-pulse"></span>
                                    Global Mindset
                                </div>
                                <h2 className="section-heading text-[#1a1a1a] mb-8">
                                    From Buenos Aires<br />
                                    <span className="text-gradient-gold">to the World.</span>
                                </h2>
                                <p className="text-[#1a1a1a]/60 mb-10 leading-relaxed max-w-md font-light text-lg">
                                    We leverage world-class talent and a strategic time zone (GMT-3) to collaborate seamlessly with the Americas and Europe.
                                </p>
                                <div className="flex flex-col gap-6">
                                    <div className="flex items-center gap-5 text-sm text-[#1a1a1a]/40 border-l border-[#1a1a1a]/10 pl-6 hover:border-[#C18972] hover:text-[#1a1a1a] transition-all duration-300 cursor-default group/item">
                                        <span className="font-mono text-[#C18972]/50 group-hover/item:text-[#C18972] transition-colors">01</span>
                                        <span className="font-light tracking-wide">Experts in asynchronous management.</span>
                                    </div>
                                    <div className="flex items-center gap-5 text-sm text-[#1a1a1a]/40 border-l border-[#1a1a1a]/10 pl-6 hover:border-[#C18972] hover:text-[#1a1a1a] transition-all duration-300 cursor-default group/item">
                                        <span className="font-mono text-[#C18972]/50 group-hover/item:text-[#C18972] transition-colors">02</span>
                                        <span className="font-light tracking-wide">Fluent English communication.</span>
                                    </div>
                                    <div className="flex items-center gap-5 text-sm text-[#1a1a1a]/40 border-l border-[#1a1a1a]/10 pl-6 hover:border-[#C18972] hover:text-[#1a1a1a] transition-all duration-300 cursor-default group/item">
                                        <span className="font-mono text-[#C18972]/50 group-hover/item:text-[#C18972] transition-colors">03</span>
                                        <span className="font-light tracking-wide">Cost efficiency without sacrificing seniority.</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stylized Map Visualization */}
                            <div className="relative h-[450px] w-full border border-[#1a1a1a]/5 rounded-[10px] bg-[#FAFAFA] p-10 flex items-center justify-center overflow-hidden group/map hover:border-[#1a1a1a]/10 transition-all duration-700 shadow-sm hover:shadow-2xl">
                                {/* Grid Background inside card */}
                                <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

                                {/* SVG Layer for connections */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="rgba(193, 137, 114, 0.1)"></stop>
                                            <stop offset="50%" stopColor="rgba(193, 137, 114, 0.4)"></stop>
                                            <stop offset="100%" stopColor="rgba(0, 0, 0, 0.1)"></stop>
                                        </linearGradient>
                                    </defs>

                                    {/* Path to USA (NY) */}
                                    <path d="M 33 80 Q 20 50 25 25" stroke="url(#lineGradient)" fill="none" strokeWidth="0.15" strokeDasharray="2 2"></path>
                                    <circle r="0.5" fill="#C18972">
                                        <animateMotion repeatCount="indefinite" dur="3s" path="M 33 80 Q 20 50 25 25" keyPoints="0;1" keyTimes="0;1" calcMode="linear"></animateMotion>
                                        <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite"></animate>
                                    </circle>

                                    {/* Path to Canada */}
                                    <path d="M 33 80 Q 15 60 15 15" stroke="rgba(0,0,0,0.1)" fill="none" strokeWidth="0.15" strokeDasharray="2 2"></path>
                                    <circle r="0.5" fill="#1a1a1a" opacity="0.4">
                                        <animateMotion repeatCount="indefinite" dur="4s" begin="1s" path="M 33 80 Q 15 60 15 15" keyPoints="0;1" keyTimes="0;1" calcMode="linear"></animateMotion>
                                        <animate attributeName="opacity" values="0;1;0" dur="4s" begin="1s" repeatCount="indefinite"></animate>
                                    </circle>

                                    {/* Path to Europe */}
                                    <path d="M 33 80 Q 60 40 80 20" stroke="url(#lineGradient)" fill="none" strokeWidth="0.15" strokeDasharray="2 2"></path>
                                    <circle r="0.5" fill="#C18972">
                                        <animateMotion repeatCount="indefinite" dur="3.5s" begin="0.5s" path="M 33 80 Q 60 40 80 20" keyPoints="0;1" keyTimes="0;1" calcMode="linear"></animateMotion>
                                        <animate attributeName="opacity" values="0;1;0" dur="3.5s" begin="0.5s" repeatCount="indefinite"></animate>
                                    </circle>

                                    {/* Path to Chile */}
                                    <path d="M 33 80 Q 28 85 22 75" stroke="rgba(0,0,0,0.1)" fill="none" strokeWidth="0.15" strokeDasharray="2 2"></path>
                                    <circle r="0.4" fill="#1a1a1a" opacity="0.4">
                                        <animateMotion repeatCount="indefinite" dur="2s" begin="0.2s" path="M 33 80 Q 28 85 22 75"></animateMotion>
                                    </circle>

                                    {/* Path to Paraguay */}
                                    <path d="M 33 80 Q 36 75 38 68" stroke="rgba(0,0,0,0.1)" fill="none" strokeWidth="0.15" strokeDasharray="2 2"></path>
                                    <circle r="0.4" fill="#1a1a1a" opacity="0.4">
                                        <animateMotion repeatCount="indefinite" dur="2s" begin="1.5s" path="M 33 80 Q 36 75 38 68"></animateMotion>
                                    </circle>
                                </svg>

                                {/* BA Pin (Source) */}
                                <div className="absolute top-[80%] left-[33%] transform -translate-x-1/2 -translate-y-1/2 z-20 group/pin pointer-events-none">
                                    <div className="w-3 h-3 bg-[#C18972] rounded-full shadow-[0_0_15px_rgba(193,137,114,0.6)] relative z-10 flex items-center justify-center">
                                        <div className="w-1 h-1 bg-[#FFFFFF] rounded-full"></div>
                                    </div>
                                    <div className="absolute inset-0 bg-[#C18972] rounded-full animate-ping opacity-30 duration-1000"></div>
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                        <span className="text-[9px] font-bold tracking-widest text-[#FFFFFF] bg-[#C18972] px-1.5 py-0.5 rounded-sm shadow-md">B.A.</span>
                                    </div>
                                </div>

                                {/* Pins USA, Canada, Europe, Chile, Paraguay */}
                                <div className="absolute top-[25%] left-[25%] transform -translate-x-1/2 -translate-y-1/2 group/pin z-10">
                                    <div className="w-1.5 h-1.5 bg-[#1a1a1a]/50 rounded-full group-hover/map:bg-[#1a1a1a] group-hover/map:scale-125 transition-all duration-500"></div>
                                    <div className="absolute top-3 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover/map:opacity-100 transition-all duration-500 translate-y-1 group-hover/map:translate-y-0">
                                        <span className="text-[9px] text-[#FAFAFA] font-medium tracking-wide bg-[#1a1a1a] px-2 py-0.5 rounded-full shadow-lg">USA</span>
                                    </div>
                                </div>
                                <div className="absolute top-[15%] left-[15%] transform -translate-x-1/2 -translate-y-1/2 group/pin z-10">
                                    <div className="w-1.5 h-1.5 bg-[#1a1a1a]/30 rounded-full group-hover/map:bg-[#1a1a1a] group-hover/map:scale-125 transition-all duration-500 delay-75"></div>
                                    <div className="absolute top-3 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover/map:opacity-100 transition-all duration-500 translate-y-1 group-hover/map:translate-y-0">
                                        <span className="text-[9px] text-[#FAFAFA] font-medium tracking-wide bg-[#1a1a1a] px-2 py-0.5 rounded-full shadow-lg">Canada</span>
                                    </div>
                                </div>
                                <div className="absolute top-[20%] left-[80%] transform -translate-x-1/2 -translate-y-1/2 group/pin z-10">
                                    <div className="w-1.5 h-1.5 bg-[#1a1a1a]/50 rounded-full group-hover/map:bg-[#1a1a1a] group-hover/map:scale-125 transition-all duration-500 delay-100"></div>
                                    <div className="absolute top-3 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover/map:opacity-100 transition-all duration-500 translate-y-1 group-hover/map:translate-y-0">
                                        <span className="text-[9px] text-[#FAFAFA] font-medium tracking-wide bg-[#1a1a1a] px-2 py-0.5 rounded-full shadow-lg">Europe</span>
                                    </div>
                                </div>
                                {/* Smaller pins */}
                                <div className="absolute top-[75%] left-[22%] transform -translate-x-1/2 -translate-y-1/2 group/pin z-10 opacity-50">
                                    <div className="w-1 h-1 bg-[#1a1a1a]/50 rounded-full"></div>
                                </div>
                                <div className="absolute top-[68%] left-[38%] transform -translate-x-1/2 -translate-y-1/2 group/pin z-10 opacity-50">
                                    <div className="w-1 h-1 bg-[#1a1a1a]/50 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </section>
                </SectionReveal>






                {/* Deconstructed Expertise Section */}
                <DeconstructedExpertise />



                {/* Process Section */}
                <SectionReveal>
                    <section className="py-20 md:py-32 px-6 bg-[#FAFAFA] text-[#1a1a1a] relative border-b border-[#1a1a1a]/5">
                        <AnimatedBorders className="hidden md:block pointer-events-none opacity-20 absolute inset-0 z-0" />
                        <div className="max-w-6xl mx-auto relative z-10">
                            {/* Horizontal Cards Timeline */}
                            <ProcessTimeline />
                        </div>
                    </section>
                </SectionReveal>



                {/* FAQ */}
                <section className="py-20 md:py-32 px-6 bg-[#FAFAFA] relative group">
                    <AnimatedBorders className="hidden md:block pointer-events-none opacity-20 absolute inset-0 z-0" />
                    <div className="max-w-3xl mx-auto relative z-10">
                        <h2 className="section-heading text-[#1a1a1a] mb-12">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            {[
                                { q: 'How much does a typical project cost?', a: 'Depends on scope. Landing pages from $2k, full Web Apps from $8k. We always work with fixed price or retainer. Total transparency before starting.' },
                                { q: 'How long do they take?', a: 'Speed is key. Corporate sites in 3-4 weeks. MVP products in 6-8 weeks. We move fast because we eliminate bureaucracy.' },
                                { q: 'What tech stack do you use?', a: 'We design in Figma. We develop sites in Webflow or Framer. For complex apps we use React/Next.js and Node.' }
                            ].map((faq, i) => (
                                <details key={i} className="group border border-[#1a1a1a]/10 rounded-2xl open:bg-[#FAFAFA] transition-all duration-300">
                                    <summary className="flex justify-between items-center cursor-pointer font-medium text-[#1a1a1a]/80 p-6 select-none hover:text-[#1a1a1a] transition-colors">
                                        <span className="text-base">{faq.q}</span>
                                        <ChevronDown className="w-5 h-5 text-[#1a1a1a]/30 group-open:rotate-180 transition-transform duration-300" />
                                    </summary>
                                    <div className="px-6 pb-6 text-base text-[#1a1a1a]/60 leading-relaxed font-light">
                                        {faq.a}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer CTA */}
                <footer id="contact" className="relative py-20 md:py-32 px-6 overflow-hidden">
                    <div className="absolute inset-0 bg-[#1a1a1a] -z-20"></div>
                    <div className="max-w-5xl mx-auto text-center relative z-10">
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-[-0.08em] text-white mb-8">
                            Tell Us What<br />You're <span className="text-gradient-gold pb-2">Building.</span>
                        </h2>
                        <p className="text-white/50 text-xl mb-16 max-w-xl mx-auto font-light leading-relaxed">
                            Let's see if we're the right fit. No commitment.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-24">
                            <a href="mailto:hola@livv.systems" className="group h-14 px-10 rounded-full bg-white text-[#1a1a1a] font-medium flex items-center justify-center hover:bg-white/90 transition-all w-full sm:w-auto hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] duration-300">
                                Send an email
                                <ArrowRight className="w-5 h-5 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                            </a>
                            <a href="https://cal.com/eneas-aldabe-youfep/15min" target="_blank" rel="noopener noreferrer" className="h-14 px-10 rounded-full border border-white/20 text-white font-medium flex items-center justify-center hover:bg-white/5 hover:border-white/40 transition-all w-full sm:w-auto">
                                Schedule 15 min
                            </a>
                        </div>

                        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-white/30 font-light">
                            <div className="font-medium text-white/40">livvvv © 2025</div>
                            <div className="flex gap-8">
                                <a href="https://www.linkedin.com/company/39648193/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
                                <a href="https://github.com/livvstudio" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
                            </div>
                        </div>
                    </div>
                </footer>

            </div>
        </div>
    )
}
