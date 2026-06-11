import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BUK Housing — Feature Survey',
  description: 'Help us build the right features for your housing experience at BUK.',
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
