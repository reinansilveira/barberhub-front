import { Inter, K2D, Montserrat, Archivo } from 'next/font/google'

export const k2d = K2D({
    weight: ['600', '700', '800'],
    display: 'swap',
    subsets: ['latin'],
    variable: '--font-k2d',
    preload: true,
    adjustFontFallback: true,
})

export const inter = Inter({
    display: 'swap',
    subsets: ['latin'],
    variable: '--font-inter',
    preload: true,
    adjustFontFallback: true,
})

export const montserrat = Montserrat({
    weight: ['300', '400', '500', '600', '700', '800'],
    display: 'swap',
    subsets: ['latin'],
    variable: '--font-montserrat',
    preload: true,
    adjustFontFallback: true,
})

export const archivo = Archivo({
    weight: ['300', '400', '500', '600', '700', '800'],
    display: 'swap',
    subsets: ['latin'],
    variable: '--font-archivo',
    preload: true,
    adjustFontFallback: true,
})