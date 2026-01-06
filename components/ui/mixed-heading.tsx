import { mondwest, playground } from "@/app/fonts"
import { cn } from "@/lib/utils"

interface MixedHeadingProps {
    primaryText: string;
    specialText: string;
    className?: string;
    isHeading?: boolean;
}

export function MixedHeading({ primaryText, specialText, className, isHeading = true }: MixedHeadingProps) {
    const Component = isHeading ? 'h2' : 'div';

    return (
        <Component className={cn("tracking-tight leading-[0.8] flex items-baseline flex-wrap", className)}>
            <span className="text-[#3D261A] font-light">{primaryText}</span>
            <span className="flex items-baseline ml-2 md:ml-4">
                {specialText.split('').map((char, i) => {
                    if (i === 0) return (
                        <span key={i} className={cn(playground.className, "text-[#BC8C73] relative top-[0.05em]")}
                            style={{ fontSize: '1.2em' }}>{char}</span>
                    );
                    if (i === 1) return (
                        <span key={i} className={cn(mondwest.className, "text-[#BC8C73] ml-1")}
                            style={{ fontSize: '0.7em' }}>{char}</span>
                    );
                    return (
                        <span key={i} className="text-[#BC8C73] font-light ml-0.5">{char}</span>
                    );
                })}
                {/* Solid block period */}
                <span className="inline-block w-[0.15em] h-[0.15em] bg-[#BC8C73] ml-2 md:ml-3 self-center translate-y-2" />
            </span>
        </Component>
    );
}
