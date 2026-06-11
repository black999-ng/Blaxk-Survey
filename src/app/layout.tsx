import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BUK Developer — Marketplace Survey',
  description: 'Help us build the right features for the student marketplace at BUK.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
