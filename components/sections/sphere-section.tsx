"use client"

import { useRef, useState, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Text, OrbitControls, Environment, Float, MeshTransmissionMaterial, Sparkles, Html, useProgress } from "@react-three/drei"
import * as THREE from "three"
import { AnimatedBorders } from "@/components/ui/animated-borders"
import { motion } from "framer-motion"

function Loader() {
    const { progress } = useProgress()
    return (
        <Html center>
            <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-[1px] bg-[#C4A35A]/30 overflow-hidden">
                    <div className="h-full bg-[#C4A35A]" style={{ width: `${progress}%` }} />
                </div>
                <span className="text-[10px] text-[#5A3E3E] tracking-widest uppercase font-mono">{progress.toFixed(0)}%</span>
            </div>
        </Html>
    )
}

function LivvSphere() {
    const mesh = useRef<THREE.Mesh>(null)

    useFrame((state) => {
        if (!mesh.current) return
        // Slow rotation
        mesh.current.rotation.y += 0.002
        mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    })

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh ref={mesh} scale={2.8}>
                <sphereGeometry args={[1, 64, 64]} />
                {/* Premium Glass/Pearl Material */}
                <MeshTransmissionMaterial
                    backside
                    backsideThickness={5} // Helps with refraction
                    thickness={2}
                    roughness={0.1}
                    transmission={1} // Glass-like
                    ior={1.5} // Index of refraction
                    chromaticAberration={0.06} // Subtle dispersion
                    anisotropy={0.1}
                    distortion={0.1}
                    distortionScale={0.3}
                    temporalDistortion={0.5}
                    clearcoat={1}
                    attenuationDistance={0.5}
                    attenuationColor="#ffffff"
                    color="#fdfcf6" // Pearl/Cream tint
                />
            </mesh>

            {/* Interior Text */}
            <Text
                position={[0, 0, 0]}
                fontSize={0.8}
                color="#1a1a1a"
                anchorX="center"
                anchorY="middle"
                anchorX="center"
                anchorY="middle"
            >
                LIVV
            </Text>

            {/* Floating Particles around */}
            <Sparkles count={40} scale={6} size={2} speed={0.4} opacity={0.5} color="#C4A35A" />
        </Float>
    )
}

function FloatingRing() {
    // Kept for future extension but unused for minimalism
    return null
}

export function SphereSection() {
    return (
        <section className="relative w-full h-[80vh] overflow-hidden flex flex-col items-center justify-center">
            <AnimatedBorders className="hidden md:block mx-6 md:mx-12" />

            <div className="absolute inset-0 z-10">
                <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
                    <Suspense fallback={<Loader />}>
                        <Environment preset="studio" />
                        <LivvSphere />
                        <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 2.5} maxPolarAngle={Math.PI / 1.5} />
                    </Suspense>
                </Canvas>
            </div>

            {/* Overlay Content */}
            <div className="relative z-20 text-center mt-[40vh] pointer-events-none">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="text-[#5A3E3E]/60 text-sm md:text-base font-light tracking-[0.2em] uppercase"
                >
                    Where Business Meets Art
                </motion.p>
            </div>
        </section>
    )
}
