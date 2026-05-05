import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
import Script from "next/script";




export const metadata: Metadata = {
  title: 'LoanExpert - Loan & Eligibility Calculator',
  description: 'Calculate your loan eligibility and EMI with ease with LoanExpert.',
  generator: 'v0.app',
  icons: {
    icon: '/icon.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
      <Script
          id="leadmind-tracker"
          src="http://localhost:8000/public/sdk/leadmind-tracker.js"
          data-api-key="lm_live_U3gJ-qz0GyrEKwRMswQiXS2xArTKJpJd"
          data-api-host="http://localhost:8000"
          strategy="afterInteractive"
        />
        {children}

        <Analytics />
      </body>
    </html>
  )
}
