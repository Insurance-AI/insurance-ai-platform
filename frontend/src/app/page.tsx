import Link from "next/link"
import { Button } from "@/components/ui/button"
import LoginButton from "@/components/login-button"

export default async function Home() {
  const session = true

  return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 rounded-lg border p-8 shadow-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Insurance Recommendation System</h1>
            <p className="mt-2 text-muted-foreground">Find the perfect insurance policy for your needs</p>
          </div>

          <div className="space-y-4 pt-4">
            {!session ? (
                <LoginButton />
            ) : (
                <div className="space-y-4">
                  <p className="text-center text-sm text-muted-foreground">
                    Logged in as
                  </p>
                  <Link href="/recommendations" className="w-full">
                    <Button className="w-full">Go to Recommendations</Button>
                  </Link>
                </div>
            )}
          </div>
        </div>
      </div>
  )
}
