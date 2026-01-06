import type React from "react"
import type { Metadata } from "next"
import { inter, mondwest, playground } from "./fonts"
import { Analytics } from "@vercel/analytics/next"
import { SmoothScroll } from "@/components/ui/smooth-scroll"
import "./globals.css"
import { CustomCursor } from "@/components/custom-cursor"

export const metadata: Metadata = {
  title: "Shaders Landing Page",
  description: "Created with v0",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${mondwest.variable} ${playground.variable}`}>
      <body className={`${inter.className} font-light antialiased`}>
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <CustomCursor />
        <Analytics />
      </body>
    </html>
  )
}
