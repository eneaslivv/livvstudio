"use client"

import Link from "next/link"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const logos = [
  {
    src: "/logos-header/blackbox.png",
    alt: "Blackbox AI",
    href: "https://www.blackbox.ai/",
    description: "The AI coding assistant that turns any question into code.",
    useMask: true
  },
  {
    src: "/logos-header/buda.png",
    alt: "Buda.com",
    href: "https://www.buda.com/argentina",
    description: "La forma más simple y segura de comprar y vender criptomonedas.",
    useMask: true
  },
  {
    src: "/logos-header/heygen.png",
    alt: "HeyGen",
    href: "https://www.heygen.com/",
    description: "AI video generator. Create stunning videos with AI avatars and voices.",
    useMask: true
  },
  {
    src: "/logos-header/logo-6.png",
    alt: "ViewFi",
    href: "https://viewfi.live/",
    description: "Real-time monitoring and analytics.",
    useMask: true
  },
  {
    src: "/logos-header/logo-7.png",
    alt: "Remax",
    href: "https://www.remax.com.ar/",
    description: "Venta y Alquiler de Propiedades.",
    useMask: true
  },
  {
    src: "/logos-header/sacoa.png",
    alt: "Sacoa Entertainment",
    href: "https://sacoa.com/",
    description: "Get ready for the most fun experience.",
    useMask: true
  },
  {
    src: "/logos-header/wortise.png",
    alt: "Wortise",
    href: "https://wortise.com/es",
    description: "Aumente sus ingresos publicitarios con AdMonet. Soluciones basadas en IA.",
    useMask: true
  },
];

export function ClientLogoSlider() {
  // Increase duplication to 6x to ensure smooth infinite scroll on ultra-wide screens
  const duplicatedLogos = [...logos, ...logos, ...logos, ...logos, ...logos, ...logos];

  return (
    <section className="py-2 bg-white">
      <div className="container mx-auto text-center">
        <h2 className="text-[10px] font-medium text-gray-400 tracking-widest uppercase mb-6">
          Some of our clients
        </h2>
        <div className="max-w-5xl mx-auto px-4">
          <div className="relative w-full overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)" }}>
            <div className="flex animate-scroll items-center w-max">
              <TooltipProvider>
                {duplicatedLogos.map((logo, index) => (
                  <div key={index} className="flex-shrink-0 mx-8">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href={logo.href} target={logo.href.startsWith("http") ? "_blank" : undefined} className="block group">
                          {logo.useMask !== false ? (
                            /* Masked version (Colorable) */
                            <div
                              className={`w-28 h-12 transition-colors duration-300 bg-[#2C0405] group-hover:bg-gray-400`}
                              style={{
                                maskImage: `url(${logo.src})`,
                                maskSize: "contain",
                                maskRepeat: "no-repeat",
                                maskPosition: "center",
                                WebkitMaskImage: `url(${logo.src})`,
                                WebkitMaskSize: "contain",
                                WebkitMaskRepeat: "no-repeat",
                                WebkitMaskPosition: "center",
                              }}
                            />
                          ) : (
                            /* Original Image version (for non-transparent logos) */
                            <div className={`${logo.className || "w-28"} h-12 flex items-center justify-center relative`}>
                              {/* Use Next.js Image for original rendering */}
                              <img
                                src={logo.src}
                                alt={logo.alt}
                                className="w-full h-full object-contain filter transition-all duration-300 group-hover:opacity-50"
                              />
                            </div>
                          )}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-center">{logo.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                ))}
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-16.666%); /* 1/6 of the total width since we duplicated 6 times */
          }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite; /* Slower animation for better readability */
        }
        .animate-scroll:hover {
          animation-play-state: paused; /* Pause on hover for easier interaction */
        }
      `}</style>
    </section>
  );
}
