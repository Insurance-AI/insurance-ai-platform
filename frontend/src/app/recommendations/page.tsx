import { redirect } from "next/navigation"
import RecommendationForm from "@/components/recommendation-form"
import { Metadata } from "next";
import TransactionUploadForm from "@/components/forms/transaction-upload-form";
import { Shield, BarChart, Upload, FilePlus2, FileQuestion, Coins, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Insurance Recommendations | Financial Protection Analysis",
  description: "Get personalized insurance recommendations based on your spending habits and life situation",
};

export default async function RecommendationsPage() {
  const session = true

  if (!session) {
    redirect("/")
  }

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="container mx-auto max-w-5xl py-10 px-4 sm:px-6">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-3 text-gray-900">Personalized Insurance Analysis</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Get tailored insurance recommendations based on your financial behaviors and life situation.
          </p>
        </header>

        {/* Tab Style Header */}
        <div className="flex flex-col sm:flex-row justify-center mb-8 border-b border-gray-200">
          <div className="flex-1 max-w-md mx-auto">
            <div className="flex justify-center">
              <div className="text-center px-4 py-2 border-b-2 border-blue-600">
                <div className="flex items-center justify-center mb-2">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Coins className="h-5 w-5 text-blue-700" />
                  </div>
                </div>
                <h2 className="font-medium text-blue-800">Financial Protection Hub</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout for Main Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Transaction Analysis */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
              <div className="flex items-center mb-2">
                <div className="bg-white p-2 rounded-full shadow-sm mr-3">
                  <FilePlus2 className="h-5 w-5 text-blue-700" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Transaction Analysis</h2>
              </div>
              <p className="text-gray-600 text-sm">
                Upload your transaction history for AI-powered insurance gap analysis
              </p>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 text-gray-700">How This Works:</h3>
                <ol className="list-decimal pl-5 space-y-2 text-gray-600 text-sm mb-6">
                  <li>Upload your bank transaction data</li>
                  <li>Our AI identifies spending patterns and potential risks</li>
                  <li>Receive a comprehensive insurance coverage analysis</li>
                </ol>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Supported File Formats</h3>
                <div className="flex space-x-3 text-xs">
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded font-medium">CSV</span>
                  <span className="bg-green-50 text-green-700 px-2 py-1 rounded font-medium">XLSX</span>
                  <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded font-medium">JSON</span>
                </div>
              </div>
              <TransactionUploadForm />
              <div className="text-center mt-4">
                <a 
                  href="/recommendations/transactions" 
                  className="inline-flex items-center text-blue-600 text-sm font-medium hover:text-blue-800"
                >
                  View detailed transaction analysis
                  <ChevronRight className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
          </div>

          {/* Life Insurance Recommendation */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4">
              <div className="flex items-center mb-2">
                <div className="bg-white p-2 rounded-full shadow-sm mr-3">
                  <FileQuestion className="h-5 w-5 text-indigo-700" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Life Insurance Assessment</h2>
              </div>
              <p className="text-gray-600 text-sm">
                Answer a few questions to determine your optimal life insurance needs
              </p>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 text-gray-700">Personalized Recommendations:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <div className="bg-indigo-100 p-1 rounded-full mr-2 mt-0.5">
                      <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
                    </div>
                    Calculate optimal coverage amounts based on your life situation
                  </li>
                  <li className="flex items-start">
                    <div className="bg-indigo-100 p-1 rounded-full mr-2 mt-0.5">
                      <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
                    </div>
                    Compare different policy types that fit your needs
                  </li>
                  <li className="flex items-start">
                    <div className="bg-indigo-100 p-1 rounded-full mr-2 mt-0.5">
                      <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
                    </div>
                    Understand your unique risk factors and coverage requirements
                  </li>
                </ul>
              </div>

              <div className="text-center mt-4">
                <a 
                  href="/recommendations/form" 
                  className="inline-flex items-center text-indigo-600 text-sm font-medium hover:text-indigo-800"
                >
                  Complete detailed assessment
                  <ChevronRight className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Info Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 mb-10">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center mb-3">
              <div className="bg-blue-100 p-2 rounded-lg mr-2">
                <BarChart className="h-4 w-4 text-blue-700" />
              </div>
              <h2 className="text-lg font-medium text-blue-800">Data Analysis</h2>
            </div>
            <p className="text-sm text-gray-600">
              Our AI evaluates spending patterns to identify risk areas and insurance gaps in your financial protection.
            </p>
          </div>
          
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center mb-3">
              <div className="bg-indigo-100 p-2 rounded-lg mr-2">
                <Upload className="h-4 w-4 text-indigo-700" />
              </div>
              <h2 className="text-lg font-medium text-indigo-800">Easy Upload</h2>
            </div>
            <p className="text-sm text-gray-600">
              Simple and secure file upload with immediate processing and analysis of your transaction history.
            </p>
          </div>
          
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center mb-3">
              <div className="bg-gray-200 p-2 rounded-lg mr-2">
                <Shield className="h-4 w-4 text-gray-700" />
              </div>
              <h2 className="text-lg font-medium text-gray-800">Privacy Protected</h2>
            </div>
            <p className="text-sm text-gray-600">
              Your data is encrypted and never stored after analysis. We adhere to strict security protocols.
            </p>
          </div>
        </div>
        
        {/* Footer note */}
        <div className="bg-white rounded-lg border border-gray-100 p-4 mt-8 text-center text-sm text-gray-600">
          <p className="mb-1 font-medium">Need assistance with your insurance analysis?</p>
          <p>
            Our insurance specialists are available at{" "}
            <a href="mailto:support@example.com" className="text-blue-600 hover:underline font-medium">
              support@example.com
            </a>
            {" "}or call us at{" "}
            <span className="text-blue-600 font-medium">1-800-INS-HELP</span>
          </p>
        </div>
      </div>
    </div>
  )
}