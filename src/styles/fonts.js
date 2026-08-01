import { Poppins, Open_Sans } from 'next/font/google'

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal'],
  variable: '--font-poppins',
  display: 'swap',
})

export const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  style: ['normal'],
  variable: '--font-open-sans',
  display: 'swap',
})
