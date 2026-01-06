"use client"

import { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AnimatedBorders } from "@/components/ui/animated-borders"
import { Sparkles, ArrowUp, Clock, Download, RefreshCw, Calendar, CheckCircle, Send, Briefcase } from "lucide-react"
import Image from "next/image"


import { ProjectSimulator, SimulationData } from "@/components/ui/project-simulator"
import { RevealText } from "@/components/ui/reveal-text"

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
    const [placeholderText, setPlaceholderText] = useState("Iniciar Protocolo de Cotización...")
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

    // Rotating placeholder effect
    useEffect(() => {
        if (isChatStarted) return;
        const placeholders = [
            "Iniciar Protocolo de Cotización...",
            "¿Necesitas un sistema similar?",
            "Cotizar desarrollo a medida...",
            "Automatización y Diseño...",
            "Hablemos de tu visión..."
        ];
        let index = 0;
        const interval = setInterval(() => {
            index = (index + 1) % placeholders.length;
            setPlaceholderText(placeholders[index]);
        }, 3000);
        return () => clearInterval(interval);
    }, [isChatStarted])

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
        await addBotMessage("Inicializando Protocolo de Cotización.", "CARBON AI IN IT")
        await addBotMessage("Fase 1: Define el alcance del sistema.")

        setOptions([
            { label: "Velocity Protocol (Startup)", action: () => handleSimStep(1, "Velocity Protocol", 15) },
            { label: "Custom System (Empresa)", action: () => handleSimStep(1, "Custom System", 40) },
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
            await addBotMessage("Alcance base registrado.", "¿Requiere integración de agentes inteligentes (n8n/AI)?")
            setOptions([
                { label: "Estándar (No AI)", action: () => handleSimStep(2, "Standard Logic", 0) },
                { label: "AI Integrated (+ Auto)", action: () => handleSimStep(2, "AI-Agentic", 25) }
            ])
        } else if (step === 2) {
            simDataRef.current = { ...simDataRef.current, intelligence: value }
            setSimulationStep(2)
            await addBotMessage("Nivel de automatización configurado.", "¿Qué nivel de experiencia visual buscas?")
            setOptions([
                { label: "Clean & Functional", action: () => handleSimStep(3, "Functional", 5) },
                { label: "Cinematic Motion (3D/WebGL)", action: () => handleSimStep(3, "Cinematic", 20) }
            ])
        } else if (step === 3) {
            simDataRef.current = { ...simDataRef.current, experience: value }
            setSimulationStep(3)
            await addBotMessage("Experiencia visual definida.", "Finalmente, ¿cuál es la urgencia de entrega?")
            setOptions([
                { label: "Estándar", action: () => handleSimStep(4, "Standard", 0) },
                { label: "Rush Mode (Prioridad)", action: () => handleSimStep(4, "Rush Mode", 15) }
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

        await addBotMessage("Cálculo de inversión finalizado.", `Tu inversión estimada es de ${rangeString}`)
        triggerEmailCapture()
    }

    const triggerEmailCapture = async () => {
        await addBotMessage("Para generar la ficha técnica oficial, ingresa tu email corporativo.")
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
                await addBotMessage("Formato de correo no válido. Inténtalo de nuevo.")
                setInputType('email')
                return
            }
            const newState = { ...pricingState, email: value }
            setPricingState(newState)
            await addBotMessage(`Gracias. Enviando cotización a ${value}...`)
            flowResult(newState)
            return
        }
    }

    const flowResult = async (finalState: PricingState) => {
        await new Promise(r => setTimeout(r, 1000))
        let priceDisplay = ""
        let timelineDisplay = ""
        switch (finalState.service) {
            case "Velocity Protocol": priceDisplay = finalState.budget; timelineDisplay = "5-7 Días"; break;
            case "Custom System": priceDisplay = finalState.budget; timelineDisplay = "4-8 Semanas"; break;
            case "Ecosystem": priceDisplay = finalState.budget; timelineDisplay = "3-6 Meses"; break;
            default: priceDisplay = finalState.budget || "A Medida"; timelineDisplay = "TBD";
        }

        const ticketContent = (
            <div className="w-full bg-white shadow-xl rounded-xl overflow-hidden relative group border border-stone-100 my-2">
                <div className="bg-stone-900 p-4 border-b border-stone-800 flex justify-between items-center">
                    <span className="text-white font-medium text-xs tracking-widest uppercase">Pre-Cotización</span>
                    <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    </div>
                </div>
                <div className="p-5 relative">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block mb-1">Cliente</span>
                            <span className="text-xs text-stone-800 font-medium truncate block" title={finalState.email}>{finalState.email}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block mb-1">Servicio</span>
                            <span className="text-xs text-stone-800 font-medium block">{finalState.service}</span>
                        </div>
                    </div>
                    <div className="bg-stone-50 rounded-lg p-3 mb-4 border border-stone-100">
                        <div className="flex justify-between items-end">
                            <span className="text-stone-500 text-xs">Estimado</span>
                            <span className="text-stone-900 text-lg font-bold tracking-tight">{priceDisplay}</span>
                        </div>
                        <div className="flex justify-between items-end mt-1">
                            <span className="text-stone-400 text-[10px]">Timeline</span>
                            <span className="text-emerald-600 text-xs font-medium">{timelineDisplay}</span>
                        </div>
                    </div>
                    <button onClick={() => window.open('/brochure.pdf', '_blank')} className="w-full py-2.5 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors flex items-center justify-center gap-2">
                        <Download className="w-3.5 h-3.5" />
                        <span>Descargar PDF</span>
                    </button>
                </div>
            </div>
        )

        await addBotMessage(ticketContent)
        await addBotMessage("Este documento es preliminar. Para congelar el precio y asegurar slot, recomendados una breve llamada.", "¿Cómo deseas proceder?")
        setOptions([
            { label: "Agendar Llamada", action: () => window.location.href = '#contact' },
            { label: "Reiniciar", action: initChat }
        ])
    }

    return (
        <section id={id} ref={sectionRef} className="relative w-full">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20 relative z-10">
                <AnimatedBorders className="hidden md:block" />

                <div className="flex flex-col items-center w-full">
                    {/* Section Header */}
                    <div className="w-full border-t border-dashed border-[#D1CDC2] pt-6 flex justify-between items-center text-[10px] uppercase tracking-widest text-[#5A3E3E]/60 mb-20 md:mb-28 px-6 md:px-12 relative z-10">
                        <span>© Pricing プライシング</span>
                        <span>(WDX® — 05)</span>
                    </div>

                    {/* Intro Title */}
                    <div className="text-center mb-24 md:mb-32 relative z-10">
                        <h2 className="section-heading mb-4 flex justify-center">
                            <RevealText text="Pricing Studio" className="text-gradient-gold" isVisible={isVisible} />
                        </h2>
                        <p className="text-sm md:text-base text-stone-500 font-medium tracking-tight max-w-sm md:max-w-md mx-auto leading-relaxed">
                            Sistemas de cotización inteligente.<br className="hidden md:block" /> Selecciona un protocolo de acceso.
                        </p>
                    </div>

                    {/* Chat Interface Container */}
                    <div className="w-full max-w-2xl mx-auto relative z-20">
                        <motion.div
                            layout
                            initial={false}
                            animate={{
                                height: isChatStarted ? (window.innerWidth < 768 ? 550 : 600) : 56,
                                borderRadius: isChatStarted ? "24px" : "9999px",
                            }}
                            transition={{ type: "spring", stiffness: 400, damping: 40 }}
                            className={`
                                relative w-full overflow-hidden
                                ${isChatStarted
                                    ? "bg-white/95 backdrop-blur-xl shadow-2xl"
                                    : "bg-white/90 backdrop-blur-md cursor-pointer hover:shadow-sm transition-shadow"
                                }
                            `}
                            onClick={!isChatStarted ? handleStartChat : undefined}
                            style={{
                                padding: '1px',
                                background: !isChatStarted
                                    ? 'linear-gradient(to right, #fcd34d, #f472b6, #60a5fa)' // Lighter/Softer Rainbow
                                    : '#E8E4DC'
                            }}
                        >
                            {/* Inner Content Wrapper */}
                            <div className={`
                                w-full h-full bg-white relative overflow-hidden
                                ${isChatStarted ? "rounded-[23px]" : "rounded-full"}
                            `}>

                                {/* Header (Only when started) */}
                                <AnimatePresence>
                                    {isChatStarted && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="px-6 py-4 border-b border-[#E8E4DC]/50 flex items-center justify-between bg-white/50"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-xs font-medium text-[#5A3E3E] tracking-wider uppercase">Protocolo Activo</span>
                                            </div>
                                            <div className="flex gap-1">
                                                <div className="h-1 w-8 bg-[#A88B7D] rounded-full" />
                                                <div className="h-1 w-8 bg-[#E8E4DC] rounded-full" />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Chat Messages Area */}
                                <AnimatePresence>
                                    {isChatStarted && (
                                        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-[#E8E4DC] scrollbar-track-transparent flex flex-col">
                                            {messages.map((msg) => (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    key={msg.id}
                                                    className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'} max-w-[90%] self-${msg.type === 'user' ? 'end' : 'start'}`}
                                                >
                                                    {msg.type === 'bot' ? (
                                                        <div className="px-5 py-4 bg-white border border-[#E8E4DC] rounded-2xl rounded-tl-sm shadow-sm text-sm text-[#5A3E3E] leading-relaxed">
                                                            {typeof msg.content === 'string' ? <TypewriterEffect text={msg.content} /> : msg.content}
                                                            {msg.subtext && <div className="mt-2 text-xs text-[#A88B7D]/80 border-t border-[#E8E4DC] pt-2">{msg.subtext}</div>}
                                                        </div>
                                                    ) : (
                                                        <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white px-5 py-3 rounded-2xl rounded-br-sm text-sm shadow-md">
                                                            {msg.content}
                                                        </div>
                                                    )}
                                                </motion.div>
                                            ))}
                                            {isTyping && (
                                                <div className="flex items-center gap-1.5 px-4 py-3 bg-white border border-[#E8E4DC] rounded-2xl rounded-tl-sm w-fit shadow-sm">
                                                    <span className="w-1.5 h-1.5 bg-[#A88B7D] rounded-full animate-bounce [animation-delay:-0.32s]"></span>
                                                    <span className="w-1.5 h-1.5 bg-[#A88B7D] rounded-full animate-bounce [animation-delay:-0.16s]"></span>
                                                    <span className="w-1.5 h-1.5 bg-[#A88B7D] rounded-full animate-bounce"></span>
                                                </div>
                                            )}

                                            {/* Options Chips */}
                                            {inputType === 'none' && options.length > 0 && !isTyping && (
                                                <div className="flex flex-wrap gap-2 mt-2 pl-2 animate-in fade-in slide-in-from-bottom-2">
                                                    {options.map((opt, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={opt.action}
                                                            className="px-4 py-2 rounded-full border border-[#E8E4DC] bg-white hover:bg-[#F9F8F6] text-xs text-[#5A3E3E] transition-all hover:scale-105 shadow-sm"
                                                        >
                                                            {opt.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </AnimatePresence>

                                {/* Input Area */}
                                <div className={`mt-auto relative z-30 transition-all duration-500 ${isChatStarted ? 'p-4 border-t border-[#E8E4DC]/50 bg-white/50' : 'h-full flex items-center px-4'}`}>
                                    <div className="w-full flex items-center gap-4">

                                        {/* Input / Placeholder */}
                                        <div className="flex-1 relative h-10 flex items-center overflow-hidden">
                                            <AnimatePresence mode="wait">
                                                {!isChatStarted ? (
                                                    <motion.span
                                                        key={placeholderText}
                                                        initial={{ y: 20, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        exit={{ y: -20, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="absolute inset-0 flex items-center justify-center text-[#5A3E3E]/60 text-sm font-light select-none italic tracking-wide"
                                                    >
                                                        {placeholderText}
                                                    </motion.span>
                                                ) : (
                                                    <input
                                                        type={inputType === 'email' ? 'email' : 'text'}
                                                        value={inputText}
                                                        onChange={(e) => setInputText(e.target.value)}
                                                        onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit()}
                                                        disabled={inputType === 'none'}
                                                        placeholder={inputType === 'email' ? "tu@email.com" : "Escribe tu respuesta..."}
                                                        className="w-full h-full bg-transparent border-none outline-none text-[#5A3E3E] placeholder-[#5A3E3E]/30 text-sm px-4"
                                                        autoFocus
                                                    />
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Action Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (!isChatStarted) handleStartChat();
                                                else if (inputType !== 'none') handleInputSubmit();
                                            }}
                                            className={`
                                                h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md relative overflow-hidden
                                                ${isChatStarted && inputType !== 'none' && inputText.trim().length > 0
                                                    ? 'bg-[#1A1A1A] text-white hover:scale-110 active:scale-95'
                                                    : 'bg-[#1A1A1A] text-white hover:scale-105 select-none'
                                                }
                                            `}
                                        >
                                            <AnimatePresence mode="wait">
                                                <motion.div key="arrow" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                                    <ArrowUp className="w-4 h-4" />
                                                </motion.div>
                                            </AnimatePresence>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Section Footer */}
                    <div className="w-full border-t border-dashed border-[#D1CDC2] mt-8 py-6 px-6 md:px-12 relative z-10 flex justify-between items-center text-[10px] uppercase tracking-widest text-[#5A3E3E]/60">
                        <span>© End of Section エンド</span>
                        <span>(WDX® — 06)</span>
                    </div>
                </div >
            </div >
        </section >
    )
}
