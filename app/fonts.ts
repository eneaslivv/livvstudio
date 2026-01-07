import localFont from 'next/font/local'
import { Inter } from 'next/font/google'

export const inter = Inter({
    subsets: ['latin'],
    weight: ['300', '400', '500'],
    variable: '--font-inter',
})

export const mondwest = localFont({
    src: '../public/fonts/ppmondwest-regular.otf',
    variable: '--font-mondwest',
    display: 'swap',
})

export const playground = localFont({
    src: '../public/fonts/PPPlayground-Medium.otf',
    variable: '--font-playground',
    display: 'swap',
})
