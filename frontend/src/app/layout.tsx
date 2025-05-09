import type React from "react"
import {Inter} from "next/font/google"
import "./globals.css"

const inter = Inter({subsets: ["latin"]})

export const metadata = {
    title: "Insurance Recommendation System",
    description: "Find the perfect insurance policy for your needs",
}

export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode
}) {


    return (
        <html lang="en">
        <body className={inter.className}>
        {children}
        </body>
        </html>
    )
}
