"use client"

import Image from "next/image"

export const TechStackTicker = () => {
    // Duplicated for infinite loop
    const logos = [
        { src: "/brands/n8n-text.png", alt: "n8n", width: 60 },
        { src: "/brands/curve.png", alt: "Curve", width: 36 },
        { src: "/brands/bolt.png", alt: "Bolt", width: 30 },
        { src: "/brands/framer.png", alt: "Framer", width: 32 },
        { src: "/brands/webflow.png", alt: "Webflow", width: 36 },
        { src: "/brands/n8n-icon.png", alt: "n8n Icon", width: 36 },
    ]

    return (
        <div className="w-full mt-2">
            <div className="max-w-lg mx-auto overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] opacity-60 hover:opacity-100 transition-opacity duration-500">
                <div className="flex items-center gap-16 animate-scroll-left whitespace-nowrap py-2">
                    {/* First set */}
                    {logos.map((logo, i) => (
                        <div key={i} className="flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300">
                            <Image
                                src={logo.src}
                                alt={logo.alt}
                                width={logo.width}
                                height={32}
                                className="h-7 w-auto object-contain"
                            />
                        </div>
                    ))}
                    {/* Second set for seamless loop */}
                    {logos.map((logo, i) => (
                        <div key={`clone-${i}`} className="flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300">
                            <Image
                                src={logo.src}
                                alt={logo.alt}
                                width={logo.width}
                                height={32}
                                className="h-7 w-auto object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes scroll-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll-left {
                    animation: scroll-left 60s linear infinite;
                }
           `}</style>
        </div>
    )
}
