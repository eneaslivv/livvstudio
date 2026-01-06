"use client"

import Image from "next/image"

export const TechStackTicker = () => {
    // Duplicated for infinite loop
    const logos = [
        { src: "/brands/n8n-text.png", alt: "n8n", width: 40 },
        { src: "/brands/curve.png", alt: "Curve", width: 24 },
        { src: "/brands/bolt.png", alt: "Bolt", width: 20 },
        { src: "/brands/framer.png", alt: "Framer", width: 22 },
        { src: "/brands/webflow.png", alt: "Webflow", width: 24 },
        { src: "/brands/n8n-icon.png", alt: "n8n Icon", width: 24 },
        // Repeat
        { src: "/brands/n8n-text.png", alt: "n8n", width: 40 },
        { src: "/brands/curve.png", alt: "Curve", width: 24 },
        { src: "/brands/bolt.png", alt: "Bolt", width: 20 },
        { src: "/brands/framer.png", alt: "Framer", width: 22 },
        { src: "/brands/webflow.png", alt: "Webflow", width: 24 },
        { src: "/brands/n8n-icon.png", alt: "n8n Icon", width: 24 },
    ]

    return (
        <div className="w-full mt-2">
            <div className="max-w-lg mx-auto overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] opacity-60 hover:opacity-100 transition-opacity duration-500">
                <div className="flex items-center gap-12 animate-scroll-left whitespace-nowrap py-2">
                    {logos.map((logo, i) => (
                        <div key={i} className="flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300">
                            <Image
                                src={logo.src}
                                alt={logo.alt}
                                width={logo.width}
                                height={24}
                                className="h-5 w-auto object-contain"
                            />
                        </div>
                    ))}
                    {/* Clone for Seamless Loop */}
                    {logos.map((logo, i) => (
                        <div key={`clone - ${i} `} className="flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300">
                            <Image
                                src={logo.src}
                                alt={logo.alt}
                                width={logo.width}
                                height={24}
                                className="h-5 w-auto object-contain"
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
                    animation: scroll-left 40s linear infinite; /* Slower */
                }
           `}</style>
        </div>
    )
}
