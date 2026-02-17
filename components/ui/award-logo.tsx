"use client"

type AwardLogoProps = {
  color?: string
  size?: number
  className?: string
}

export function AwardLogo({ color = "#ffffff", size = 84, className }: AwardLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 84 100"
      role="img"
      aria-label="DesignRush award emblem"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M42 8c10 0 18 12 18 22 0 14-18 32-18 50-5-12-18-34-18-50 0-10 8-22 18-22z"
        fill={color}
      />
      <path
        d="M12 38 42 88 72 38 60 38 42 64 24 38z"
        fill={color}
      />
      <path
        d="M14 54c0-12 28-22 28-22s28 10 28 22c0 8-4 10-9 10H23c-5 0-9-2-9-10z"
        fill={color}
        opacity={0.2}
      />
    </svg>
  )
}
