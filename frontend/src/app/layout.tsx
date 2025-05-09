import type React from "react"
import {Inter} from "next/font/google"
import "./globals.css"
import {
    ClerkProvider,
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'

import {Geist, Geist_Mono} from 'next/font/google'


const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})


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
        <ClerkProvider>
            <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable}  ${inter.className} antialiased`}>
            <header className="flex justify-end items-center p-4 gap-4 h-16">
                <SignedOut>
                    <SignInButton/>
                </SignedOut>
                <SignedIn>
                    <UserButton/>
                </SignedIn>
            </header>
            {children}
            </body>
            </html>
        </ClerkProvider>

    )
}
