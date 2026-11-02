import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { Providers } from './providers';
import { Suspense } from "react";
import QueryParamHandler from "@/components/global/QueryParamHandler";

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
    <html lang="en" className="bg-background-black">
      <body className={inter.className}>
         <Providers>
        <Suspense fallback={null}>
          <QueryParamHandler />
        </Suspense>
        <main>{children}</main>
        <Toaster />
        </Providers>
      </body>
    </html>
  )
}
