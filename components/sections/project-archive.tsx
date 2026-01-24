"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

import { useSupabase } from "@/hooks/useSupabase"
import { PortfolioItem } from "@/types/livv-os"

const FALLBACK_PROJECTS: PortfolioItem[] = [
    {
        id: "internal-systems",
        title: "Internal Management Systems",
        subtitle: "Custom operational tools",
        category: "Internal Tools",
        services: "Development, Operational Tools",
        year: "2024",
        image: "/images/internal-dashboard.png", // Updated to "Listo" laptop image
        featured: true,
        slug: "internal-management",
        color: "#FFD700",
        description: "Custom operational tools for internal efficiency."
    },
    {
        id: "paper",
        title: "Paper",
        subtitle: "Venue & nightlife software",
        category: "SaaS / Product",
        services: "Product Strategy, UI/UX",
        year: "2024",
        image: "/images/portfolio-2.jpg",
        featured: true,
        slug: "paper",
        color: "#769268",
        description: "Venue & nightlife software platform."
    },
    {
        id: "seo-blocks",
        title: "SEO Blocks Generator",
        subtitle: "Programmatic SEO for Webflow",
        category: "Dev Tools",
        services: "Webflow Development, SEO",
        year: "2024",
        image: "/images/portfolio-3.jpg",
        featured: true,
        slug: "seo-blocks",
        color: "#6DBEDC",
        description: "Programmatic SEO blocks generator for Webflow."
    },
    {
        id: "azqira",
        title: "Azqira",
        subtitle: "Digital Experience",
        category: "Fintech / App",
        services: "UI/UX, Development",
        year: "2024",
        image: "/images/project-mobile.png", // Corrected image
        featured: true,
        slug: "azqira",
        color: "#00C853",
        description: "Learn where you create."
    },
    {
        id: "pr-tool",
        title: "Pr Tool",
        subtitle: "Content Monetization",
        category: "Content Tech",
        services: "App for content creators, affiliate links, Tienda Nube integrations",
        year: "2024",
        image: "/images/pr-tool.png",
        featured: true,
        slug: "pr-tool",
        color: "#E6E6E6",
        description: "App for content creators, affiliate links y Tienda nube full custom integrations"
    },
    {
        id: "sacoa",
        title: "Sacoa Cashless",
        subtitle: "Design & Animations",
        category: "Brand Experience",
        services: "Design and custom animations",
        year: "2024",
        image: "/images/sacoa-cashless.png", // Corrected image
        featured: true,
        slug: "sacoa",
        color: "#FF3D00",
        description: "Wisest Cashless System."
    },
    {
        id: "boken",
        title: "Boken",
        subtitle: "Fashion E-commerce",
        category: "E-commerce",
        services: "Shopify, Digital Design",
        year: "2024",
        image: "/images/portfolio-6.png", // Using a different image to avoid duplication with Paper
        featured: true,
        slug: "boken",
        color: "#333333",
        description: "Fashion e-commerce platform."
    },
    {
        id: "vario",
        title: "Vario Finance",
        subtitle: "Fintech Platform",
        category: "Fintech",
        services: "Strategy, Visual Identity, Website",
        year: "2024",
        image: "/images/showcase-blur.png",
        featured: false,
        slug: "vario-finance",
        color: "#C4A35A",
        description: "Reimagining the future of decentralized finance."
    },
    {
        id: "ecosphere",
        title: "EcoSphere",
        subtitle: "Sustainability Tech",
        category: "Sustainability",
        services: "Strategy, Visual Identity",
        year: "2024",
        image: "/images/task-ui.png",
        featured: false,
        slug: "ecosphere",
        color: "#769268",
        description: "Digital ecosystem for sustainable growth."
    },
]

type ViewMode = "featured" | "all" | "industries"

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.33, 1, 0.68, 1]
        }
    }
}

export function ProjectArchive() {
    const { data: dbProjects, loading } = useSupabase<PortfolioItem>('portfolio_items');

    // Use DB projects if available, otherwise fallback (or empty if DB exists but empty)
    // Note: If the table doesn't exist yet, dbProjects might stay empty or error, so safety check is good.
    const projects = (dbProjects && dbProjects.length > 0) ? dbProjects : FALLBACK_PROJECTS;

    const [viewMode, setViewMode] = useState<ViewMode>("featured")
    const [hoveredProject, setHoveredProject] = useState<string | null>(null)
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e: React.MouseEvent) => {
        setCursorPos({ x: e.clientX, y: e.clientY })
    }

    const featuredProjects = projects.filter(p => p.featured)
    const listProjects = projects

    return (
        <section className="min-h-screen bg-[#FDFCF8] text-[#1a1a1a] pb-32" onMouseMove={handleMouseMove}>

            {/* Header / Tabs */}
            <div className={`sticky top-24 z-40 bg-[#FDFCF8]/90 backdrop-blur-sm border-b border-[#1a1a1a]/5 transition-all duration-300`}>
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-12">
                    <div className="flex flex-wrap items-baseline justify-center gap-4 md:gap-8 overflow-hidden">
                        {/* Tabs with Reveal Animation */}
                        {[
                            { id: "featured", label: "Featured" },
                            { id: "all", label: "All projects" },
                            { id: "industries", label: "Industries" }
                        ].map((tab, i, arr) => (
                            <div key={tab.id} className="relative group inline-flex items-baseline gap-4 md:gap-8">
                                <button
                                    onClick={() => setViewMode(tab.id as ViewMode)}
                                    className="overflow-hidden relative block"
                                >
                                    <motion.span
                                        initial={{ y: "100%" }}
                                        animate={{ y: 0 }}
                                        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1], delay: i * 0.1 }}
                                        className={`section-heading block transition-colors duration-500 ${viewMode === tab.id ? 'text-[#1a1a1a]' : 'text-[#1a1a1a]/20 hover:text-[#1a1a1a]/60'}`}
                                    >
                                        {tab.label}
                                    </motion.span>
                                </button>
                                {i < arr.length - 1 && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 + i * 0.1 }}
                                        className="text-xl md:text-3xl text-[#1a1a1a]/20 align-top hidden md:inline-block"
                                    >/</motion.span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12 min-h-[60vh]">
                <AnimatePresence mode="wait">

                    {/* FEATURED VIEW (GRID) */}
                    {viewMode === "featured" && (
                        <motion.div
                            key="featured"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16"
                        >
                            {featuredProjects.map((project, i) => (
                                <motion.div key={project.id} variants={itemVariants}>
                                    <Link href="#" className="group block relative">
                                        <div className="aspect-[16/10] overflow-hidden rounded-[4px] mb-6 relative">
                                            <div className="absolute inset-0 bg-[#1a1a1a]/5 z-10 group-hover:bg-transparent transition-colors duration-500" />
                                            <Image
                                                src={project.image}
                                                alt={project.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="flex justify-between items-start border-t border-[#1a1a1a]/10 pt-4">
                                            <div>
                                                <h3 className="text-2xl md:text-3xl font-medium mb-1">{project.title}</h3>
                                                <p className="text-[#1a1a1a]/60 text-sm md:text-base">{project.category} — {project.services}</p>
                                            </div>
                                            <ArrowUpRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* ALL PROJECTS VIEW (LIST) */}
                    {viewMode === "all" && (
                        <motion.div
                            key="all"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, transition: { duration: 0.3 } }}
                            className="flex flex-col"
                        >
                            {/* List Header */}
                            <motion.div
                                variants={itemVariants}
                                className="hidden md:flex text-xs uppercase tracking-widest text-[#1a1a1a]/40 py-4 border-b border-[#1a1a1a]/10"
                            >
                                <div className="w-1/3">Project Goal</div>
                                <div className="w-1/3">Client</div>
                                <div className="w-1/3 text-right">Services</div>
                            </motion.div>

                            {listProjects.map((project) => (
                                <motion.div
                                    key={project.id}
                                    variants={itemVariants}
                                    className="group relative border-b border-[#1a1a1a]/10 py-8 md:py-12 cursor-pointer transition-colors duration-300 hover:bg-[#1a1a1a]/[0.02]"
                                    onMouseEnter={() => setHoveredProject(project.image)}
                                    onMouseLeave={() => setHoveredProject(null)}
                                >
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 relative z-20">
                                        <div className="w-full md:w-1/3 text-lg md:text-xl font-light text-[#1a1a1a]/80 group-hover:text-[#1a1a1a] transition-colors">
                                            {project.description}
                                        </div>

                                        <div className="w-full md:w-1/3 text-2xl md:text-3xl font-medium">
                                            {project.title}
                                        </div>

                                        <div className="w-full md:w-1/3 text-right text-sm md:text-base text-[#1a1a1a]/60 group-hover:text-[#1a1a1a] transition-colors">
                                            {project.services}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* INDUSTRIES VIEW (Placeholder for now) */}
                    {viewMode === "industries" && (
                        <motion.div
                            key="industries"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="py-20 text-center text-[#1a1a1a]/40"
                        >
                            <p>Filter by industry enabled soon.</p>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* FLOATING IMAGE PREVIEW FOR LIST VIEW */}
            <AnimatePresence>
                {viewMode === "all" && hoveredProject && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            x: cursorPos.x - 200,
                            y: cursorPos.y - 150
                        }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        // Important: Use spring for fluid following, but make it snappier than the default
                        transition={{ type: "spring", stiffness: 120, damping: 15, mass: 0.1 }}
                        className="fixed z-50 pointer-events-none w-[400px] h-[250px] rounded-lg overflow-hidden shadow-2xl hidden md:block"
                        style={{ left: 0, top: 0 }} // Positioning managed by animate transform
                    >
                        <div className="relative w-full h-full bg-[#1a1a1a]">
                            <Image
                                src={hoveredProject}
                                alt="Preview"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </section>
    )
}
