'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { FlowerCanvas } from '@/components/ui/flower-canvas';

// Mock Icon component since we don't have lucide-react integration verified in this file context,
// but we will use the script tag for Iconify as before for simplicity, or use standard SVGs if needed.
// Actually, let's use the Iconify script logic again for consistency with the previous working version,
// but we'll wrap it in a clearer structure.

const Section = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.section
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`mb-32 ${className}`}
        >
            {children}
        </motion.section>
    );
};

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
        {children}
    </motion.div>
);

const TimelineLine = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });
    const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    return (
        <div ref={ref} className="absolute left-[8px] top-24 bottom-24 w-0.5 bg-[#2c0405]/5 hidden md:block">
            <motion.div
                className="w-full bg-[#822b2e]"
                style={{ height }}
            />
        </div>
    );
};

export default function KrufoodPresentation() {
    const { scrollYProgress } = useScroll();
    const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

    return (
        <div className="bg-[#fffffa] text-[#2c0405] font-sans antialiased selection:bg-[#822b2e] selection:text-white min-h-screen relative overflow-x-hidden">

            {/* Scroll Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-[#822b2e] origin-left z-50"
                style={{ scaleX }}
            />

            {/* Background Grid Effect */}
            <div className="fixed inset-0 pointer-events-none z-0" style={{
                backgroundSize: '40px 40px',
                backgroundImage: 'linear-gradient(to right, rgba(44, 4, 5, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(44, 4, 5, 0.03) 1px, transparent 1px)'
            }}></div>
            <div className="fixed inset-0 bg-gradient-to-b from-transparent via-[#fffffa]/50 to-[#fffffa] z-0 pointer-events-none"></div>

            {/* Navigation */}
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative z-50 w-full px-6 py-6 flex justify-between items-center max-w-7xl mx-auto"
            >
                <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="w-2.5 h-2.5 bg-[#2c0405] rounded-full group-hover:bg-[#822b2e] transition-colors duration-300"></div>
                    <span className="font-bold tracking-tighter text-[#2c0405] text-lg">LIVV</span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex gap-1 items-center px-3 py-1 rounded-full border border-[#2c0405]/10 bg-white/50 backdrop-blur-sm shadow-sm">
                        <div className="w-1.5 h-1.5 bg-[#822b2e] rounded-full animate-pulse"></div>
                        <span className="text-xs font-mono text-[#2c0405]/60">STRATEGY MODE: ACTIVE</span>
                    </div>
                    <button className="text-[#2c0405]/60 hover:text-[#2c0405] transition-colors">
                        <span className="iconify" data-icon="lucide:arrow-right-circle" data-width="24"></span>
                    </button>
                </div>
            </motion.nav>

            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-32">

                {/* 1. Cover / Opening */}
                <section className="mb-32 min-h-[60vh] flex flex-col justify-center">
                    <div className="flex flex-col gap-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-wrap gap-4 text-xs font-mono text-[#2c0405]/60 uppercase tracking-wider"
                        >
                            <span className="px-2 py-1 border border-[#2c0405]/10 rounded bg-white/50">[ FOR: KRUFOOD ]</span>
                            <span className="px-2 py-1 border border-[#2c0405]/10 rounded bg-white/50">[ TOPIC: DIGITAL ARCHITECTURE ]</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                            className="relative text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tighter text-[#2c0405] text-balance leading-[0.9]"
                        >
                            EVOLVING THE <br />
                            <span className="text-[#2c0405]/40">KRU LEGACY.</span>

                            {/* Animated Flower Decoration */}
                            <div className="absolute top-2 right-0 md:right-12 w-32 h-32 md:w-48 md:h-48 opacity-80 pointer-events-auto hidden md:block">
                                <FlowerCanvas />
                            </div>
                        </motion.h1>

                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.8, duration: 1, ease: "anticipate" }}
                            className="w-full h-px bg-gradient-to-r from-[#2c0405]/10 via-[#2c0405]/20 to-[#2c0405]/5 my-4 origin-left"
                        ></motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="text-lg md:text-xl text-[#2c0405]/70 max-w-2xl font-light leading-relaxed"
                        >
                            A strategic proposal to transform <span className="text-[#822b2e] font-medium">Krufood Kitchen + Market's</span> digital infrastructure.
                            Not a generic presentation; this is the blueprint for scaling your culinary excellence to an Enterprise level.
                        </motion.p>
                    </div>
                </section>

                {/* Client Logos Slider (Inline for transparency) */}
                <section className="mb-32 overflow-hidden">
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center text-[10px] font-medium text-[#2c0405]/40 tracking-widest uppercase mb-8"
                    >
                        Trusted by Industry Leaders
                    </motion.p>

                    <div className="flex w-full" style={{ maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)" }}>
                        <motion.div
                            className="flex items-center gap-12 md:gap-24 pr-12 md:pr-24"
                            animate={{ x: "-50%" }}
                            transition={{ duration: 30, ease: "linear", repeat: Infinity }}
                            style={{ width: "max-content" }}
                        >
                            {[
                                // Duplicate list 4 times to ensure enough length for seamless loop
                                ...Array(4).fill([
                                    { src: "/logos-header/blackbox.png", alt: "Blackbox AI" },
                                    { src: "/logos-header/buda.png", alt: "Buda.com" },
                                    { src: "/logos-header/heygen.png", alt: "HeyGen" },
                                    { src: "/logos-header/logo-6.png", alt: "ViewFi" },
                                    { src: "/logos-header/logo-7.png", alt: "Remax" },
                                    { src: "/logos-header/sacoa.png", alt: "Sacoa" },
                                    { src: "/logos-header/wortise.png", alt: "Wortise" }
                                ]).flat()
                            ].map((logo, i) => (
                                <div key={i} className="relative w-28 h-12 flex-shrink-0 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer">
                                    {/* Using standard img for simplicity in this file context, consistent with previous blocks */}
                                    <img
                                        src={logo.src}
                                        alt={logo.alt}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* 2. Brand Context & Understanding (Bento Style) */}
                <Section className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4">

                    {/* Main Context Card */}
                    <div className="col-span-1 md:col-span-6 lg:col-span-8 row-span-2 bg-white/60 backdrop-blur-md border border-[#2c0405]/10 rounded-xl p-8 relative overflow-hidden group">
                        <div className="absolute top-6 left-6 z-20">
                            <h3 className="text-[#2c0405] font-semibold tracking-tight flex items-center gap-2 bg-[#fffffa]/80 backdrop-blur px-2 py-1 rounded border border-[#2c0405]/5">
                                <span className="iconify text-[#822b2e]" data-icon="lucide:target"></span>
                                MARKET POSITIONING
                            </h3>
                            <p className="text-xs font-mono text-[#2c0405]/50 mt-2 ml-1">STATUS: CULTURAL LEADERS</p>
                        </div>

                        <div className="mt-20">
                            <p className="text-lg text-[#2c0405] leading-relaxed max-w-xl">
                                Krufood doesn't just sell sauces; it sells <span className="text-[#822b2e] font-semibold">culture and wellness</span>.
                                Your brand has achieved something rare: tribal loyalty based on authenticity.
                            </p>
                            <div className="grid grid-cols-2 gap-8 mt-12">
                                <div>
                                    <h4 className="font-mono text-[10px] text-[#2c0405]/40 uppercase mb-2">Current Challenge</h4>
                                    <p className="text-sm text-[#2c0405]/70">Current infrastructure limits scalability and clarity of the premium message in the face of imminent growth.</p>
                                </div>
                                <div>
                                    <h4 className="font-mono text-[10px] text-[#2c0405]/40 uppercase mb-2">Opportunities</h4>
                                    <p className="text-sm text-[#2c0405]/70">Fusing visual storytelling with a high-fidelity conversion system.</p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-0 right-0 w-64 h-64 opacity-5 pointer-events-none">
                            <span className="iconify w-full h-full text-[#2c0405]" data-icon="lucide:flame"></span>
                        </div>
                    </div>

                    {/* Metrics / Goal Card */}
                    <div className="col-span-1 md:col-span-3 lg:col-span-4 bg-white/60 backdrop-blur-md border border-[#2c0405]/10 rounded-xl p-8 flex flex-col justify-between group hover:border-[#2c0405]/20 transition-colors">
                        <div className="flex justify-between items-start">
                            <span className="iconify text-[#2c0405]/40 group-hover:text-[#822b2e] transition-colors" data-icon="lucide:zap" data-width="24"></span>
                            <span className="text-xs font-mono text-[#822b2e] bg-[#822b2e]/10 px-2 py-0.5 rounded border border-[#822b2e]/20">PRIORITY</span>
                        </div>
                        <div>
                            <span className="text-5xl md:text-6xl font-mono text-[#2c0405] tracking-tighter">100%</span>
                            <p className="text-sm text-[#2c0405]/50 mt-2 font-mono">BRAND CONSISTENCY</p>
                            <p className="text-xs text-[#2c0405]/70 mt-4 leading-relaxed">
                                Total alignment of UX and visual narrative at every touchpoint.
                            </p>
                        </div>
                    </div>

                    {/* Efficiency Card */}
                    <div className="col-span-1 md:col-span-3 lg:col-span-4 bg-white/60 backdrop-blur-md border border-[#2c0405]/10 rounded-xl p-8 flex flex-col justify-end group hover:border-[#2c0405]/20 transition-colors relative overflow-hidden">
                        <div className="flex items-end gap-2 mb-2">
                            <span className="text-4xl md:text-5xl font-mono text-[#2c0405] tracking-tighter">X2</span>
                            <span className="iconify text-[#822b2e] mb-2" data-icon="lucide:trending-up" data-width="20"></span>
                        </div>
                        <p className="text-sm text-[#2c0405]/60 font-medium uppercase text-xs">Management Capacity</p>
                        <div className="mt-4 h-1 bg-[#2c0405]/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: "75%" }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-[#822b2e]"
                            ></motion.div>
                        </div>
                    </div>
                </Section>

                {/* Visual Strategy / Photography Styles Slider */}
                <section className="mb-32 pl-6">
                    <div className="flex justify-between items-end mb-8 pr-6">
                        <h3 className="text-sm font-mono text-[#2c0405]/50 uppercase tracking-widest">02.5 // IMAGE_PROTOTYPES</h3>
                        <div className="hidden md:flex gap-2">
                            <div className="px-3 py-1 bg-[#2c0405] text-white text-[10px] font-mono rounded-full">SCROLL_TO_EXPLORE ➜</div>
                        </div>
                    </div>

                    {/* Infinite Scroll Container */}
                    <div className="relative w-full overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)" }}>
                        <motion.div
                            className="flex w-max"
                            animate={{ x: "-50%" }}
                            transition={{ duration: 30, ease: "linear", repeat: Infinity }}
                            style={{ width: "max-content" }}
                            whileHover={{ animationPlayState: "paused" }}
                        >
                            {/* Duplicate 4 times for seamless loop */}
                            {[...Array(4)].flatMap(() => [
                                { title: "Smoke Garlic", desc: "Studio Context / Warmth", src: "/presentation/krufood/prototypes/bottle-1.jpg" },
                                { title: "Product Focus", desc: "Isolated / Clean", src: "/presentation/krufood/prototypes/bottle-2.png" },
                                { title: "Shadow Play", desc: "Dramatic / Premium", src: "/presentation/krufood/prototypes/bottle-3.png" },
                                { title: "Stack Composition", desc: "Creative / Balanced", src: "/presentation/krufood/prototypes/bottle-4.png" },
                                { title: "Motion Blur", desc: "Dynamic / Energetic", src: "/presentation/krufood/prototypes/bottle-5.jpg" }
                            ]).map((style, i) => (
                                <div
                                    key={i}
                                    className="min-w-[300px] md:min-w-[400px] h-[500px] mx-2 rounded-[10px] overflow-hidden relative group cursor-pointer bg-gray-100 flex-shrink-0"
                                >
                                    <img
                                        src={style.src}
                                        alt={style.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

                                    <div className="absolute bottom-0 left-0 p-8 w-full">
                                        <h4 className="text-2xl font-semibold mb-2 text-white">{style.title}</h4>
                                        <p className="text-white/70 text-sm">{style.desc}</p>
                                        <div className="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300">
                                            <span className="text-white text-xs font-mono uppercase tracking-widest">View Prototype</span>
                                            <span className="iconify text-white" data-icon="lucide:arrow-right" data-width="16"></span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* 3. Objectives (Capabilities Style) */}
                <Section>
                    <div className="flex justify-between items-end mb-8 border-b border-[#2c0405]/10 pb-4">
                        <h3 className="text-sm font-mono text-[#2c0405]/50 uppercase tracking-widest">03 // STRATEGIC_OBJECTIVES</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: "layout-grid", title: "Scalable System", desc: "Building a digital infrastructure that grows at the pace of your market without generating technical debt." },
                            { icon: "user-check", title: "Clarity & Conversion", desc: "Redesigning the purchase flow and product exposure to maximize conversion and AOV." },
                            { icon: "cpu", title: "Team Independence", desc: "Empowering Krufood's internal team to manage content and data without external technical dependency." }
                        ].map((item, i) => (
                            <FadeIn key={i} delay={i * 0.1}>
                                <div className="h-full p-6 rounded-lg border border-[#2c0405]/10 bg-white hover:border-[#2c0405]/20 hover:shadow-lg hover:shadow-[#2c0405]/5 transition-all duration-500">
                                    <div className="w-10 h-10 rounded bg-[#f5f4f3] border border-[#2c0405]/5 flex items-center justify-center mb-6 group-hover:text-[#822b2e] transition-colors">
                                        <span className="iconify" data-icon={`lucide:${item.icon}`} data-width="20"></span>
                                    </div>
                                    <h4 className="text-[#2c0405] font-medium mb-2 uppercase text-sm tracking-tight">{item.title}</h4>
                                    <p className="text-xs text-[#2c0405]/60 leading-relaxed">{item.desc}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </Section>

                {/* 4. Scope of Work (Detailed Bar Style) */}
                <Section>
                    <div className="w-full bg-[#2c0405] rounded-2xl overflow-hidden p-8 md:p-12 relative">
                        <h2 className="text-white font-mono text-sm tracking-widest uppercase mb-12 flex items-center gap-2">
                            <div className="w-3 h-3 bg-[#ff4d4d] rounded-sm"></div>
                            04 // SCOPE_OF_WORK
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                            <FadeIn delay={0.2}>
                                <h3 className="text-white text-xl font-medium mb-4">Strategy & UX</h3>
                                <ul className="space-y-3 text-white/50 text-sm">
                                    <li className="flex items-center gap-2 italic">/ Digital Brand Architecture Audit</li>
                                    <li className="flex items-center gap-2 italic">/ User Flow Remapping (Shopify optimization)</li>
                                    <li className="flex items-center gap-2 italic">/ High-Fidelity Interface Design (High-End)</li>
                                </ul>
                            </FadeIn>
                            <FadeIn delay={0.4}>
                                <h3 className="text-white text-xl font-medium mb-4">Development & Systems</h3>
                                <ul className="space-y-3 text-white/50 text-sm">
                                    <li className="flex items-center gap-2 italic">/ Headless CMS Implementation if required</li>
                                    <li className="flex items-center gap-2 italic">/ Inventory & Logistics Automation</li>
                                    <li className="flex items-center gap-2 italic">/ Database Migration & Optimization</li>
                                </ul>
                            </FadeIn>
                        </div>
                    </div>
                </Section>

                {/* 5. Process & Timeline (Enhanced with Notion & Animation) */}
                <Section className="relative">
                    {/* Enhanced Animated Timeline Line */}
                    <TimelineLine />

                    <div className="max-w-4xl mx-auto md:mx-0 md:pl-8">
                        <div className="mb-12">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2c0405]/10 bg-white text-xs font-mono text-[#822b2e] mb-4">
                                <div className="w-1 h-1 bg-[#822b2e] rounded-full animate-pulse"></div>
                                05 // WORKFLOW_INTEGRATION
                            </span>
                            <h2 className="text-3xl font-semibold text-[#2c0405]">Transparent Execution.</h2>
                            <p className="text-[#2c0405]/60 mt-2 max-w-lg">Everything is documented in <span className="font-semibold text-[#2c0405]">Notion</span>. You have full visibility, 24/7.</p>
                        </div>

                        <div className="space-y-16">
                            {[
                                {
                                    phase: "01",
                                    title: "Radical Alignment & Setup",
                                    desc: "Deep discovery with founders. We set up the Notion Project Dashboard.",
                                    details: ["Kick-off Meeting", "KPI Definition", "Notion Access Granted"]
                                },
                                {
                                    phase: "02",
                                    title: "Visual Architecture",
                                    desc: "Interactive prototyping. Design validation. Weekly updates.",
                                    details: ["UX Wireframes", "UI High-Fidelity", "Design Approval on Notion"]
                                },
                                {
                                    phase: "03",
                                    title: "Build & Integration",
                                    desc: "Coding and automation setup. Stress testing.",
                                    details: ["Development Sprints", "Staging Environment", "Integration Tests"]
                                },
                                {
                                    phase: "04",
                                    title: "Launch & Scale",
                                    desc: "Strategic go-live. Post-launch monitoring.",
                                    details: ["Final QA", "Go-Live Event", "Handover Documentation in Notion"]
                                }
                            ].map((item, i) => (
                                <div key={i} className="relative group">
                                    {/* Timeline Dot */}
                                    <div className="absolute -left-[41px] top-1.5 w-6 h-6 bg-[#fffffa] border border-[#2c0405]/10 rounded-full flex items-center justify-center z-10 hidden md:flex group-hover:border-[#822b2e] transition-colors">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            transition={{ delay: 0.2 + (i * 0.2) }}
                                            className="w-2 h-2 bg-[#822b2e] rounded-full"
                                        ></motion.div>
                                    </div>

                                    <FadeIn delay={i * 0.2}>
                                        <div className="flex flex-col md:flex-row gap-6 md:items-start border border-[#2c0405]/5 p-6 rounded-xl hover:border-[#2c0405]/20 hover:bg-white/50 transition-colors cursor-default">
                                            <span className="text-4xl font-mono text-[#2c0405]/10 font-bold">
                                                {item.phase}
                                            </span>
                                            <div>
                                                <h4 className="text-xl font-medium text-[#2c0405] group-hover:text-[#822b2e] transition-colors">{item.title}</h4>
                                                <p className="text-sm text-[#2c0405]/60 mt-2 mb-4 leading-relaxed">{item.desc}</p>

                                                {/* Notion-style Tags */}
                                                <div className="flex flex-wrap gap-2">
                                                    {item.details.map((detail, idx) => (
                                                        <span key={idx} className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#F7F6F3] text-[10px] text-[#37352F] border border-[#E0E0E0] font-mono">
                                                            {/* Notion Icon approximation */}
                                                            <span className="iconify" data-icon="lucide:check-square" data-width="10"></span>
                                                            {detail}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </FadeIn>
                                </div>
                            ))}
                        </div>
                    </div>
                </Section>

                {/* 6. Management & Tools (Terminal Style) */}
                <Section className="mb-32">
                    <div className="bg-[#2c0405] rounded-xl p-8 relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-6 text-white/30 font-mono text-[10px] border-b border-white/10 pb-4">
                            <span>MANAGEMENT_CONSOLE_V2</span>
                            <span className="text-[#ff4d4d]">EST STATUS: OPTIMAL</span>
                        </div>

                        <div className="space-y-4 font-mono text-xs md:text-sm">
                            <div className="flex gap-4">
                                <span className="text-[#822b2e]">➜</span>
                                <p className="text-white/80">PROJECT: <span className="text-white">Notion for 24/7 visibility & clarity.</span></p>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-[#822b2e]">➜</span>
                                <p className="text-white/80">FEEDBACK: <span className="text-white">Loom + Slack for fast async iteration.</span></p>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-[#822b2e]">➜</span>
                                <p className="text-white/80">MEETINGS: <span className="text-white">Weekly Strategic Sprint Alignment.</span></p>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <span className="text-[#822b2e] animate-pulse">_</span>
                                <p className="text-white/40 italic">Waiting for your initial command...</p>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Financial Security (Contra) Module */}
                <Section className="mb-32">
                    <div className="bg-[#f5f4f3] border border-[#2c0405]/10 rounded-xl p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#822b2e]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                        <div className="w-16 h-16 bg-[#2c0405] rounded-full flex items-center justify-center text-white shrink-0 shadow-xl shadow-[#2c0405]/10 z-10 relative">
                            <span className="iconify" data-icon="lucide:shield-check" data-width="32"></span>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#f5f4f3]"></div>
                        </div>

                        <div className="flex-grow z-10 text-center md:text-left">
                            <h3 className="text-2xl font-semibold text-[#2c0405] mb-2 flex items-center justify-center md:justify-start gap-2">
                                Risk-Free Execution via
                                <span className="underline decoration-[#822b2e]/30 underline-offset-4 decoration-2">Contra</span>
                            </h3>
                            <p className="text-[#2c0405]/70 text-sm leading-relaxed max-w-2xl">
                                We prioritize your financial security. All payments are handled legally through <span className="font-semibold text-[#2c0405]">Contra's Escrow system</span>.
                                Your funds are held safely in a neutral vault and are
                                <span className="text-[#822b2e] font-medium bg-[#822b2e]/5 px-1 mx-1 rounded">only released</span>
                                when you approve the milestones.
                            </p>
                            <p className="text-[#2c0405]/50 text-xs mt-4 font-mono flex items-center justify-center md:justify-start gap-2">
                                <span className="iconify" data-icon="lucide:lock" data-width="12"></span>
                                100% REFUNDABLE IF EXPECTATIONS ARE NOT MET. ZERO RISK.
                            </p>
                        </div>

                        <div className="shrink-0 z-10">
                            <div className="px-4 py-2 border border-[#2c0405]/10 bg-white rounded flex items-center gap-2 text-xs font-mono text-[#2c0405]/60 shadow-sm">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                SECURE_PAYMENT_GATEWAY
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Investment & Timeline */}
                <Section className="mb-32">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Budget Card */}
                        <div className="md:col-span-2 bg-white border border-[#2c0405]/10 rounded-xl p-8 hover:border-[#2c0405]/30 transition-all group">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-sm font-mono text-[#2c0405]/60 uppercase tracking-widest mb-1">Total Investment</h3>
                                    <div className="text-4xl md:text-5xl font-semibold text-[#2c0405]">$4,500 <span className="text-lg text-[#2c0405]/40 font-normal">USD</span></div>
                                </div>
                                <div className="px-3 py-1 bg-[#822b2e]/10 text-[#822b2e] rounded-full text-xs font-mono border border-[#822b2e]/20">ALL_INCLUSIVE</div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#2c0405]/5">
                                <div>
                                    <h4 className="text-xs font-mono text-[#2c0405]/50 uppercase mb-2">Estimated Timeline</h4>
                                    <p className="text-[#2c0405] font-medium flex items-center gap-2">
                                        <span className="iconify text-[#822b2e]" data-icon="lucide:calendar-clock"></span>
                                        1 - 1.5 Months
                                    </p>
                                    <p className="text-[10px] text-[#2c0405]/40 mt-1">Dependent on feedback & revisions.</p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-mono text-[#2c0405]/50 uppercase mb-2">Payment Structure</h4>
                                    <p className="text-[#2c0405] font-medium flex items-center gap-2">
                                        <span className="iconify text-[#822b2e]" data-icon="lucide:credit-card"></span>
                                        3 x $1,500 USD
                                    </p>
                                    <p className="text-[10px] text-[#2c0405]/40 mt-1">Released per milestone via Contra.</p>
                                </div>
                            </div>
                        </div>

                        {/* Timeline / Speed Card */}
                        <div className="bg-[#2c0405] rounded-xl p-8 text-white flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-32 bg-[#822b2e] blur-[80px] opacity-40 rounded-full"></div>
                            <div className="relative z-10">
                                <span className="iconify w-8 h-8 opacity-60 mb-4" data-icon="lucide:timer"></span>
                                <h3 className="text-lg font-medium leading-tight mb-2">Accelerated Delivery</h3>
                                <p className="text-white/60 text-xs leading-relaxed">
                                    Our sprint-based workflow allows us to deliver the full Scope of Work in approx 1 - 1.5 months.
                                </p>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Scalable Add-ons (Future Growth) */}
                <Section className="mb-32">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="w-8 h-[1px] bg-[#2c0405]/20"></span>
                        <h3 className="text-xs font-mono text-[#2c0405]/50 uppercase tracking-widest">SCALABLE ADD-ONS // FUTURE_GROWTH</h3>
                        <span className="flex-grow h-[1px] bg-[#2c0405]/20"></span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                title: "Custom AI Agents",
                                desc: "Trained on your product data for 24/7 customer support & sales.",
                                icon: "bot"
                            },
                            {
                                title: "Independent CRM",
                                desc: "Own your data. Custom pipeline setup for wholesale & B2B.",
                                icon: "database"
                            },
                            {
                                title: "Automated Mailing",
                                desc: "Campaigns for customer loyalty and recurring revenue generation.",
                                icon: "mail"
                            }
                        ].map((addon, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className="bg-[#fffffa] border border-[#2c0405]/10 rounded-xl p-6 hover:border-[#822b2e]/30 hover:shadow-lg hover:shadow-[#822b2e]/5 transition-all cursor-pointer group"
                            >
                                <div className="w-10 h-10 rounded-full bg-[#f5f4f3] flex items-center justify-center mb-4 group-hover:bg-[#822b2e] transition-colors duration-300">
                                    <span className="iconify text-[#2c0405] group-hover:text-white transition-colors" data-icon={`lucide:${addon.icon}`} data-width="18"></span>
                                </div>
                                <h4 className="text-[#2c0405] font-semibold mb-2">{addon.title}</h4>
                                <p className="text-xs text-[#2c0405]/60 leading-relaxed">{addon.desc}</p>
                                <div className="mt-4 pt-4 border-t border-[#2c0405]/5 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[10px] font-mono text-[#822b2e] uppercase">On Demand</span>
                                    <span className="iconify text-[#822b2e]" data-icon="lucide:arrow-up-right" data-width="14"></span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Section>

                {/* 7. Reference Projects (Scrollable) */}
                <Section className="mb-32">
                    <div className="flex justify-between items-end mb-12">
                        <h3 className="text-2xl font-semibold tracking-tight text-[#2c0405]">07 // RELEVANT_CASES</h3>
                        <div className="flex gap-2">
                            <button className="w-8 h-8 rounded-full border border-[#2c0405]/10 flex items-center justify-center hover:bg-[#2c0405]/5 transition-colors">
                                <span className="iconify text-[#2c0405]/60" data-icon="lucide:arrow-left"></span>
                            </button>
                            <button className="w-8 h-8 rounded-full border border-[#2c0405]/10 flex items-center justify-center hover:bg-[#2c0405]/5 transition-colors">
                                <span className="iconify text-[#2c0405]/60" data-icon="lucide:arrow-right"></span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <motion.div whileHover={{ y: -5 }} className="group cursor-pointer">
                            <div className="aspect-video bg-[#2c0405]/5 rounded-lg mb-4 overflow-hidden relative">
                                <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-[#2c0405]/20 uppercase">Next-Gen Food Brand Case</div>
                            </div>
                            <h4 className="font-medium text-[#2c0405]">Brand Architecture for Deli-Market</h4>
                            <p className="text-xs text-[#2c0405]/60 mt-1">Impact: +45% Customer Retention via Smart Subscription.</p>
                        </motion.div>
                        <motion.div whileHover={{ y: -5 }} className="group cursor-pointer">
                            <div className="aspect-video bg-[#2c0405]/5 rounded-lg mb-4 overflow-hidden relative">
                                <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-[#2c0405]/20 uppercase">Premium Artisan Case</div>
                            </div>
                            <h4 className="font-medium text-[#2c0405]">Design System for Artisan Sauces</h4>
                            <p className="text-xs text-[#2c0405]/60 mt-1">Impact: 30% Reduction in Load Time & Checkout Friction.</p>
                        </motion.div>
                    </div>
                </Section>

                {/* 8. Final Value Proposition / CTA */}
                <section className="mb-24 text-center py-24 border-t border-[#2c0405]/10">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-semibold tracking-tight text-[#2c0405] mb-8"
                    >
                        READY FOR THE <br />
                        <span className="text-[#822b2e]">NEXT LEVEL?</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-[#2c0405]/60 max-w-xl mx-auto mb-12"
                    >
                        We are not just an agency, we are the architects of your digital future. Let's make Krufood not only taste good, but work beautifully.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col md:flex-row gap-4 justify-center items-center"
                    >
                        <a href="mailto:hola@livv.systems" className="text-2xl md:text-3xl font-medium text-[#2c0405] hover:text-[#822b2e] transition-colors border-b-2 border-[#2c0405]/10 hover:border-[#822b2e] pb-1">
                            hola@livv.systems
                        </a>
                    </motion.div>
                </section>

            </main>

            <footer className="border-t border-[#2c0405]/10 bg-[#fffffa] pt-12 pb-8">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex flex-col gap-2">
                        <span className="font-bold tracking-tighter text-[#2c0405]">LIVV</span>
                        <span className="text-xs text-[#2c0405]/60 font-mono">© 2026 FOR KRUFOOD KITCHEN + MARKET</span>
                    </div>
                    <div className="flex gap-6">
                        <a href="https://krufood.com" className="text-xs text-[#2c0405]/60 hover:text-[#822b2e] transition-colors uppercase font-mono">Back to Shop</a>
                        <span className="text-xs text-[#2c0405]/20 font-mono uppercase">/</span>
                        <a href="#" className="text-xs text-[#2c0405]/60 hover:text-[#2c0405] transition-colors uppercase font-mono">Design by LIVV</a>
                    </div>
                </div>
            </footer>

            {/* Iconify Source */}
            <script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>
        </div>
    );
}
