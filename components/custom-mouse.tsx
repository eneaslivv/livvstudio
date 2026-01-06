"use client"

import { useEffect, useRef } from "react"

export function CustomMouse() {
  const dotRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mouseX = 0
    let mouseY = 0
    let dotX = 0
    let dotY = 0
    let circleX = 0
    let circleY = 0
    let animationId: number

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const animate = () => {
      // Dot follows mouse instantly
      dotX = mouseX
      dotY = mouseY

      // Circle follows with smooth lerp
      circleX += (mouseX - circleX) * 0.12
      circleY += (mouseY - circleY) * 0.12

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotX - 6}px, ${dotY - 6}px)`
      }
      if (circleRef.current) {
        circleRef.current.style.transform = `translate(${circleX - 16}px, ${circleY - 16}px)`
      }

      animationId = requestAnimationFrame(animate)
    }

    window.addEventListener("mousemove", handleMouseMove)
    animationId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <>
      {/* Main cursor dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference w-3 h-3 rounded-full bg-white"
      />
      {/* Trailing circle */}
      <div
        ref={circleRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-difference w-8 h-8 rounded-full border border-white/60"
      />
    </>
  )
}
