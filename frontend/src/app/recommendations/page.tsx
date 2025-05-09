
import { redirect } from "next/navigation"
import RecommendationForm from "@/components/recommendation-form"

export default async function RecommendationsPage() {
    const session = true

    if (!session) {
        redirect("/")
    }

    return (
        <div className="container mx-auto max-w-4xl py-8">
            <h1 className="mb-8 text-center text-3xl font-bold">Insurance Recommendations</h1>
            <RecommendationForm />
        </div>
    )
}
