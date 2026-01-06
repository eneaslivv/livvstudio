import type React from "react"
import type { Metadata } from "next"
import { inter, mondwest, playground } from "./fonts"
import { Analytics } from "@vercel/analytics/next"
import { SmoothScroll } from "@/components/ui/smooth-scroll"
import "./globals.css"
import { CustomCursor } from "@/components/custom-cursor"

export const metadata: Metadata = {
  title: "Livv Studio | Creative Design & Technical Excellence",
  description: "Crafting exceptional digital products, brand identities, and high-performance web experiences with technical excellence and cinematic motion.",
  keywords: ["Design Studio", "Web Development", "Next.js", "Cinematic Motion", "Digital Products", "Brand Identity"],
  authors: [{ name: "Livv" }],
  creator: "Livv",
  publisher: "Livv",
  metadataBase: new URL("https://livvvv.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://livvvv.com",
    siteName: "Livv Studio",
    title: "Livv Studio | Creative Design & Technical Excellence",
    description: "Crafting exceptional digital products, brand identities, and high-performance web experiences.",
    images: [
      {
        url: "/assets/og-image.png", // Assuming this might be created or exists later
        width: 1200,
        height: 630,
        alt: "Livv Studio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Livv Studio | Creative Design & Technical Excellence",
    description: "Crafting exceptional digital products, brand identities, and high-performance web experiences.",
    creator: "@livvstudio", // Placeholder
    images: ["/assets/og-image.png"],
  },
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
