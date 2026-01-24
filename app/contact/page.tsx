"use client"

import { ContactSection } from "@/components/sections/contact-section"
import { Navbar } from "@/components/layout/navbar"
import { CustomMouse } from "@/components/custom-mouse"
import { AnimatedBorders } from "@/components/ui/animated-borders"

export default function ContactPage() {
  return (
    <div className="min-h-screen w-full bg-black cursor-none overflow-x-hidden">
      <CustomMouse />
      <Navbar isLoaded={true} />
      <main className="pt-24 md:pt-32">
        {/* Contenedor principal que define el ancho y posiciona las líneas */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
          <AnimatedBorders className="hidden md:block z-30" />
          <ContactSection />
        </div>
      </main>
    </div>
  )
}
