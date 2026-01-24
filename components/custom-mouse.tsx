"use client"

import { useEffect, useRef, useState } from "react"

export function CustomMouse() {
  const dotRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)
  const [isTouchDevice, setIsTouchDevice] = useState(true); // Default to true, assuming touch until proven otherwise.

  useEffect(() => {
    // This check runs only on the client side.
    const hasNoMouse = window.matchMedia("(pointer: coarse)").matches;
    setIsTouchDevice(hasNoMouse);

    if (hasNoMouse) {
      // If it's a touch device, do nothing.
      return;
    }

    let mouseX = 0;
    let mouseY = 0;
    let animationId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX - 6}px, ${mouseY - 6}px)`;
      }
      if (circleRef.current) {
        let circleX = parseFloat(circleRef.current.style.left || "0");
        let circleY = parseFloat(circleRef.current.style.top || "0");
        circleRef.current.style.left = `${circleX + (mouseX - circleX) * 0.12}px`;
        circleRef.current.style.top = `${circleY + (mouseY - circleY) * 0.12}px`;
        circleRef.current.style.transform = 'translate(-50%, -50%)';
      }
      animationId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []); // Empty dependency array ensures this runs only once.

  // Strictly render nothing on touch devices.
  if (isTouchDevice) {
    return null;
  }

  return (
    <>
      <div ref={dotRef} className="fixed pointer-events-none z-[9999] w-3 h-3 rounded-full bg-white mix-blend-difference" />
      <div ref={circleRef} className="fixed pointer-events-none z-[9998] w-8 h-8 rounded-full border border-white/60 mix-blend-difference" style={{ left: '0', top: '0' }}/>
    </>
  );
}
