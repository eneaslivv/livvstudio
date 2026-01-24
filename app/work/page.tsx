"use client"

import { Navbar } from "@/components/layout/navbar"
import { FooterSection } from "@/components/sections/footer-section"
import { ProjectArchive } from "@/components/sections/project-archive"
import { PixelCanvas } from "@/components/ui/pixel-canvas"

export default function WorkPage() {
    return (
        <main className="bg-[#FDFCF8]">
            {/* Pixel FX background for continuity, maybe lighter? */}
            {/* <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
                <PixelCanvas />
             </div> */}

            <div className="relative z-10">
                <Navbar />

                <div className="pt-32">
                    <ProjectArchive />
                </div>

                <FooterSection />
            </div>
        </main>
    )
}
