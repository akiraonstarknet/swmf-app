import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Starknet Will Melt Faces | SWMF',
  description: 'Starknet to be the first L2 to settle on both Bitcoin and Ethereum',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
