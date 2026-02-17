"use client"

import { useRef, useEffect, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { AnimatedBorders } from "@/components/ui/animated-borders"
import { RevealText } from "@/components/ui/reveal-text"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"

const stats = [
  { value: "150+", label: "Projects Delivered", description: "Across 12 countries" },
  { value: "08", label: "Years Experience", description: "Design & Development" },
  { isBadge: true, badgeSrc: "/digital-design-primary.svg", alt: "Digital Design Award 2026" },
  { value: "24/7", label: "Support", description: "Dedicated team" },
]

export function AboutSection({ id }: { id?: string }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center", "end center", "end start"]
  })

  // Background Parallax and Opacity
  const bgOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -40])
  const parallaxYReverse = useTransform(scrollYProgress, [0, 1], [0, 40])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // Variants for staggered stats
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }
    }
  }

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#2C0405]"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f5f2ed] via-[#f5f2ed]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2c0405]/70 to-[#2c0405]" />
      </div>
      {/* Dynamic Background Layer */}
      <motion.div
        className="absolute inset-0 z-0 bg-[#2C0405]"
        style={{ opacity: bgOpacity }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32 relative z-10">
          <AnimatedBorders color="#EDE5D8" />

        <div className="relative">
          {/* Decorative Parallax Square */}
          <motion.div
            className="absolute inset-x-0 inset-y-0 left-1/2 bg-[#2C0405]/80 hidden md:block"
            style={{ y: parallaxY }}
          />

          {/* Vertical Divider with Line-draw effect */}
          <motion.div
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#EDE5D8]/10 -translate-x-1/2"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: isVisible ? 1 : 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* Header */}
          <div className="w-full relative z-10 mb-20 md:mb-24">
                <div className="relative w-full h-[1px]">
                  <AnimatedBorders showLeft={false} showRight={false} showTop={true} fullWidth={true} color="#EDE5D8" />
                </div>
            <div className="pt-6 flex justify-between items-center text-[10px] uppercase tracking-widest text-[#EDE5D8]/80 px-6 md:px-12">
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -10 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                © About Us 私たち
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 10 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                (WDX® — 04)
              </motion.span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 relative">

            {/* Left Column: Story */}
            <div className="pl-6 md:pl-10 md:pr-16 lg:pr-24 md:py-8">
              <h2 className="section-heading mb-10">
                <RevealText text="Building the future of digital experiences." className="text-[#EDE5D8]" isVisible={isVisible} />
              </h2>

              <div className="space-y-8 text-[#EDE5D8]/90 font-light text-base md:text-lg leading-relaxed max-w-md">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  We are a collective of designers, developers, and creative technologists obsessed with crafting exceptional digital products.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  Every project is an opportunity to explore new possibilities and push creative boundaries, delivering work that drives real business results.
                </motion.p>
              </div>

              <motion.div
                className="mt-16"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <a href="#work" className="group flex items-center gap-3 text-sm tracking-widest uppercase text-[#EDE5D8] font-medium hover:text-[#F1ADD8] transition-colors duration-300">
                  <span className="w-12 h-[1px] bg-[#EDE5D8] group-hover:bg-[#F1ADD8] transition-all duration-300" />
                  See Our Work
                </a>
              </motion.div>
            </div>

            {/* Right Column: Stats Staggered */}
            <motion.div
              className="pl-6 md:pl-16 lg:pl-24 md:py-8 mt-16 md:mt-0 relative overflow-hidden"
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={containerVariants}
            >
              {/* Background Image - positioned at bottom */}
              <div className="absolute inset-0" aria-hidden>
                <div className="absolute inset-0 bg-[#2C0405]" />
                <Image
                  src="/about-stats-bg.jpg"
                  alt="Mountain landscape"
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 900px"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2c0405]/40 to-[#1a0402]/80" />
              </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16 relative z-10">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="relative group"
                  >
                    {(stat as any).isBadge ? (
                      /* SVG Badge */
                      <div className="flex items-center justify-center py-4">
                        <Image
                          src={(stat as any).badgeSrc}
                          alt={(stat as any).alt}
                          width={150}
                          height={170}
                          className="object-contain"
                          priority
                        />
                      </div>
                    ) : (
                      /* Regular Stat Card */
                      <>
                        {/* Dash with floating effect */}
                        <motion.div
                          className="w-4 h-[1px] bg-[#F1ADD8] mb-6 opacity-80"
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                        />

                        <div className="text-4xl md:text-5xl font-light text-[#EDE5D8] mb-3 tabular-nums">
                          {(stat as any).value}
                        </div>
                        <div className="text-xs font-bold text-[#EDE5D8] uppercase tracking-[0.2em] mb-2 opacity-90">
                          {(stat as any).label}
                        </div>
                        <div className="text-[10px] text-[#F1ADD8] font-mono tracking-wide">
                          {(stat as any).description}
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* Bottom Divider */}
          <motion.div
            className="mt-24 w-full h-[1px] bg-[#EDE5D8]/10"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isVisible ? 1 : 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
        </div>
      </div>
    </section>
  )
}
