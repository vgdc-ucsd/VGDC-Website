import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { Providers } from './providers';

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VGDC @ UC San Diego",
  description: "Video Game Development Club at UC San Diego",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
         <Providers>
        <main>{children}</main>
        <Toaster />
        </Providers>
      </body>
    </html>
  )
}
