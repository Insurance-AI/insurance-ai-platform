"use client"


import { Button } from "@/components/ui/button"

export default function LoginButton() {
    return (
        <Button onClick={() => console.log("hello")} className="w-full">
            Login with Google
        </Button>
    )
}
