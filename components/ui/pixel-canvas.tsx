"use client"

import { useEffect, useRef } from "react"

export function PixelCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let width = window.innerWidth
        let height = window.innerHeight
        let particles: Particle[] = []
        let mouse = { x: -5000, y: -5000 }
        let animationFrameId: number

        // Configuration matches user provided code
        const gridSize = 11
        const pointSize = 1.6

        // Helper: Linear Interpolation
        function lerp(start: number, end: number, factor: number) {
            return start + (end - start) * factor
        }

        class Particle {
            originX: number
            originY: number
            x: number
            y: number
            baseAlpha: number
            alpha: number
            baseSize: number
            size: number
            hue: number
            colorStrength: number
            phase: number

            constructor(x: number, y: number) {
                this.originX = x
                this.originY = y
                this.x = x
                this.y = y

                // Base Visibility
                this.baseAlpha = Math.random() * 0.2 + 0.1
                this.alpha = this.baseAlpha
                this.baseSize = pointSize
                this.size = this.baseSize

                // Color Logic
                this.hue = (x / width) * 360
                this.colorStrength = 0
                this.phase = Math.random() * Math.PI * 2
            }

            update(time: number) {
                // 1. Idle Animation
                const idleSpeed = 0.002
                const waveScale = 0.04
                const idleX = Math.sin(time * idleSpeed + this.originY * waveScale + this.phase) * 6
                const idleY = Math.cos(time * idleSpeed + this.originX * waveScale + this.phase) * 6

                // 2. Mouse Interaction
                const dx = mouse.x - this.originX
                const dy = mouse.y - this.originY
                const dist = Math.sqrt(dx * dx + dy * dy)
                const radius = 180

                let pushX = 0
                let pushY = 0

                if (dist < radius) {
                    const angle = Math.atan2(dy, dx)
                    const force = (radius - dist) / radius
                    const smoothForce = force * force
                    const repulsion = 25

                    pushX = -Math.cos(angle) * smoothForce * repulsion
                    pushY = -Math.sin(angle) * smoothForce * repulsion

                    // Activate dark color on hover
                    this.colorStrength = lerp(this.colorStrength, 1, 0.1)
                    this.size = lerp(this.size, this.baseSize * 1.5, 0.1)
                } else {
                    this.colorStrength = lerp(this.colorStrength, 0, 0.05)
                    this.size = lerp(this.size, this.baseSize, 0.05)
                }

                // 3. Target Position
                const targetX = this.originX + idleX + pushX
                const targetY = this.originY + idleY + pushY

                // 4. Smooth Move (Lerp)
                this.x = lerp(this.x, targetX, 0.08)
                this.y = lerp(this.y, targetY, 0.08)

                // Alpha Pulse
                const pulse = Math.sin(time * 0.002 + this.phase)
                this.alpha = this.baseAlpha + (pulse * 0.05) + (this.colorStrength * 0.3)
            }

            draw() {
                if (!ctx) return
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)

                // COLOR PRO LOGIC
                if (this.colorStrength > 0.01) {
                    // Dark Iridescence
                    ctx.fillStyle = `hsla(${this.hue}, 40%, 25%, ${this.alpha})`
                } else {
                    // Elegant Dark Black/Graphite
                    ctx.fillStyle = `rgba(20, 20, 25, ${this.alpha})`
                }
                ctx.fill()
            }
        }

        function initParticles() {
            particles = []
            width = window.innerWidth
            height = window.innerHeight
            canvas!.width = width
            canvas!.height = height

            const cols = Math.floor(width / gridSize)
            const rows = Math.floor(height / gridSize)
            const cx = width / 2
            const cy = height / 2 - (height * 0.1)

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * gridSize + (gridSize / 2)
                    const y = j * gridSize + (gridSize / 2)

                    // Shape Logic
                    const dx = x - cx
                    const dy = y - cy
                    const distFromCenter = Math.sqrt(dx * dx + dy * dy)
                    const angle = Math.atan2(dy, dx)

                    const k = 4
                    const roseShape = Math.abs(Math.cos(k * angle))
                    const maxRadius = Math.min(width, height) * 0.25

                    if (distFromCenter < maxRadius * (roseShape + 0.35)) {
                        // Inner Hole for Text
                        if (distFromCenter > 110) {
                            if (Math.random() > 0.3) {
                                particles.push(new Particle(x, y))
                            }
                        }
                    }
                }
            }
        }

        // Resize Logic
        const handleResize = () => {
            initParticles()
        }

        // Add window resize listener (robust)
        window.addEventListener('resize', handleResize)

        // Initial init
        initParticles()

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
            window.removeEventListener('resize', handleResize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full pointer-events-auto block"
        />
    )
}
