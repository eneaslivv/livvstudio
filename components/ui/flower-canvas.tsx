"use client"

import { useEffect, useRef } from "react"

export function FlowerCanvas({ className }: { className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let width = 300 // Fixed/Base width for calculation
        let height = 300 // Fixed/Base height for calculation
        let particles: Particle[] = []
        let mouse = { x: -5000, y: -5000 }
        let animationFrameId: number

        // Smaller scale configuration
        const gridSize = 6 // Smaller grid for higher density in small space
        const pointSize = 1.2
        const colorPrimary = { h: 358, s: 76, l: 33 } // #822b2e (Krufood Red approx)
        const colorSecondary = { h: 359, s: 82, l: 9 } // #2c0405 (Krufood Dark approx)

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
                this.baseAlpha = Math.random() * 0.3 + 0.1
                this.alpha = this.baseAlpha
                this.baseSize = pointSize
                this.size = this.baseSize

                // Color Logic
                this.hue = (x / width) * 360
                this.colorStrength = 0
                this.phase = Math.random() * Math.PI * 2
            }

            update(time: number) {
                // 1. Idle Animation (Slower, organic)
                const idleSpeed = 0.001
                const waveScale = 0.08
                // Rotating subtle movement
                const idleX = Math.sin(time * idleSpeed + this.originY * waveScale + this.phase) * 3
                const idleY = Math.cos(time * idleSpeed + this.originX * waveScale + this.phase) * 3

                // 2. Mouse Interaction
                const dx = mouse.x - this.originX
                const dy = mouse.y - this.originY
                const dist = Math.sqrt(dx * dx + dy * dy)
                const radius = 100 // Smaller interaction radius

                let pushX = 0
                let pushY = 0

                if (dist < radius) {
                    const angle = Math.atan2(dy, dx)
                    const force = (radius - dist) / radius
                    const smoothForce = force * force
                    const repulsion = 15

                    pushX = -Math.cos(angle) * smoothForce * repulsion
                    pushY = -Math.sin(angle) * smoothForce * repulsion

                    // Activate color on hover
                    this.colorStrength = lerp(this.colorStrength, 1, 0.1)
                    this.size = lerp(this.size, this.baseSize * 1.8, 0.1)
                } else {
                    this.colorStrength = lerp(this.colorStrength, 0, 0.05)
                    this.size = lerp(this.size, this.baseSize, 0.05)
                }

                // 3. Target Position
                const targetX = this.originX + idleX + pushX
                const targetY = this.originY + idleY + pushY

                // 4. Smooth Move (Lerp)
                this.x = lerp(this.x, targetX, 0.1)
                this.y = lerp(this.y, targetY, 0.1)

                // Alpha Pulse
                const pulse = Math.sin(time * 0.003 + this.phase)
                this.alpha = this.baseAlpha + (pulse * 0.1) + (this.colorStrength * 0.4)
            }

            draw() {
                if (!ctx) return
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)

                if (this.colorStrength > 0.01) {
                    // Active color (Krufood Red-ish)
                    ctx.fillStyle = `hsla(${colorPrimary.h}, ${colorPrimary.s}%, ${colorPrimary.l}%, ${this.alpha})`
                } else {
                    // Passive color (Dark Krufood)
                    ctx.fillStyle = `rgba(44, 4, 5, ${this.alpha})` // #2c0405
                }
                ctx.fill()
            }
        }

        function initParticles() {
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            width = rect.width
            height = rect.height
            canvas.width = width
            canvas.height = height

            particles = []

            const cols = Math.floor(width / gridSize)
            const rows = Math.floor(height / gridSize)
            const cx = width / 2
            const cy = height / 2

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * gridSize + (gridSize / 2)
                    const y = j * gridSize + (gridSize / 2)

                    // Rose Shape Logic
                    const dx = x - cx
                    const dy = y - cy
                    const distFromCenter = Math.sqrt(dx * dx + dy * dy)
                    const angle = Math.atan2(dy, dx)

                    // k=4 gives a 8-petaled rose/flower shape, classic "flower" look
                    const k = 4
                    const roseShape = Math.abs(Math.cos(k * angle))
                    const maxRadius = Math.min(width, height) * 0.4

                    if (distFromCenter < maxRadius * (roseShape + 0.5)) { // +0.5 makes it fuller
                        // Removed the internal hole check to make it a solid flower
                        // But adding a tiny bit of randomness to edge
                        if (Math.random() > 0.4) {
                            particles.push(new Particle(x, y))
                        }
                    }
                }
            }
        }

        // Resize Logic
        const handleResize = () => {
            initParticles()
        }

        window.addEventListener('resize', handleResize)

        // Wait for layout
        setTimeout(initParticles, 100);

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

        // Listen on window to catch moves outside valid small canvas area if wanted, 
        // but for a small decorative element, canvas-local is usually fine or better.
        // Let's attach to canvas for now to keep it isolated.
        canvas.addEventListener('mousemove', handleMouseMove)

        animationFrameId = requestAnimationFrame(animate)

        return () => {
            canvas.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('resize', handleResize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className={`pointer-events-auto block ${className}`}
        />
    )
}
