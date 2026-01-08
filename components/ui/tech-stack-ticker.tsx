"use client"

import Image from "next/image"

export const TechStackTicker = () => {
    // Duplicated for infinite loop
    const logos = [
        { src: "/brands/react.png", alt: "React" },
        { src: "/brands/flutter.png", alt: "Flutter" },
        { src: "/brands/nextjs.png", alt: "Next.js" },
        { src: "/brands/curve.png", alt: "Curve" },
        { src: "/brands/bolt.png", alt: "Bolt" },
        { src: "/brands/framer.png", alt: "Framer" },
        { src: "/brands/webflow.png", alt: "Webflow" },
    ]

    return (
        <div className="w-full bg-[#2c0405] py-4">
            <div className="max-w-lg mx-auto overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                <div className="flex animate-scroll-left w-max">
                    {/* First set */}
                    <div className="flex items-center gap-16 pr-16">
                        {logos.map((logo, i) => (
                            <div key={i} className="flex-shrink-0" style={{ filter: "brightness(0) saturate(100%) invert(96%) sepia(21%) saturate(220%) hue-rotate(345deg) brightness(101%) contrast(93%)" }}>
                                <img
                                    src={logo.src}
                                    alt={logo.alt}
                                    className="h-5 md:h-6 w-auto object-contain"
                                />
                            </div>
                        ))}
                    </div>
                    {/* Second set for seamless loop */}
                    <div className="flex items-center gap-16 pr-16" aria-hidden="true">
                        {logos.map((logo, i) => (
                            <div key={`clone-${i}`} className="flex-shrink-0" style={{ filter: "brightness(0) saturate(100%) invert(96%) sepia(21%) saturate(220%) hue-rotate(345deg) brightness(101%) contrast(93%)" }}>
                                <img
                                    src={logo.src}
                                    alt={logo.alt}
                                    className="h-5 md:h-6 w-auto object-contain"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes scroll-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll-left {
                    animation: scroll-left 30s linear infinite;
                }
           `}</style>
        </div>
    )
}
