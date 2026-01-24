import { HTMLAttributes } from "react";
import { motion, SVGMotionProps } from "framer-motion";

interface IconProps extends SVGMotionProps<SVGSVGElement> {
    strokeWidth?: number;
    isActive?: boolean;
}

export const IconClarity = ({ className, strokeWidth = 1, isActive, ...props }: IconProps) => (
    <motion.svg viewBox="0 0 48 48" fill="none" className={className} {...props}>
        {/* Decorative Grid Background */}
        <motion.path d="M4 24H44M24 4V44" stroke="currentColor" strokeWidth={0.5} className="opacity-10" strokeDasharray="2 2" />

        {/* Outer Ring: Slow CCW Rotation */}
        <motion.g animate={{ rotate: isActive ? -360 : 0 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} style={{ originX: "50%", originY: "50%" }}>
            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth={strokeWidth} className="opacity-20" strokeDasharray="1 3" />
            <circle cx="24" cy="24" r="19" stroke="currentColor" strokeWidth={0.5} className="opacity-10" />
        </motion.g>

        {/* Middle Ring: Fast CW Rotation with Ticks */}
        <motion.g animate={{ rotate: isActive ? 360 : 0 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} style={{ originX: "50%", originY: "50%" }}>
            <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth={strokeWidth} className="opacity-40" strokeDasharray="4 4" />
        </motion.g>

        {/* Inner Aperture / Iris: Breathes and Rotates */}
        <motion.g animate={{ rotate: isActive ? [0, 90, 180, 270, 360] : 0, scale: isActive ? [1, 0.9, 1] : 1 }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} style={{ originX: "50%", originY: "50%" }}>
            <path d="M24 14L32.66 19M32.66 19L32.66 29M32.66 29L24 34M24 34L15.34 29M15.34 29L15.34 19M15.34 19L24 14" stroke="currentColor" strokeWidth={strokeWidth} className="opacity-80" />
            <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth={strokeWidth} className="opacity-10" />
        </motion.g>

        {/* Center Focus Point */}
        <motion.circle cx="24" cy="24" r="2" fill="currentColor"
            animate={{ opacity: isActive ? [1, 0.5, 1] : 1 }}
            transition={{ duration: 1, repeat: Infinity }}
        />
    </motion.svg>
);

export const IconProposal = ({ className, strokeWidth = 1, isActive, ...props }: IconProps) => (
    <motion.svg viewBox="0 0 48 48" fill="none" className={className} {...props}>
        {/* Bottom Layer */}
        <motion.path
            d="M12 28L24 34L36 28L24 22L12 28Z"
            stroke="currentColor" strokeWidth={strokeWidth} className="opacity-30"
            animate={{ y: isActive ? 0 : 0 }}
        />

        {/* Middle Layer (Explodes Up) */}
        <motion.path
            d="M12 22L24 28L36 22L24 16L12 22Z"
            stroke="currentColor" strokeWidth={strokeWidth} className="opacity-60"
            animate={{ y: isActive ? -4 : 0 }}
            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
        />

        {/* Top Layer (Explodes Further Up) */}
        <motion.path
            d="M12 16L24 22L36 16L24 10L12 16Z"
            stroke="currentColor" strokeWidth={strokeWidth} className="opacity-100"
            fill="currentColor" fillOpacity="0.05"
            animate={{ y: isActive ? -8 : 0 }}
            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 0.1 }}
        />

        {/* Vertical Connecting Lines (Dashed) */}
        <motion.path d="M12 28V16" stroke="currentColor" strokeWidth={0.5} strokeDasharray="2 2" className="opacity-20" animate={{ opacity: isActive ? 0.2 : 0 }} />
        <motion.path d="M36 28V16" stroke="currentColor" strokeWidth={0.5} strokeDasharray="2 2" className="opacity-20" animate={{ opacity: isActive ? 0.2 : 0 }} />
        <motion.path d="M24 34V22" stroke="currentColor" strokeWidth={0.5} strokeDasharray="2 2" className="opacity-20" animate={{ opacity: isActive ? 0.2 : 0 }} />

        {/* Scanning Highlight */}
        <motion.path
            d="M12 16L24 22M24 10L36 16"
            stroke="currentColor" strokeWidth={strokeWidth * 1.5} strokeLinecap="round" className="opacity-0"
            animate={{ opacity: isActive ? [0, 1, 0] : 0, pathLength: isActive ? [0, 1] : 0 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
        />
    </motion.svg>
);

export const IconSprint = ({ className, strokeWidth = 1, isActive, ...props }: IconProps) => (
    <motion.svg viewBox="0 0 48 48" fill="none" className={className} {...props}>
        {/* Central Core */}
        <circle cx="24" cy="24" r="4" stroke="currentColor" strokeWidth={strokeWidth} className="opacity-80" />

        {/* Inner Rotor: Fast Spin */}
        <motion.g animate={{ rotate: isActive ? 360 : 0 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} style={{ originX: "50%", originY: "50%" }}>
            <path d="M24 16V8M24 40V32M16 24H8M40 24H32" stroke="currentColor" strokeWidth={strokeWidth} className="opacity-40" />
        </motion.g>

        {/* Outer Turbine: Medium Spin CCW */}
        <motion.g animate={{ rotate: isActive ? -360 : 0 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} style={{ originX: "50%", originY: "50%" }}>
            <path d="M24 4C12.95 4 4 12.95 4 24C4 35.05 12.95 44 24 44C35.05 44 44 35.05 44 24C44 12.95 35.05 4 24 4ZM24 4V10M24 38V44M4 24H10M38 24H44" stroke="currentColor" strokeWidth={strokeWidth} className="opacity-20" strokeDasharray="2 4" />
        </motion.g>

        {/* Orbiting Particles */}
        <motion.g animate={{ rotate: isActive ? 360 : 0 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} style={{ originX: "50%", originY: "50%" }}>
            <circle cx="24" cy="8" r="1.5" fill="currentColor" />
            <path d="M24 8C20 8 16 12 16 16" stroke="currentColor" strokeWidth={0.5} className="opacity-0"
                animate={{ opacity: isActive ? 0.3 : 0 }}
            />
        </motion.g>
        <motion.g animate={{ rotate: isActive ? 360 : 0 }} transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1.5 }} style={{ originX: "50%", originY: "50%" }}>
            <circle cx="24" cy="40" r="1.5" fill="currentColor" className="opacity-60" />
        </motion.g>

        {/* Energy Zip Effect */}
        <motion.path
            d="M38 14L42 10"
            stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"
            animate={{ opacity: isActive ? [0, 1, 0] : 0, pathLength: isActive ? [0, 1] : 0 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.2 }}
        />
    </motion.svg>
);

export const IconScale = ({ className, strokeWidth = 1, isActive, ...props }: IconProps) => (
    <motion.svg viewBox="0 0 48 48" fill="none" className={className} {...props}>
        {/* Geodesic Sphere Construction */}

        {/* Vertical Axis Rotation */}
        <motion.g animate={{ rotateY: isActive ? 360 : 0 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} style={{ originX: "50%", originY: "50%" }}>
            {/* Note: true 3D isn't possible in simple SVG, simulating with ellipses modifying Rx */}
        </motion.g>

        {/* Simulated 3D Sphere Rings */}
        <motion.ellipse cx="24" cy="24" rx="20" ry="20" stroke="currentColor" strokeWidth={strokeWidth} className="opacity-10" />

        <motion.ellipse cx="24" cy="24" rx="20" ry="8" stroke="currentColor" strokeWidth={strokeWidth} className="opacity-30"
            animate={{ ry: isActive ? [8, 18, 8] : 8 }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.ellipse cx="24" cy="24" rx="8" ry="20" stroke="currentColor" strokeWidth={strokeWidth} className="opacity-30"
            animate={{ rx: isActive ? [8, 18, 8] : 8 }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        {/* Diagonal Axis Rings - Rotating */}
        <motion.path d="M10 10L38 38" stroke="currentColor" strokeWidth={0.5} className="opacity-20" />
        <motion.path d="M38 10L10 38" stroke="currentColor" strokeWidth={0.5} className="opacity-20" />

        {/* Orbiting Satellite 1 */}
        <motion.circle r="1.5" fill="currentColor"
            animate={{
                cx: isActive ? [4, 44, 4] : 4,
                cy: isActive ? [24, 24, 24] : 24,
                opacity: isActive ? [0.4, 1, 0.4] : 0.4,
                scale: isActive ? [0.8, 1.2, 0.8] : 1
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Orbiting Satellite 2 (Counter) */}
        <motion.circle r="1.5" fill="currentColor"
            animate={{
                cy: isActive ? [4, 44, 4] : 4,
                cx: isActive ? [24, 24, 24] : 24,
                opacity: isActive ? [0.2, 0.8, 0.2] : 0.2
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Connection Nodes */}
        <circle cx="24" cy="4" r="1" fill="currentColor" className="opacity-50" />
        <circle cx="24" cy="44" r="1" fill="currentColor" className="opacity-50" />
        <circle cx="4" cy="24" r="1" fill="currentColor" className="opacity-50" />
        <circle cx="44" cy="24" r="1" fill="currentColor" className="opacity-50" />
    </motion.svg>
);
