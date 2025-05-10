
import { redirect } from "next/navigation"
import RecommendationForm from "@/components/recommendation-form"
import { Metadata } from "next";
import TransactionUploadForm from "@/components/forms/transaction-upload-form";

export const metadata: Metadata = {
    title: "Upload Transactions | Insurance Recommendation System",
    description: "Upload your transactions to get personalized insurance recommendations",
};
export default async function RecommendationsPage() {
    const session = true

    if (!session) {
        redirect("/")
    }

    return (
        <div className="container mx-auto max-w-4xl py-8">
            <h1 className="mb-8 text-center text-3xl font-bold">Insurance Recommendations</h1>
            <RecommendationForm />
         <div className="container mx-auto py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Get Your Insurance Recommendations</h1>
          <p className="text-gray-600">
            Upload your transaction data to receive personalized insurance recommendations based on
            your spending patterns.
          </p>
        </div>
        
        <TransactionUploadForm />
        
        <div className="mt-12 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-medium mb-2 text-blue-800">How It Works</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Upload your transaction file (CSV, Excel, or JSON format)</li>
              <li>Our AI analyzes your spending patterns and financial behavior</li>
              <li>Receive personalized insurance recommendations based on your needs</li>
              <li>Explore detailed analytics about your financial habits</li>
            </ol>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium mb-2">Your Privacy Matters</h2>
            <p className="text-gray-600">
              All your data is processed securely and confidentially. We never store your raw
              transaction data after analysis. Your information is only used to provide you with
              personalized recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
   <div className="container mx-auto py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Get Your Insurance Recommendations</h1>
          <p className="text-gray-600">
            Upload your transaction data to receive personalized insurance recommendations based on
            your spending patterns.
          </p>
        </div>
        
        <TransactionUploadForm />
        
        <div className="mt-12 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-medium mb-2 text-blue-800">How It Works</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Upload your transaction file (CSV, Excel, or JSON format)</li>
              <li>Our AI analyzes your spending patterns and financial behavior</li>
              <li>Receive personalized insurance recommendations based on your needs</li>
              <li>Explore detailed analytics about your financial habits</li>
            </ol>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium mb-2">Your Privacy Matters</h2>
            <p className="text-gray-600">
              All your data is processed securely and confidentially. We never store your raw
              transaction data after analysis. Your information is only used to provide you with
              personalized recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
        </div>
    )
}
