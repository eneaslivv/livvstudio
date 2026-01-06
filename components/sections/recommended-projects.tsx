"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

const projects = [
    {
        name: "Vario Finance",
        category: "Fintech",
        image: "/images/showcase-blur.png", // Using existing image for safety
        slug: "vario-finance",
        color: "#C4A35A"
    },
    {
        name: "EcoSphere",
        category: "Sustainability",
        image: "/images/task-ui.png", // Using existing image
        slug: "ecosphere",
        color: "#769268"
    },
    {
        name: "Artemis",
        category: "E-commerce",
        image: "/images/custom-art.jpg", // Using existing image
        slug: "artemis",
        color: "#2A1818"
    }
]

export function RecommendedProjects() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"])

    return (
        <section ref={containerRef} className="py-32 overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
                <div>
                    {/* Dashed line decoration similar to screenshot */}
                    <div className="w-12 h-[1px] border-t border-dashed border-[#C4A35A] mb-8"></div>
                    <h2 className="text-5xl md:text-6xl font-serif text-[#5A3E3E] tracking-tight">Our Projects</h2>
                </div>

                <div className="max-w-lg text-right md:text-right">
                    <p className="text-sm md:text-base text-[#5A3E3E]/70 leading-relaxed font-light">
                        Our approach is designed for maximum efficiency without sacrificing quality. We adapt to your needs while maintaining our core principles.
                    </p>
                </div>
            </div>

            <div className="pl-6 md:pl-[calc((100vw-72rem)/2+1.5rem)]">
                <motion.div
                    className="flex gap-8 cursor-grab active:cursor-grabbing w-max"
                    drag="x"
                    dragConstraints={containerRef}
                    style={{ x }}
                >
                    {projects.map((project, i) => (
                        <Link key={i} href={`/projects/${project.slug}`} className="group relative w-[85vw] md:w-[600px] aspect-[4/3] md:aspect-[16/9] rounded-[2rem] overflow-hidden shadow-lg">
                            <div className="absolute inset-0 bg-[#2A1818] transition-transform duration-700 group-hover:scale-105">
                                <img src={project.image} alt={project.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                            </div>

                            {/* Overlay Content */}
                            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between">
                                <div className="flex justify-end">
                                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                        <ArrowUpRight className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <span style={{ color: project.color }} className="text-xs font-bold uppercase tracking-widest mb-2 block">{project.category}</span>
                                    <h3 className="text-3xl md:text-5xl text-white font-serif">{project.name}</h3>
                                </div>
                            </div>
                        </Link>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
