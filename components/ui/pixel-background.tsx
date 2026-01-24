"use client"

import { useEffect, useRef } from "react"

export function PixelBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let width = container.clientWidth || window.innerWidth
        let height = container.clientHeight || window.innerHeight

        let particles: Particle[] = []
        let mouse = { x: -5000, y: -5000 }
        let animationFrameId: number

        const gridSize = 12 // Reduced density slightly for performance, but good coverage
        const pointSize = 2.5 // Larger particles for visibility

        class Particle {
            originX: number
            originY: number
            x: number
            y: number
            baseAlpha: number
            alpha: number
            size: number
            colorStrength: number
            phase: number

            constructor(x: number, y: number) {
                this.originX = x
                this.originY = y
                this.x = x
                this.y = y

                // HIGH VISIBILITY ALPHA
                this.baseAlpha = Math.random() * 0.5 + 0.3
                this.alpha = this.baseAlpha
                this.size = pointSize

                this.colorStrength = 0
                this.phase = Math.random() * Math.PI * 2
            }

            update(time: number) {
                // Idle movement
                const idleSpeed = 0.0005
                const waveScale = 0.04
                const idleX = Math.sin(time * idleSpeed + this.originY * waveScale + this.phase) * 3
                const idleY = Math.cos(time * idleSpeed + this.originX * waveScale + this.phase) * 3

                // Mouse interaction
                const dx = mouse.x - this.originX
                const dy = mouse.y - this.originY
                const dist = Math.sqrt(dx * dx + dy * dy)
                const radius = 250 // Large interaction radius

                let pushX = 0
                let pushY = 0

                if (dist < radius) {
                    const angle = Math.atan2(dy, dx)
                    const force = (radius - dist) / radius
                    const smoothForce = force * force
                    const repulsion = 50

                    pushX = -Math.cos(angle) * smoothForce * repulsion
                    pushY = -Math.sin(angle) * smoothForce * repulsion

                    this.size = pointSize * 2 // Grow large
                } else {
                    this.size = this.size + (pointSize - this.size) * 0.1
                }

                const targetX = this.originX + idleX + pushX
                const targetY = this.originY + idleY + pushY

                this.x = this.x + (targetX - this.x) * 0.1
                this.y = this.y + (targetY - this.y) * 0.1

                const pulse = Math.sin(time * 0.002 + this.phase)
                this.alpha = this.baseAlpha + (pulse * 0.1)
            }

            draw() {
                if (!ctx) return
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(20, 20, 25, ${this.alpha})` // Dark charcoal
                ctx.fill()
            }
        }

        function initParticles() {
            particles = []
            // Fallback for 0 dimensions
            if (width === 0) width = container?.clientWidth || window.innerWidth
            if (height === 0) height = container?.clientHeight || window.innerHeight

            const cols = Math.floor(width / gridSize)
            const rows = Math.floor(height / gridSize)

            // SIMPLIFIED LOGIC: FILL SCREEN (No Rose Shape for now to ensure visibility)
            // Once visible, we can re-add the shape if requested, but first we need pixels.
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * gridSize + (gridSize / 2)
                    const y = j * gridSize + (gridSize / 2)

                    // Simple random drop to fill 40% of grid points everywhere
                    if (Math.random() > 0.6) {
                        particles.push(new Particle(x, y))
                    }
                }
            }
        }

        // Use ResizeObserver for robustness
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width: w, height: h } = entry.contentRect
                if (w > 0 && h > 0) {
                    width = w
                    height = h
                    if (canvasRef.current) {
                        canvasRef.current.width = w
                        canvasRef.current.height = h
                    }
                    initParticles()
                }
            }
        })

        resizeObserver.observe(container)
        initParticles() // Run once immediately

        function animate(time: number) {
            if (!ctx) return
            ctx.clearRect(0, 0, width, height)

            particles.forEach(p => {
                p.update(time)
                p.draw()
            })

            animationFrameId = requestAnimationFrame(animate)
        }

        const handleMouseMove = (e: MouseEvent) => {
            if (!canvas) return
            const rect = canvas.getBoundingClientRect()
            mouse.x = e.clientX - rect.left
            mouse.y = e.clientY - rect.top
        }

        window.addEventListener('mousemove', handleMouseMove)
        animationFrameId = requestAnimationFrame(animate)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            resizeObserver.disconnect()
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <div ref={containerRef} className="absolute inset-0 z-0 bg-red-500/10 border-4 border-red-500 flex items-center justify-center">
            <p className="absolute top-10 left-10 font-bold text-red-600 z-50 text-xl">DEBUG: ANIMATION ACTIVE</p>
            <canvas
                ref={canvasRef}
                className="w-full h-full pointer-events-auto block mix-blend-multiply"
            />
        </div>
    )
}
