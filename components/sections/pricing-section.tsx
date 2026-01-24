"use client"

import { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AnimatedBorders } from "@/components/ui/animated-borders"
import { Sparkles, ArrowUp, Clock, Download, RefreshCw, Calendar, CheckCircle, Send, Briefcase } from "lucide-react"
import Image from "next/image"


import { ProjectSimulator, SimulationData } from "@/components/ui/project-simulator"
import { RevealText } from "@/components/ui/reveal-text"
import { SlideToSwap } from "@/components/ui/slide-to-swap"

type Message = {
    id: string
    type: 'bot' | 'user'
    content: React.ReactNode
    subtext?: string
}

type Option = {
    label: string
    action: () => void
}

const TypewriterEffect = ({ text, onComplete }: { text: string, onComplete?: () => void }) => {
    const [displayedText, setDisplayedText] = useState("")
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + text[currentIndex])
                setCurrentIndex(prev => prev + 1)
            }, 20) // Speed
            return () => clearTimeout(timeout)
        } else {
            if (onComplete) onComplete()
        }
    }, [currentIndex, text, onComplete])

    return <span>{displayedText}</span>
}



type PricingState = {
    email: string
    service: string
    scope: string
    budget: string
    details: string
}

export function PricingSection({ id }: { id?: string }) {
    const sectionRef = useRef<HTMLDivElement>(null)
    const chatContainerRef = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [isChatStarted, setIsChatStarted] = useState(false)

    // Interaction State
    const [options, setOptions] = useState<Option[]>([])
    const [inputType, setInputType] = useState<'none' | 'text' | 'email'>('none')
    const [inputText, setInputText] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [currentFlow, setCurrentFlow] = useState<string>("")

    // Simulator State
    const [simulationStep, setSimulationStep] = useState(0)
    const [complexity, setComplexity] = useState(0)
    const [placeholderText, setPlaceholderText] = useState("Click to start protocol...")
    const simDataRef = useRef({ platform: '', intelligence: '', velocity: '', experience: '' })

    // Data State
    const [pricingState, setPricingState] = useState<PricingState>({
        email: '',
        service: '',
        scope: '',
        budget: '',
        details: ''
    })

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

    // Rotating placeholder effect REMOVED as per user request for static text
    // useEffect(() => {
    //     if (isChatStarted) return;
    //     const placeholders = [
    //         "Start Live Simulation...",
    //         "Quote custom design...",
    //         "Calculate project ROI...",
    //         "Real-time architecture cost...",
    //         "Click to start protocol..."
    //     ];
    //     let index = 0;
    //     const interval = setInterval(() => {
    //         index = (index + 1) % placeholders.length;
    //         setPlaceholderText(placeholders[index]);
    //     }, 3000);
    //     return () => clearInterval(interval);
    // }, [isChatStarted])

    // --- SCROLL FIX OBSERVER ---
    useEffect(() => {
        if (!chatContainerRef.current) return
        const container = chatContainerRef.current
        const scrollToBottom = () => {
            container.scrollTop = container.scrollHeight
        }
        scrollToBottom()
        const observer = new MutationObserver(() => {
            scrollToBottom()
        })
        observer.observe(container, {
            childList: true,
            subtree: true,
            characterData: true
        })
        return () => observer.disconnect()
    }, [messages, isTyping, isChatStarted])

    const addBotMessage = async (content: React.ReactNode, subtext?: string, delay = 600) => {
        setIsTyping(true)
        await new Promise(r => setTimeout(r, delay))
        setIsTyping(false)

        const newMessage: Message = {
            id: Date.now().toString(),
            type: 'bot',
            content,
            subtext
        }
        setMessages(prev => [...prev, newMessage])
    }

    const addUserMessage = (content: React.ReactNode) => {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            type: 'user',
            content
        }])
    }

    // --- FLOW LOGIC ---

    const handleStartChat = () => {
        if (isChatStarted) return
        setIsChatStarted(true)
        initChat()
    }

    const initChat = async () => {
        // Reset State
        setPricingState({ email: '', service: '', scope: '', budget: '', details: '' })
        setInputType('none')
        setSimulationStep(0)
        setComplexity(0)
        setMessages([])
        setOptions([])
        simDataRef.current = { platform: '', intelligence: '', velocity: '', experience: '' }

        // Start Simulator Flow
        await addBotMessage("Initializing Pricing Protocol.", "CARBON AI IN IT")
        await addBotMessage("Phase 1: Define the system scope.")

        setOptions([
            { label: "Velocity Protocol (Startup)", action: () => handleSimStep(1, "Velocity Protocol", 15) },
            { label: "Custom System (Company)", action: () => handleSimStep(1, "Custom System", 40) },
            { label: "Global Ecosystem (Enterprise)", action: () => handleSimStep(1, "Ecosystem", 85) }
        ])
    }

    // Step Handler
    const handleSimStep = async (step: number, value: string, complexityAdd: number) => {
        setComplexity(prev => Math.min(prev + complexityAdd, 100))
        addUserMessage(value)
        setOptions([])
        setIsTyping(true)
        await new Promise(r => setTimeout(r, 600))
        setIsTyping(false)

        if (step === 1) {
            simDataRef.current = { ...simDataRef.current, platform: value }
            setSimulationStep(1)
            await addBotMessage("Base scope registered.", "Requires intelligent agent integration (n8n/AI)?")
            setOptions([
                { label: "Standard (No AI)", action: () => handleSimStep(2, "Standard Logic", 0) },
                { label: "AI Integrated (+ Auto)", action: () => handleSimStep(2, "AI-Agentic", 25) }
            ])
        } else if (step === 2) {
            simDataRef.current = { ...simDataRef.current, intelligence: value }
            setSimulationStep(2)
            await addBotMessage("Automation level configured.", "What level of visual experience are you looking for?")
            setOptions([
                { label: "Clean & Functional", action: () => handleSimStep(3, "Functional", 5) },
                { label: "Cinematic Motion (3D/WebGL)", action: () => handleSimStep(3, "Cinematic", 20) }
            ])
        } else if (step === 3) {
            simDataRef.current = { ...simDataRef.current, experience: value }
            setSimulationStep(3)
            await addBotMessage("Visual experience defined.", "Finally, what is the delivery urgency?")
            setOptions([
                { label: "Standard", action: () => handleSimStep(4, "Standard", 0) },
                { label: "Rush Mode (Priority)", action: () => handleSimStep(4, "Rush Mode", 15) }
            ])
        } else if (step === 4) {
            finishSimulator(value)
        }
    }

    const finishSimulator = async (lastVelocity: string) => {
        simDataRef.current = { ...simDataRef.current, velocity: lastVelocity }
        const basePrices: Record<string, number> = {
            "Velocity Protocol": 700,
            "Custom System": 5000,
            "Ecosystem": 16500
        }
        const currentData = simDataRef.current
        const aiUpsell = currentData.intelligence === "AI-Agentic" ? 3000 : 0
        const experienceUpsell = currentData.experience === "Cinematic" ? 2250 : 0
        let subtotal = (basePrices[currentData.platform] || 0) + aiUpsell + experienceUpsell
        if (lastVelocity === "Rush Mode") subtotal = subtotal * 1.40
        const minPrice = Math.round((subtotal * 0.9) / 100) * 100
        const maxPrice = Math.round((subtotal * 1.15) / 100) * 100
        const rangeString = `$${minPrice.toLocaleString()} - $${maxPrice.toLocaleString()} USD`

        setPricingState(prev => ({
            ...prev,
            service: currentData.platform,
            scope: `${currentData.intelligence} / ${currentData.experience || "Functional"}`,
            budget: rangeString,
            details: `Velocity: ${lastVelocity} | Complexity: ${complexity}%`
        }))

        await addBotMessage("Investment calculation finished.", `Your estimated investment is ${rangeString}`)
        triggerEmailCapture()
    }

    const triggerEmailCapture = async () => {
        await addBotMessage("To generate the official technical sheet, enter your corporate email.")
        setInputType('email')
    }

    const handleInputSubmit = async () => {
        if (!inputText.trim()) return
        const value = inputText
        setInputText("")
        setInputType('none')
        addUserMessage(value)

        if (inputType === 'email') {
            if (!value.includes('@')) {
                await addBotMessage("Invalid email format. Please try again.")
                setInputType('email')
                return
            }
            const newState = { ...pricingState, email: value }
            setPricingState(newState)

            // Save to Supabase
            try {
                const { supabase } = await import('@/lib/supabase/client')
                await supabase.from('leads').insert([{
                    name: value.split('@')[0], // Use email username as name
                    email: value,
                    status: 'new',
                    source: 'Pricing Calculator',
                    message: `Service: ${newState.service} | Scope: ${newState.scope} | Budget: ${newState.budget} | ${newState.details}`,
                    company: value.split('@')[1] || null // Domain as company
                }])
            } catch (error) {
                console.error('Error saving lead:', error)
            }

            await addBotMessage(`Thanks. Sending quote to ${value}...`)
            flowResult(newState)
            return
        }
    }

    const flowResult = async (finalState: PricingState) => {
        await new Promise(r => setTimeout(r, 1000))
        let priceDisplay = ""
        let timelineDisplay = ""
        switch (finalState.service) {
            case "Velocity Protocol": priceDisplay = finalState.budget; timelineDisplay = "5-7 Days"; break;
            case "Custom System": priceDisplay = finalState.budget; timelineDisplay = "4-8 Weeks"; break;
            case "Ecosystem": priceDisplay = finalState.budget; timelineDisplay = "3-6 Months"; break;
            default: priceDisplay = finalState.budget || "Custom"; timelineDisplay = "TBD";
        }

        const ticketContent = (
            <div className="w-full bg-white shadow-xl rounded-xl overflow-hidden relative group border border-stone-100 my-2">
                <div className="bg-stone-900 p-4 border-b border-stone-800 flex justify-between items-center">
                    <span className="text-white font-medium text-xs tracking-widest uppercase">Pre-Quote</span>
                    <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    </div>
                </div>
                <div className="p-5 relative">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block mb-1">Client</span>
                            <span className="text-xs text-stone-800 font-medium truncate block" title={finalState.email}>{finalState.email}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block mb-1">Service</span>
                            <span className="text-xs text-stone-800 font-medium block">{finalState.service}</span>
                        </div>
                    </div>
                    <div className="bg-stone-50 rounded-lg p-3 mb-4 border border-stone-100">
                        <div className="flex justify-between items-end">
                            <span className="text-stone-500 text-xs">Estimate</span>
                            <span className="text-stone-900 text-lg font-bold tracking-tight">{priceDisplay}</span>
                        </div>
                        <div className="flex justify-between items-end mt-1">
                            <span className="text-stone-400 text-[10px]">Timeline</span>
                            <span className="text-emerald-600 text-xs font-medium">{timelineDisplay}</span>
                        </div>
                    </div>
                    <button onClick={() => window.open('/brochure.pdf', '_blank')} className="w-full py-2.5 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors flex items-center justify-center gap-2">
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                    </button>
                </div>
            </div>
        )

        await addBotMessage(ticketContent)
        await addBotMessage("This document is preliminary. To freeze the price and secure a slot, we recommend a brief call.", "How would you like to proceed?")
        setOptions([
            { label: "Schedule Call", action: () => window.open('https://cal.com/eneas-aldabe-youfep/15min', '_blank') },
            { label: "Restart", action: initChat }
        ])
    }

    return (
        <section id={id} ref={sectionRef} className="relative w-full">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20 relative z-10">
                <AnimatedBorders className="hidden md:block" />

                <div className="flex flex-col items-center w-full">
                    {/* Section Header */}
                    <div className="w-full relative z-10 mb-20 md:mb-28">
                        <div className="relative w-full h-[1px]">
                            <AnimatedBorders showLeft={false} showRight={false} showTop={true} fullWidth={true} />
                        </div>
                        <div className="pt-6 flex justify-between items-center text-[10px] uppercase tracking-widest text-[#5A3E3E]/60 px-6 md:px-12">
                            <span>© Pricing プライシング</span>
                            <span>(WDX® — 05)</span>
                        </div>
                    </div>

                    {/* Typography Header with Loop Animation (Matches Services Style) */}
                    <div className="mb-20 md:mb-32 overflow-hidden w-full relative z-10 pb-4">
                        <div className="flex animate-scroll-left w-max">
                            {/* First Set */}
                            <div className="flex items-center">
                                {[...Array(2)].map((_, i) => (
                                    <h1 key={i} className="text-[12vw] leading-[1.2] font-light tracking-tighter text-[#2c0405] pr-24 md:pr-48 shrink-0 flex items-center py-4">
                                        <span className="text-[#2c0405] mr-6">★★</span>
                                        livv <RevealText text="Pricing" className="text-gradient-gold ml-4 mr-4" isVisible={isVisible} delay={200} /><span className="text-gradient-gold align-top text-[4vw]">©</span>
                                        <span className="text-[#2c0405] ml-6">★★</span>
                                    </h1>
                                ))}
                            </div>
                            {/* Second Set (Clone for seamless loop) */}
                            <div className="flex items-center" aria-hidden="true">
                                {[...Array(2)].map((_, i) => (
                                    <h1 key={`clone-${i}`} className="text-[12vw] leading-[1.2] font-light tracking-tighter text-[#2c0405] pr-24 md:pr-48 shrink-0 flex items-center py-4">
                                        <span className="text-[#2c0405] mr-6">★★</span>
                                        livv <RevealText text="Pricing" className="text-gradient-gold ml-4 mr-4" isVisible={isVisible} delay={200} /><span className="text-gradient-gold align-top text-[4vw]">©</span>
                                        <span className="text-[#2c0405] ml-6">★★</span>
                                    </h1>
                                ))}
                            </div>
                        </div>
                        {/* Subtitle & Real-time CTA */}
                        <div className="mt-12 text-center px-6">
                            <div className="flex flex-col items-center gap-4">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="px-3 py-1 rounded-full border border-[#2c0405]/10 bg-[#2c0405]/5 flex items-center gap-2"
                                >
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    <span className="text-[10px] font-bold tracking-widest text-[#2c0405] uppercase">Live Simulator</span>
                                </motion.div>

                                <p className="text-base md:text-lg text-stone-600 font-light tracking-tight max-w-lg mx-auto leading-relaxed">
                                    Our <span className="text-[#2c0405] font-medium italic">Intelligent Cost Architect</span> is ready. Click below to simulate your roadmap and generate a <span className="text-[#2c0405] font-medium tracking-tight border-b border-[#2c0405]/20">tailormade quote</span> in real-time.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Chat Interface Container - Refactored to grow upwards */}
                    <div className="w-full max-w-2xl mx-auto relative z-20">
                        {/* Messages Area - Floating above the input */}
                        <AnimatePresence>
                            {isChatStarted && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: 550 }}
                                    exit={{ opacity: 0, y: 20, height: 0 }}
                                    className="mb-4 bg-white/40 backdrop-blur-md rounded-[24px] border border-[#E8E4DC]/30 overflow-hidden flex flex-col shadow-sm"
                                >
                                    {/* Header */}
                                    <div className="px-6 py-4 border-b border-[#E8E4DC]/20 flex items-center justify-between bg-white/40">
                                        <div className="flex items-center gap-3">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[10px] font-bold text-[#2c0405]/80 tracking-widest uppercase italic">Active Protocol</span>
                                        </div>
                                        <div className="flex gap-1">
                                            <div className="h-1.5 w-6 bg-[#2c0405]/20 rounded-full" />
                                            <div className="h-1.5 w-12 bg-[#2c0405]/10 rounded-full" />
                                        </div>
                                    </div>

                                    {/* Chat Messages */}
                                    <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide flex flex-col">
                                        {messages.map((msg) => (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                key={msg.id}
                                                className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'} max-w-[90%] self-${msg.type === 'user' ? 'end' : 'start'}`}
                                            >
                                                {msg.type === 'bot' ? (
                                                    <div className="px-5 py-4 bg-white/80 backdrop-blur-sm border border-[#E8E4DC]/40 rounded-2xl rounded-tl-sm shadow-sm text-sm text-[#2c0405] leading-relaxed">
                                                        {typeof msg.content === 'string' ? <TypewriterEffect text={msg.content} /> : msg.content}
                                                        {msg.subtext && <div className="mt-2 text-[10px] font-medium text-[#2c0405]/50 border-t border-[#E8E4DC]/20 pt-2 tracking-wide uppercase">{msg.subtext}</div>}
                                                    </div>
                                                ) : (
                                                    <div className="bg-[#2c0405] text-[#F5F5F0] px-5 py-3 rounded-2xl rounded-br-sm text-sm shadow-md font-medium">
                                                        {msg.content}
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                        {isTyping && (
                                            <div className="flex items-center gap-1.5 px-4 py-3 bg-white/60 backdrop-blur-sm border border-[#E8E4DC]/40 rounded-2xl rounded-tl-sm w-fit shadow-sm">
                                                <span className="w-1.5 h-1.5 bg-[#2c0405]/40 rounded-full animate-bounce [animation-delay:-0.32s]"></span>
                                                <span className="w-1.5 h-1.5 bg-[#2c0405]/40 rounded-full animate-bounce [animation-delay:-0.16s]"></span>
                                                <span className="w-1.5 h-1.5 bg-[#2c0405]/40 rounded-full animate-bounce"></span>
                                            </div>
                                        )}
                                        {/* Options Chips inside the scrollable area */}
                                        {inputType === 'none' && options.length > 0 && !isTyping && (
                                            <div className="flex flex-wrap gap-2 mt-2 pl-2">
                                                {options.map((opt, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={opt.action}
                                                        className="px-4 py-2 rounded-full border border-[#2c0405]/10 bg-white/80 hover:bg-white text-xs font-medium text-[#2c0405] transition-all hover:scale-105 shadow-sm"
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>


                        {/* Slide to Swap or Chat Input */}
                        <div className="w-full relative z-20 flex justify-center">
                            <AnimatePresence mode="wait">
                                {!isChatStarted ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        key="slide-button"
                                        className="w-full flex justify-center"
                                    >
                                        <SlideToSwap onComplete={handleStartChat} />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key="chat-input"
                                        className="relative w-full cursor-pointer transition-all duration-500"
                                        style={{
                                            padding: '1px',
                                            background: 'linear-gradient(to right, rgba(251, 188, 5, 0.4), rgba(234, 67, 53, 0.4), rgba(167, 48, 255, 0.4), rgba(66, 133, 244, 0.4))',
                                            borderRadius: '9999px'
                                        }}
                                    >
                                        <div className="bg-white rounded-full h-12 flex items-center pl-6 pr-1 relative overflow-hidden shadow-[0_2px_15px_-3px_rgba(44,4,5,0.05)]">
                                            <div className="flex-1 relative h-full flex items-center overflow-hidden">
                                                <input
                                                    type={inputType === 'email' ? 'email' : 'text'}
                                                    value={inputText}
                                                    onChange={(e) => setInputText(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit()}
                                                    disabled={inputType === 'none'}
                                                    placeholder={inputType === 'email' ? "you@email.com" : "Type your answer..."}
                                                    className="w-full h-full bg-transparent border-none outline-none text-[#2c0405] placeholder-[#2c0405]/30 text-sm px-4 font-medium"
                                                    autoFocus
                                                />
                                            </div>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (inputType !== 'none') handleInputSubmit();
                                                }}
                                                className="h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm relative overflow-hidden flex-shrink-0 bg-[#2c0405] text-[#F5F5F0]"
                                            >
                                                <Send className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
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
            `}</style>
        </section >
    )
}
